# Generated by Django 3.2 on 2023-08-28 10:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('complet_adress', models.CharField(blank=True, max_length=256, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Commune',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=256, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, null=True)),
                ('company_type', models.CharField(choices=[('Pub', 'Publique'), ('Prv', 'Privé')], default='Pub', max_length=3)),
                ('level', models.CharField(choices=[('NAT', 'Nationale'), ('INT', 'Internationale')], default='NAT', max_length=3)),
                ('website', models.CharField(max_length=200, null=True)),
                ('date_created', models.DateTimeField(auto_now=True)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='logo/')),
            ],
        ),
        migrations.CreateModel(
            name='Wilaya',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.IntegerField(null=True)),
                ('name', models.CharField(blank=True, max_length=256, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Joboffer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job_title', models.CharField(max_length=200, null=True)),
                ('job_creation_date', models.DateTimeField(auto_now=True)),
                ('job_expire_date', models.DateField(blank=True, null=True)),
                ('delai', models.CharField(blank=True, max_length=200, null=True)),
                ('etat', models.CharField(blank=True, max_length=200)),
                ('specialism', models.CharField(blank=True, max_length=300)),
                ('searched_profile', models.TextField(blank=True)),
                ('Main_tasks', models.TextField(blank=True)),
                ('standard_tasks', models.TextField(blank=True)),
                ('occasional_tasks', models.TextField(blank=True)),
                ('job_experience_required', models.CharField(blank=True, max_length=200)),
                ('job_qualification', models.CharField(max_length=200, null=True)),
                ('career_level', models.CharField(blank=True, max_length=200, null=True)),
                ('job_salary_offered', models.CharField(blank=True, max_length=200, null=True)),
                ('job_status', models.BooleanField(blank=True, default=False)),
                ('job_wilaya', models.CharField(max_length=200, null=True)),
                ('job_gender_required', models.CharField(blank=True, choices=[('F', 'Femme'), ('H', 'Homme'), ('H/F', 'H/F')], default='H/F', max_length=3)),
                ('age', models.CharField(blank=True, max_length=200, null=True)),
                ('jobtype', models.CharField(blank=True, max_length=200, null=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='company.company')),
            ],
        ),
    ]
