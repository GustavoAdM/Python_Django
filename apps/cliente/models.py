from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Cliente(models.Model):
    id_pessoa = models.AutoField(primary_key=True)
    nm_pessoa = models.CharField(max_length=70, null=False, blank=False)
    nm_sbrnome = models.CharField(max_length=70, blank=True)
    ds_email = models.EmailField(max_length=50)
    nr_cpf = models.CharField(max_length=14, null=False, blank=False, unique=True)
    st_ativo = models.CharField(
        # Ativo = (S)im ou (N)ão
        max_length=1, null=False, blank=False, default='S')
    dt_registro = models.DateTimeField(
        auto_now_add=True, null=False)  # Dt de criação
    dt_alteracao = models.DateTimeField(
        auto_now=True, null=False)  # Dt da ultima alteração

    def __str__(self) -> str:
        return self.nm_pessoa


class Veiculo(models.Model):
    id_veiculo = models.AutoField(primary_key=True)
    id_pessoa = models.ForeignKey(Cliente, on_delete=models.PROTECT, to_field='id_pessoa', db_column='id_pessoa')
    nm_veiculo = models.CharField(max_length=48)
    nr_placa = models.CharField(max_length=10, unique=True)
    nr_ano = models.IntegerField(
        validators=[MinValueValidator(1000), MaxValueValidator(9999)])
    nr_lavagem = models.IntegerField(default=0)  # Qtde de lavagem

    def __str__(self) -> str:
        return f'(ID: {self.id_veiculo} Nome: {self.nm_veiculo})'
