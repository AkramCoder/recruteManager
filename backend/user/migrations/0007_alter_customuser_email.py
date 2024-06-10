# Generated by Django 3.2 on 2023-09-19 20:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_permission_text'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='email',
            field=models.EmailField(blank=True, max_length=255, null=True, unique=True, verbose_name='email_address'),
        ),
    ]
