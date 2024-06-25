# Generated by Django 5.0.6 on 2024-06-10 17:46

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('id_pessoa', models.AutoField(primary_key=True, serialize=False)),
                ('nm_pessoa', models.CharField(max_length=70)),
                ('nm_sbrnome', models.CharField(blank=True, max_length=70)),
                ('ds_email', models.EmailField(max_length=50)),
                ('nr_cpf', models.CharField(max_length=14)),
                ('st_ativo', models.CharField(default='S', max_length=1)),
                ('dt_registro', models.DateTimeField(auto_now_add=True)),
                ('dt_alteracao', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Veiculo',
            fields=[
                ('id_veiculo', models.AutoField(primary_key=True, serialize=False)),
                ('nm_veiculo', models.CharField(max_length=48)),
                ('nr_placa', models.CharField(max_length=10)),
                ('nr_ano', models.IntegerField(validators=[django.core.validators.MinValueValidator(1000), django.core.validators.MaxValueValidator(9999)])),
                ('nr_lavagem', models.IntegerField(default=0)),
                ('id_pessoa', models.ForeignKey(db_column='id_pessoa', on_delete=django.db.models.deletion.PROTECT, to='cliente.cliente')),
            ],
        ),
    ]
