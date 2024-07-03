from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.core.exceptions import ValidationError
from django.core.serializers import serialize
from .models import Cliente, Veiculo
from json import loads
from django.urls import reverse
from django.shortcuts import redirect
from apps.cliente.messege_info import messege_approved, messege_error

def cliente(request):
    # Inicio da view
    list_cliente = Cliente.objects.all().order_by('id_pessoa')

    if request.method == 'GET':
        return render(request, 'cliente.html', {'clientes': list_cliente})
    elif request.method == "POST":
        body = loads(request.body)

        try:
            cliente = Cliente(
                nm_pessoa=body['nome'],
                nm_sbrnome=body['sobrenome'],
                ds_email=body['email'],
                nr_cpf=body['cpf'],
                st_ativo='S',
            )
            cliente.full_clean() #validação dos dados
            cliente.save()

            for veiculo in body['veiculo'].values():
                veiculo = Veiculo(
                    id_pessoa=cliente,
                    nm_veiculo=veiculo['nome_veiculo'],
                    nr_placa=veiculo['placa_veiculo'],
                    nr_ano=veiculo['ano_veiculo'],
                    nr_lavagem=0,
                )
                veiculo.full_clean()
                veiculo.save()

        except ValidationError as e:
            if 'nr_cpf' in e.message_dict:
                return JsonResponse({'INFO': 'O CPF informado já está cadastrado em nosso sistema.'}) 
            elif 'nr_placa' in e.message_dict:
                Cliente.objects.filter(id_pessoa=cliente.id_pessoa).delete()
                return JsonResponse({'INFO': 'A Placa informado já está cadastrado em nosso sistema.'})
        return render(request, 'cliente.html', JsonResponse({'INFO': 'Cadastro Salvo'}))    
        #return render(request, 'cliente.html', {'clientes': list_cliente})


def view_cliente(request):
    id_cliente = request.POST.get('id_cliente')
    filter_cliente = Cliente.objects.filter(id_pessoa=id_cliente)
    filter_veiculos = Veiculo.objects.filter(
        id_pessoa=filter_cliente[0].id_pessoa)

    # Carregar todos os dados do cliente em formato json
    try:
        dados_cliente = loads(serialize(
            'json', filter_cliente))[0]
        dados_cliente = {'id_cliente': dados_cliente['pk'],
                         'fields': dados_cliente['fields']}
    except IndexError:
        dados_cliente = {'id_pessoa': 'none'}

    # Carrega os veiculos assodiado ao cliente
    try:
        dados_veiculo = loads(
            serialize('json', filter_veiculos))
        dados_veiculo = [{'fields': veiculo['fields'],
                          'id_veiculo': veiculo['pk']} for veiculo in dados_veiculo]
    except IndexError:
        dados_veiculo = {'id_veiculo': 'none'}
    data_json = {'cliente': dados_cliente, 'veiculo': dados_veiculo}
    return JsonResponse(data_json)


def atualizar_veiculo(request):
    # Coletando dados do corpo do front end
    body = loads(request.body)

    for value in body.values():
        id_veiculo = value['id_veiculo']
        nome_veiculo = value['nm_veiculo']
        placa = value['nr_placa']
        ano = value['nr_ano']
        try:
            Veiculo.objects.filter(id_veiculo=id_veiculo).update(
                nm_veiculo=nome_veiculo, nr_placa=placa, nr_ano=ano)
        except ValidationError as e:
            return JsonResponse(messege_error(list(e.message_dict.values())[0]))
    return JsonResponse(messege_approved('Veiculo atualizado'))


def atualizar_pessoa(request, id):
    # Coletando dados do cliente
    nome_pessoa = request.POST.get('nome')
    sobrenome_pessoa = request.POST.get('sobrenome')
    email_pessoa = request.POST.get('email')
    cpf_pessoa = request.POST.get('cpf')

    # Filtrando o cliente pelo id_pessoa(PK) e atualizando dados
    Cliente.objects.filter(id_pessoa=id).update(nm_pessoa=nome_pessoa, nm_sbrnome=sobrenome_pessoa,
                                                ds_email=email_pessoa, nr_cpf=cpf_pessoa)
    return HttpResponse("Cliente atualizado")


def deletar_veiculo(request, id):
    # Deletando veiculo
    try:
        veiculo = Veiculo.objects.get(id_veiculo=id)
        veiculo.delete()
    except:
        return redirect(reverse('cliente'))
    return redirect(reverse('cliente'))


def inserir_veiculo(request):
    body = loads(request.body)
    id = body['id_pessoa']

    # Inserindo dados no banco com validação de erro
    for value in body.values():
        if type(value) is dict:
            try:
                veiculo = Veiculo(
                    id_pessoa=Cliente.objects.get(id_pessoa=id),
                    nm_veiculo=value['nm_veiculo'],
                    nr_placa=value['nr_placa'],
                    nr_ano=value['nr_ano'],
                    nr_lavagem=0,
                )
                veiculo.full_clean()
                veiculo.save()
            except ValidationError as e:
                return JsonResponse(messege_error(list(e.message_dict.values())[0]))
    return JsonResponse(messege_approved('Veiculo inserido'))
