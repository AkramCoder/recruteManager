# Generated by Django 3.2 on 2023-08-28 11:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('company', '0002_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='address',
            name='company',
        ),
        migrations.AddField(
            model_name='company',
            name='address',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='company.address'),
        ),
    ]
