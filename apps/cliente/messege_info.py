def messege_error(mensagem:str):
    messege = {
        'status': 400,
        'info': mensagem[0]
    }
    return messege

def messege_approved(mensagem:str):
    messege = {
        'status': 200,
        'info': mensagem
    }
    return messege