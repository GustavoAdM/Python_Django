from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.core.exceptions import ValidationError
from django.core.serializers import serialize
from .models import Cliente, Veiculo
from json import loads
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from django.shortcuts import redirect


def cliente(request):
    # tratativas de erros
    def handle_cpf_error(request, contexto):
        contexto['aviso_cpf'] = 'not'
        return render(request, 'cliente.html', contexto)

    def handle_placa_error(request, contexto):
        contexto['aviso_placa'] = 'not'
        return render(request, 'cliente.html', contexto)

    # Inicio da view
    list_cliente = Cliente.objects.all().order_by('id_pessoa')

    if request.method == 'GET':
        return render(request, 'cliente.html', {'clientes': list_cliente})
    elif request.method == "POST":
        nome_cliente = request.POST.get('nome')
        sobrenome_cliente = request.POST.get('sobrenome')
        email_cliente = request.POST.get('email')
        cpf_cliente = request.POST.get('cpf')
        nome_veiculo = request.POST.getlist('carros')
        placa_veiculo = request.POST.getlist('placas')
        ano_veiculo = request.POST.getlist('ano')

        # Adionando informações no banco de dados
        try:
            cliente = Cliente(
                nm_pessoa=nome_cliente,
                nm_sbrnome=sobrenome_cliente,
                ds_email=email_cliente,
                nr_cpf=cpf_cliente,
                st_ativo='S',
            )
            cliente.full_clean()
            cliente.save()

            for _nome_veiculo, _placa_veiculo, _ano_veiculo in zip(nome_veiculo, placa_veiculo, ano_veiculo):
                veiculo = Veiculo(
                    id_pessoa=cliente,
                    nm_veiculo=_nome_veiculo,
                    nr_placa=_placa_veiculo,
                    nr_ano=_ano_veiculo,
                    nr_lavagem=0,
                )
                veiculo.full_clean()
                veiculo.save()

        except ValidationError as e:
            contexto = {'nome': nome_cliente, 'sobrenome': sobrenome_cliente,
                        'email': email_cliente, 'cpf': cpf_cliente,
                        'veiculos': zip(nome_veiculo, placa_veiculo, ano_veiculo),
                        'clientes': list_cliente, 'aviso_cpf': '', 'aviso_placa': ''}

            if 'nr_cpf' in e.message_dict:
                return handle_cpf_error(request, contexto)
            elif 'nr_placa' in e.message_dict:
                Cliente.objects.filter(id_pessoa=cliente.id_pessoa).delete()
                return handle_placa_error(request, contexto)

        return render(request, 'cliente.html', {'clientes': list_cliente})


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


def atualizar_veiculo(request, id):
    # Coletando dados do front ENd
    veiculo = request.POST.get('veiculo')
    placa = request.POST.get('placa')
    ano = request.POST.get('ano')

    # Atualizando dados do front end
    Veiculo.objects.filter(id_veiculo=id).update(
        nm_veiculo=veiculo, nr_placa=placa, nr_ano=ano)

    return HttpResponse('Veiculo Atualizado')


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

    return HttpResponse('Deletado com sucesso')


def inserir_veiculo(request, id_cliente):
    # Coletar dados do veiculo no FrontEnd
    veiculo = request.POST.get('veiculo')
    placa = request.POST.get('placa')
    ano = request.POST.get('ano')

    # Inserindo dados no banco com validação de erro
    try:
        veiculo = Veiculo(
            id_pessoa=Cliente.objects.get(id_pessoa=id_cliente),
            nm_veiculo=veiculo,
            nr_placa=placa,
            nr_ano=ano,
            nr_lavagem=0,
        )
        veiculo.full_clean()
        veiculo.save()
    except ValidationError as e:
        contexto = {}
        return HttpResponse(f'<h1>Erro: A placa informada ja existe</h1>')
    return HttpResponse(f'Alteração realizada')
