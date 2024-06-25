function add_carro(){
    container = document.getElementById("form-carro")
    html = '<br> <div class="row">' +
        '<div class="col-md"> <input type="text" name="carros" placeholder="carro" class="form-control"> </div>' +
        '<div class="col-md"> <input type="text" name="placas" placeholder="Placa" class="form-control"> </div>' +
        '<div class="col-md"> <input type="number" name="ano" placeholder="Ano" class="form-control"> </div>' +
        '</div>'
    
    container.innerHTML += html;
}

function exibir_form(acao) {
    adicionar_cliente = document.getElementById("add_cliente")
    atualizar_cliente = document.getElementById("att_cliente")

    if(acao == "adicionar") {
        adicionar_cliente.style.display = "block"
        atualizar_cliente.style.display = "none"
    }
    else if (acao == "atualizar") {
        adicionar_cliente.style.display = "none"
        atualizar_cliente.style.display = "block"
    }
}

function cliente_dados() {
    cliente = document.getElementById("select-cliente")
    csrf_token = document.querySelector("[name=csrfmiddlewaretoken]").value

    data = new FormData()
    data.append('id_cliente', cliente.value)

    if (cliente.value != '-1') {
        fetch("/cliente/view_cliente/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrf_token 
            },
            body: data
        }).then(function(result){
            return result.json()
        }).then(function(data) {
            //id_pessoa ser diferente de none, retorna os valores

            document.getElementById("form-atualiza-cliente").style.display = "block"

            cliente = document.querySelector('.dados_cliente')
            cliente.innerHTML = ""
            cliente.innerHTML += '<form action="/cliente/atualizar_pessoa/'+data["cliente"]['id_cliente']+'" class="atualizar_pessoa" method="POST">' +
            '<input type="hidden" name="csrfmiddlewaretoken" value="'+csrf_token+'">' +
            '<div class="col-md">'+
                '<p>Nome:</p>'+
                '<input type="text" class="form-control" placeholder="Primeiro nome" name="nome" id="nome"'+
                    'value="'+ data["cliente"]['fields']["nm_pessoa"]+ '" >'+
            '</div>'+
            '<div class="col-md">'+
                '<p>Sobrenome:</p>'+
                '<input type="text" class="form-control" placeholder="Sobrenome" name="sobrenome" id="sobrenome"'+ 
                    'value="'+data["cliente"]['fields']["nm_sbrnome"]+'">'+
            '</div>'+
            '<div class="col-md">'+
                '<p>E-mail:</p>'+
                '<input type="email" class="form-control" placeholder="nome@email.com" name="email" id="email"'+
                    'value="'+data["cliente"]['fields']["ds_email"]+'">'+
            '</div>'+
            '<div class="col-md">'+
                '<p>CPF:</p>'+
                '<input type="text" class="form-control" placeholder="___.___.___-__" name="cpf" id="cpf"'+
                    'value="'+data["cliente"]['fields']["nr_cpf"]+'">'+
            '</div>'+
            '<br><input type="submit" class="btn btn-success" value="Salvar Alteração"> ' + 
            '</form>'
            
            veiculos = document.getElementById("veiculo")
            veiculo.innerHTML = ""

            for(i=0; i<data["veiculo"].length; i++) {
                veiculo.innerHTML += '<form action="/cliente/atualizar_veiculo/'+ data['veiculo'][i]['id_veiculo']+'" method="POST">' +
                '<input type="hidden" name="csrfmiddlewaretoken" value="'+csrf_token+'">' +
                '<div class="row"> ' +
                    '<div class="col-md">' + 
                    '<input type="text" name="veiculo" placeholder="veiculo" class="form-control" ' +
                        'value="'+ data['veiculo'][i]['fields']['nm_veiculo'] + '" > ' + 
                    '</div>' +
                    '<div class="col-md"> ' +
                    '<input type="text" name="placa" placeholder="Placa" class="form-control" ' +
                        'value="'+ data['veiculo'][i]['fields']['nr_placa'] + '" > ' + 
                        '<p class="hidden {{ aviso_placa }}">A Placa informado já está cadastrado em nosso sistema.</p>' + 
                    '</div>' +
                    '<div class="col-md"> ' +
                    '<input type="number" name="ano" placeholder="Ano" class="form-control" ' +
                        'value="'+ data['veiculo'][i]['fields']['nr_ano'] +'" >' + 
                    '</div>' +
                    '<input type="submit" class="btn btn-success" value="Salvar Alteração"> ' + 
                    '<a class="btn btn-danger" href="/cliente/deletar_veiculo/' +data['veiculo'][i]['id_veiculo'] +'">Excluir</a>' +
                '</div>' + 
                '</form>' +
                '<br>'
            }    
        })
    }
    else {
        //id_pessoa ser igual none, oculte os campos
        document.getElementById("form-atualiza-cliente").style.display = "none"
    }
}

function Inserir_novo_veiculo() {
    veiculo = document.getElementById("veiculo")
    cliente = document.getElementById("select-cliente")


    veiculo.innerHTML += '<form action="/cliente/inserir_veiculo/'+ cliente.value +'" method="POST">' +
    '<input type="hidden" name="csrfmiddlewaretoken" value="'+ csrf_token +'">' +
    '<div class="row"> ' +
        '<div class="col-md">' + 
        '<input type="text" name="veiculo" placeholder="veiculo" class="form-control" ' +
            'value="" > ' + 
        '</div>' +
        '<div class="col-md"> ' +
        '<input type="text" name="placa" placeholder="Placa" class="form-control" ' +
            'value="" > ' + 
            '<p class="hidden {{ aviso_placa }}">A Placa informado já está cadastrado em nosso sistema.</p>' + 
        '</div>' +
        '<div class="col-md"> ' +
        '<input type="number" name="ano" placeholder="Ano" class="form-control" ' +
            'value="" >' + 
        '</div>' +
        '<input type="submit" class="btn btn-success" value="Salvar Alteração"> ' + 
        '<a class="btn btn-danger" href="/cliente/deletar_veiculo/">Excluir</a>' +
    '</div>' + 
    '</form>' +
    '<br>'

}