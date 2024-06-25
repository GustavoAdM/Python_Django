from django.urls import path
from .views import cliente, view_cliente, atualizar_veiculo, deletar_veiculo, atualizar_pessoa, inserir_veiculo

urlpatterns = [
    path('', cliente, name='cliente'),
    path('view_cliente/', view_cliente, name='view_cliente'),
    path('atualizar_veiculo/<int:id>',
         atualizar_veiculo, name='atualizar_veiculo'),
    path('deletar_veiculo/<int:id>', deletar_veiculo, name='deletar_veiculo'),
    path('atualizar_pessoa/<int:id>', atualizar_pessoa, name='atualizar_pessoa'),
    path('inserir_veiculo/<int:id_cliente>', inserir_veiculo, name='inserir_veiculo')
]
