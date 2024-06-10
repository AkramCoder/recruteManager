from dataclasses import fields
from multiprocessing import managers
from pyexpat import model
from rest_framework import serializers
from .models import Company, Joboffer, Address, Wilaya, Commune
from user.models import CustomUser
from user.serializers import ManagerSerializer



class JobofferSerializer(serializers.ModelSerializer):
    responsable = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    class Meta:
        model = Joboffer
        fields =  ['id','job_title','responsable', 'job_expire_date','delai','etat','job_qualification',
                 'career_level','job_salary_offered','job_wilaya', 'age','jobtype',
                 'job_gender_required','job_status', 'specialism','job_creation_date',
                 'searched_profile','Main_tasks','standard_tasks','occasional_tasks','job_experience_required']

class JobofferSerializerToday(serializers.ModelSerializer):
    class Meta:
        model = Joboffer
        fields =  ['id','job_title', 'job_expire_date','delai','etat','job_qualification',
                 'career_level','job_salary_offered','job_wilaya', 'age','jobtype',
                 'job_gender_required','job_status', 'specialism','job_creation_date',
                 'searched_profile','Main_tasks','standard_tasks','occasional_tasks','job_experience_required']

class ValidJobofferSerializer(serializers.ModelSerializer):
     class Meta:
        model = Joboffer
        fields =  ['id','job_status']

class JobofferCreteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Joboffer
        fields = ['job_title', 'searched_profile','Main_tasks','standard_tasks','occasional_tasks','job_experience_required']

        




class AdressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class CompanyCreateUpdateSerializer(serializers.ModelSerializer):
    address = AdressSerializer()

    class Meta:
        model = Company
        fields = ['id', 'address', 'name', 'company_type', 'level', 'website', 'user']

    def create(self, validated_data):
        address_data = validated_data.pop('address')
        address = Address.objects.create(**address_data)
        company = Company.objects.create(address=address, **validated_data)
        return company

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address')
        address = instance.address

        instance.name = validated_data.get('name', instance.name)
        instance.company_type = validated_data.get('company_type', instance.company_type)
        instance.level = validated_data.get('level', instance.level)
        instance.website = validated_data.get('website', instance.website)
        instance.user = validated_data.get('user', instance.user)
        instance.save()

        address.wilaya = address_data.get('wilaya', address.wilaya)
        address.commune = address_data.get('commune', address.commune)
        address.complet_adress = address_data.get('complet_adress', address.complet_adress)
        address.save()

        return instance

class CompanySerializer(serializers.ModelSerializer):
    jobs = JobofferSerializer(many=True)
    managers = ManagerSerializer(many=True)
    address = AdressSerializer()
    class Meta:
        model = Company
        fields = ['id', 'user', 'name','company_type','level','website', 'profile_picture', 'jobs', 'managers','address']

class CreateCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id',
                  'name',
                  'company_type',
                  'level',
                  'website',
                  'user']

class CreateUpdateCompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = ['id', 'adress', 'name', 'company_type', 'level', 'website']

    def create(self, validated_data):
        address_data = validated_data.pop('adress', None)  # Use pop with default value None
        print("------->>>>>", validated_data)
        company = Company.objects.create(**validated_data)

        if address_data:
            Address.objects.create(company=company, **address_data)

        return company

    def update(self, instance, validated_data):
        address_data = validated_data.pop('adress', None)  # Use pop with default value None

        instance.name = validated_data.get('name', instance.name)
        instance.company_type = validated_data.get('company_type', instance.company_type)
        instance.level = validated_data.get('level', instance.level)
        instance.website = validated_data.get('website', instance.website)
        instance.save()

        if address_data:
            address = instance.address
            address.wilaya = address_data.get('wilaya', address.wilaya)
            address.commune = address_data.get('commune', address.commune)
            address.complet_adress = address_data.get('complet_adress', address.complet_adress)
            address.save()

        return instance
    
class UpdatecompanySerializer(serializers.ModelSerializer):
    address = AdressSerializer()
    class Meta:
        model = Company
        fields = ['name','company_type','level','website', 'address']

class UpdatecompanyWithAdressSerializer(serializers.ModelSerializer):
     address = AdressSerializer()
     class Meta:
        model = Company
        fields = ['user', 'name','company_type','level','website','address']

class WilayaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wilaya
        fields = '__all__'

class CommuneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commune
        fields = '__all__'

# class WilayaSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Wilaya
#         fields=['code', 'name']



    #name = serializers.CharField(source = 'company.name')
    #company_type = serializers.CharField(source = 'company.company_type')
    #level = serializers.CharField(source = 'company.level')
    #website = serializers.CharField(source = 'company.website')

    #def update(self, instance, validated_data):
    #    company_data = validated_data.pop('company')
    #    company = instance.company

    #    company_ser = CompanySerializer(instance=company, data=company_data)
    #    if company_ser.is_valid():
    #        company_ser.save()

    #    instance.wilaya = validated_data.get('wilaya',instance.wilaya)
    #    instance.commune = validated_data.get('commune',instance.commune)
    #    instance.adress = validated_data.get('adress',instance.adress)
    #    instance.save()

    #class Meta:
    #    model = Adress
    #    fields = ['wilaya','commune', 'adress','name','company_type','level','website']

        #def update(self, instance, validated_data):
        #    adresse = validated_data.pop('adress')

        #    instance.name = validated_data.get('name', instance.name)
        #    instance.company_type = validated_data.get('company_type', instance.company_type)
        #    instance.level = validated_data.get('level', instance.level)
        #    instance.website = validated_data.get('website', instance.website)
        #    instance.save()

        #    adress_data = Adress.objects.get(pk=adresse['id'])
        #    adress_data.wilaya = validated_data.get('wilaya',adress_data.wilaya)
        #    adress_data.commune = validated_data.get('commune',adress_data.commune)
        #    adress_data.adress = validated_data.get('adress',adress_data.adress)
        #    adress_data.save()

            

        #    return instance



