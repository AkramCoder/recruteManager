# Generated by Django 3.2 on 2023-09-20 08:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0007_alter_customuser_email'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cv',
            name='status',
        ),
        migrations.AddField(
            model_name='cv',
            name='treated',
            field=models.BooleanField(default=False),
        ),
    ]
