def messege_error(mensagem:str, type='v'):
    messege = {
        'status': 400,
        'info': mensagem[0] if type == 'v' else mensagem
    }
    return messege

def messege_approved(mensagem:str):
    messege = {
        'status': 200,
        'info': mensagem
    }
    return messege