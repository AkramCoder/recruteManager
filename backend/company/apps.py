from django.apps import AppConfig
import csv

from django.db.models.signals import post_migrate
from django.dispatch import receiver




class CompanyConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'company'
    
    def ready(self):
        from .models import Wilaya, Commune
        if not Wilaya.objects.exists() and not Commune.objects.exists():
            csv_file_path = '../media/wilaya/algeria_cities.csv'
            with open(csv_file_path, newline='') as csvfile:
                csv_reader = csv.reader(csvfile)
                wilaya = ''
                wilaya_code = ''
                wilaya_obj = ''
                for row in csv_reader:
                    if row[0] == 'id':
                        pass
                    else:
                        if wilaya != row[4]:
                            wilaya = row[4]
                            wilaya_code = int(row[3])
                            wilaya_obj = Wilaya.objects.create(code=wilaya_code, name=wilaya)
                            Commune.objects.create(wilaya=wilaya_obj, name=row[1])
                        else:
                            Commune.objects.create(wilaya=wilaya_obj, name=row[1])

