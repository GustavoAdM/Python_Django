var csrf_token = document.querySelector("[name=csrfmiddlewaretoken]").value
function menssege_info(messege) {
    let popup = document.getElementById("popup");
    popup.className = "popup show";
    popup.innerHTML += messege["info"]
    setTimeout(function(){ 
        popup.className = popup.className.replace("show", "");
        popup.innerHTML = "" 
    }, 5000);
}


function novo_cadastro() {
    form_cadastro = document.querySelector(".novo-cadastro")

    nome_cliente = form_cadastro.querySelector("#nome_cliente").value
    sbrnome_cliente = form_cadastro.querySelector("#sbrnome_cliente").value
    email_cliente = form_cadastro.querySelector("#email_cliente").value
    cpf_cliente = form_cadastro.querySelector("#cpf_cliente").value

    nome_veiculo = form_cadastro.querySelectorAll("#carros")
    placa_veiculo = form_cadastro.querySelectorAll("#placas")
    ano_veiculo = form_cadastro.querySelectorAll("#ano")

    veiculo = {}//Lista vazia
    for(i=0; i < placa_veiculo.length; i++) {
        //Pega todos os campos e adiciona os veiculos criando:  veiculo{0: {dados do veiculo}}
        veiculo[i] = {
            nome_veiculo: nome_veiculo[i].value,
            placa_veiculo: placa_veiculo[i].value,
            ano_veiculo: ano_veiculo[i].value
        }
    }

    data = {
        nome: nome_cliente,
        sobrenome: sbrnome_cliente,
        email: email_cliente,
        cpf: cpf_cliente,
        veiculo
    }

    fetch('/cliente/',{
        method: "POST",
        headers: {
            "X-CSRFToken": csrf_token 
        },
        body: JSON.stringify(data)
    } ).then(function(result) {
        return result.json()
    }).then(function(data) {
        menssege_info(data)
    })
}

function add_carro(){
    container = document.getElementById("form-carro")
    html = '<br> <div class="row">' +
        '<div class="col-md"> <input type="text" name="carros" id="carros" placeholder="carro" class="form-control"> </div>' +
        '<div class="col-md"> <input type="text" name="placas" id="placas" placeholder="Placa" class="form-control"> </div>' +
        '<div class="col-md"> <input type="number" name="ano" id="ano" placeholder="Ano" class="form-control"> </div>' +
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
            
            veiculo = document.getElementById("veiculo")
            veiculo.innerHTML = ""
            
            
            if (document.getElementById("atualizar-veiculo") == null) {
                veiculo.innerHTML += '<form id="atualizar-veiculo" method="POST">' +
                '<input type="hidden" name="csrfmiddlewaretoken" value="'+csrf_token+'">' +
                '</form>'

                form_veiculo = document.getElementById("atualizar-veiculo")  
                for(i=0; i<data["veiculo"].length; i++) {
                    form_veiculo.innerHTML += 
                    '<div class="row"> ' +
                        '<input type="hidden" name="id_veiculo" id="id_veiculo" value="'+data['veiculo'][i]['id_veiculo']+'">' +
                        '<div class="col-md">' + 
                        '<input type="text" name="veiculo" id="nm_veiculo" placeholder="veiculo" class="form-control" ' +
                            'value="'+ data['veiculo'][i]['fields']['nm_veiculo'] + '" > ' + 
                        '</div>' +
                        '<div class="col-md"> ' +
                        '<input type="text" name="placa" placeholder="Placa" id="nr_placa" class="form-control" ' +
                            'value="'+ data['veiculo'][i]['fields']['nr_placa'] + '" > ' + 
                            '<p class="hidden {{ aviso_placa }}">A Placa informado já está cadastrado em nosso sistema.</p>' + 
                        '</div>' +
                        '<div class="col-md"> ' +
                        '<input type="number" name="ano" placeholder="Ano" id="nr_ano" class="form-control" ' +
                            'value="'+ data['veiculo'][i]['fields']['nr_ano'] +'" >' + 
                        '</div>' +
                        '<a class="btn btn-danger" href="/cliente/deletar_veiculo/' +data['veiculo'][i]['id_veiculo'] +'">Excluir</a>' +
                    '</div>' + 
                    '</form>' +
                    '<br>'
                }
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

    //Adicionando um formulario para novos veiculos
    if (document.getElementById("inserir-veiculo") == null) {
        veiculo.innerHTML += '<form id="inserir-veiculo" method="POST">' +
        '<input type="hidden" name="csrfmiddlewaretoken" value="'+ csrf_token +'">' +
        '<div class="row"> ' +
            '<div class="col-md">' + 
            '<input type="text" name="veiculo" id="nm_veiculo" placeholder="veiculo" class="form-control" ' +
                'value="" > ' + 
            '</div>' +
            '<div class="col-md"> ' +
            '<input type="text" name="placa" id="nr_placa" placeholder="Placa" class="form-control" ' +
                'value="" > ' + 
            '</div>' +
            '<div class="col-md"> ' +
            '<input type="number" name="ano" id="nr_ano" placeholder="Ano" class="form-control"' +
                'value="" >' + 
            '</div>' +
            '<a class="btn btn-danger" href="/cliente/deletar_veiculo/">Excluir</a>' +
        '</div><br>' +
        '</form>' 
        '<br>' 
    } else {
        // Se o formulario ja existe, adicionar apenas os campos
        form_veiculo = document.getElementById("inserir-veiculo")
        form_veiculo.innerHTML += '<div class="row"> ' +
            '<div class="col-md">' + 
            '<input type="text" name="veiculo" id="nm_veiculo" placeholder="veiculo" class="form-control" ' +
                'value="" > ' + 
            '</div>' +
            '<div class="col-md"> ' +
            '<input type="text" name="placa" id="nr_placa" placeholder="Placa" class="form-control" ' +
                'value="" > ' + 
            '</div>' +
            '<div class="col-md"> ' +
            '<input type="number" name="ano" id="nr_ano" placeholder="Ano" class="form-control" ' +
                'value="" >' + 
            '</div>' + 
            '<a class="btn btn-danger" href="/cliente/deletar_veiculo/">Excluir</a>' +
        '</div><br>'
    }
}

function Salvar_veiculo(){
    novo_veiculo = document.getElementById("inserir-veiculo")
    atualiza_veiculo = document.getElementById("atualizar-veiculo")

    if(atualiza_veiculo != null) {
        id_veiculo = atualiza_veiculo.querySelectorAll("#id_veiculo")
        nm_veiculo = atualiza_veiculo.querySelectorAll("#nm_veiculo")
        nr_placa = atualiza_veiculo.querySelectorAll("#nr_placa")
        nr_ano = atualiza_veiculo.querySelectorAll("#nr_ano")

        data = {} // Criar um dicionario vazio
        for(i=0; i < nr_placa.length; i++) {
            /*Adiciona outro dicionario dentro ficando {0: {dados do veiclo}}
            {0: {nm_veiculo = "kwid", nr_placa = 12346}
            1: {outro veiculo} } */ 
            data[i] = {
                id_veiculo: id_veiculo[i].value,
                nm_veiculo: nm_veiculo[i].value,
                nr_placa: nr_placa[i].value,
                nr_ano: nr_ano[i].value
            };   
        }

        //Atualizando os veiculos
        fetch("/cliente/atualizar_veiculo/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrf_token 
            },
            body: JSON.stringify(data)
        }).then(function(result) {
            return result.json()
        }).then(function(data) {
            if(data["INFO"] == "400") {
                if(novo_veiculo != null) {
                    //adicionando novos veiculos
                    nm_veiculo = novo_veiculo.querySelectorAll("#nm_veiculo")
                    nr_placa = novo_veiculo.querySelectorAll("#nr_placa")
                    nr_ano = novo_veiculo.querySelectorAll("#nr_ano")
                    cliente = document.getElementById("select-cliente").value
            
                    data = {id_pessoa: cliente} // Criar um dicionario vazio
                    for(i=0; i < nr_placa.length; i++) {
                        /*Adiciona outro dicionario dentro ficando {0: {dados do veiclo}}
                        {0: {nm_veiculo = "kwid", nr_placa = 12346}
                        1: {outro veiculo} } */ 
                        data[i] = {
                            nm_veiculo: nm_veiculo[i].value,
                            nr_placa: nr_placa[i].value,
                            nr_ano: nr_ano[i].value
                        };   
                    }
            
                    fetch("/cliente/inserir_veiculo/", {
                        method: "POST",
                        headers: {
                            "X-CSRFToken": csrf_token 
                        },
                        body: JSON.stringify(data)
            
                    }).then(function(result) {
                        return result.json()
                    }).then(function(data) {
                        menssege_info(data)
                    })
                }
            }
            else {
                menssege_info(data)
            }
        })
    }  
}