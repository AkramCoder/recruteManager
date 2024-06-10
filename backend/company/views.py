#from .models import WilayaResource
import csv
from http.client import HTTPResponse
from tkinter.tix import Form
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage

from rest_framework.decorators import action
from rest_framework import serializers
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse
from django.shortcuts import render

from datetime import datetime, timedelta, time


from dataclasses import fields
import json
from django.core.serializers import serialize
from urllib import request
from rest_framework.decorators import api_view
from django.http import JsonResponse
from djoser.views import UserViewSet
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework import views, viewsets
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from .models import Company, Joboffer, Address, Wilaya, Commune
from .serializers import (CompanySerializer, JobofferSerializer, AdressSerializer,
                          UpdatecompanySerializer, UpdatecompanyWithAdressSerializer,
                          ValidJobofferSerializer, JobofferCreteSerializer,CreateCompanySerializer,
                          WilayaSerializer, JobofferSerializerToday,
                          CommuneSerializer, CreateUpdateCompanySerializer)
from rest_framework.response import Response
from rest_framework import status
from user.models import CustomUser

#


fs = FileSystemStorage(location='tmp/')


class CompanyListCreateView(generics.ListCreateAPIView): 
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# create company
#

# class CompanyCreateView(generics.CreateAPIView):
#     permission_classes = [IsAuthenticated]
#     queryset = Company.objects.all()
#     serializer_class = CreateUpdateCompanySerializer

# class CompanyUpdateView(generics.RetrieveUpdateAPIView):
#     permission_classes = [IsAuthenticated]
#     queryset = Company.objects.all()
#     serializer_class = CreateUpdateCompanySerializer

class CompanyCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Company.objects.all()
    serializer_class = CreateCompanySerializer

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)

# company of authenticated user
#
class CompanyUserView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = Company.objects.all()
    serializer_class = UpdatecompanySerializer
    def put(self, request, pk, **kwargs):
        try:
            company = Company.objects.get(id=pk)
        except Company.DoesNotExist:
            return Response({"detail": "company not found."}, status=status.HTTP_404_NOT_FOUND)
        company.name = request.data.get('name', company.name)
        company.company_type = request.data.get('company_type', company.company_type)
        company.level = request.data.get('level', company.level)
        company.website = request.data.get('website', company.website)

         # Save updated company
        company.save()

        return Response({"detail": "company updated successfully."}, status=status.HTTP_200_OK)
    

class CompanyUpdateView(APIView):
    permission_classes = [AllowAny]
    serializer_class = CompanySerializer

    def put(self, request):
        company_id = request.data.get('id')
        
        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return Response({"detail": "Company not found."}, status=status.HTTP_404_NOT_FOUND)
        
        company_serializer = CompanySerializer(company, data=request.data)
        if company_serializer.is_valid():
            company_serializer.save()
            return Response({"detail": "Company updated successfully."}, status=status.HTTP_200_OK)
        else:
            return Response(company_serializer.errors, status=status.HTTP_400_BAD_REQUEST)   


class CompanyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

# create job offer
#
class JobofferListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Joboffer.objects.all()
    serializer_class = JobofferSerializer

    def perform_create(self, serializer):
        company_id = self.request.user.managers.company.id
        print(company_id)
        company = Company.objects.get(id=company_id)
        return serializer.save(job_created_by=self.request.user, company=company)# create job offer

#
class JobofferCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Joboffer.objects.all()
    serializer_class = JobofferCreteSerializer

    def perform_create(self, serializer):
        company_id = self.request.user.managers.company.id
        print(company_id)
        company = Company.objects.get(id=company_id)
        return serializer.save(job_created_by=self.request.user, responsable=self.request.user, company=company)


class JobofferUserListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Joboffer.objects.all()
    serializer_class = JobofferSerializer
#
class JobofferRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Joboffer.objects.all()
    serializer_class = JobofferSerializer

# 
class UpdateJobOffer(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = Joboffer.objects.all()
    serializer_class = JobofferSerializer
    def put(self, request, pk, **kwargs):
        try:
            joboffer = Joboffer.objects.get(id=pk)
        except Joboffer.DoesNotExist:
            return Response({"detail": "job not found."}, status=status.HTTP_404_NOT_FOUND)
        joboffer.job_title = request.data.get('job_title', joboffer.job_title)
        joboffer.responsable = request.data.get('responsable', joboffer.responsable)
        joboffer.job_expire_date = request.data.get('job_expire_date', joboffer.job_expire_date)
        joboffer.delai = request.data.get('delai', joboffer.delai)
        joboffer.etat = request.data.get('etat', joboffer.etat)
        joboffer.searched_profile = request.data.get('searched_profile', joboffer.searched_profile)
        joboffer.Main_tasks = request.data.get('Main_tasks', joboffer.Main_tasks)
        joboffer.standard_tasks = request.data.get('standard_tasks', joboffer.standard_tasks)
        joboffer.occasional_tasks = request.data.get('occasional_tasks', joboffer.occasional_tasks)
        joboffer.job_experience_required = request.data.get('job_experience_required', joboffer.job_experience_required)
        joboffer.job_qualification = request.data.get('job_qualification', joboffer.job_qualification)
        joboffer.career_level = request.data.get('career_level', joboffer.career_level)
        joboffer.job_salary_offered = request.data.get('job_salary_offered', joboffer.job_salary_offered)
        joboffer.job_status = request.data.get('job_status', joboffer.job_status)
        joboffer.job_gender_required = request.data.get('job_gender_required', joboffer.job_gender_required)
        joboffer.age = request.data.get('age', joboffer.age)
        joboffer.jobtype = request.data.get('jobtype', joboffer.jobtype)
        joboffer.save()
        return Response({"detail": "job updated successfully."}, status=status.HTTP_200_OK)

#
class ValiderJobOffer(generics.UpdateAPIView):
    permission_classes = (AllowAny,)
    queryset = Joboffer.objects.all()
    serializer_class = JobofferSerializer

    def update(self, request,pk, *args, **kwargs):
        job = Joboffer.objects.get(id=pk)

        if not job.job_status:
            job.job_status = True
            job.save()
            return Response(
                {"message": "job validated succesfully"}, status=status.HTTP_201_CREATED)
        raise serializers.ValidationError(
            'Course already valid'
        )

   


 #job offers of authenticated user's company
 #
class OffersCompanyView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Joboffer.objects.all()
    serializer_class = JobofferSerializer
    
    def get_queryset(self):
        return self.queryset.filter(company = self.request.user.company)

# return valid jobs 
#
class ValidOffersList(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Joboffer.objects.all()
    serializer_class = JobofferSerializer

    def get_queryset(self):
        company_id = self.request.user.company.id
        print(company_id)
        company = Company.objects.get(id=company_id)
        return Joboffer.objects.filter(job_status=True, company=company)


# return non valid jobs
#
class NonValidOffersList(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Joboffer.objects.all()
    serializer_class = JobofferSerializer

    def get_queryset(self):
        company_id = self.request.user.company.id
        print(company_id)
        company = Company.objects.get(id=company_id)
        return Joboffer.objects.filter(job_status=False,company=company)
    
#
class JobsList(generics.ListAPIView):
    serializer_class = JobofferSerializer

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        user = self.request.user
        return Joboffer.objects.filter(job_created_by=user).count()
    
class CreateJobView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Joboffer.objects.all()
    serializer_class = JobofferSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
#
class AdressListCreateView(generics.ListCreateAPIView):
    queryset = Address.objects.all()
    serializer_class = AdressSerializer


#
class AdressRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Address.objects.all()
    serializer_class = AdressSerializer

#
class CompanyAddressView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = Company.objects.all()
    serializer_class = UpdatecompanyWithAdressSerializer
    def put(self, request, pk, **kwargs):
        print('------->', request.data)
        try:
            company = Company.objects.get(id=pk)
            address = Address.objects.get(id=request.data.get('address_id'))
        except Company.DoesNotExist:
            return Response({"detail": "company not found."}, status=status.HTTP_404_NOT_FOUND)
        company.name = request.data.get('name', company.name)
        company.company_type = request.data.get('company_type', company.company_type)
        company.level = request.data.get('level', company.level)
        company.website = request.data.get('website', company.website)
        company.save()
        # address = request.data.get('address', company.address)
        address.wilaya = Wilaya.objects.get(id=int(request.data.get('wilaya', address.wilaya)))
        address.commune = Commune.objects.get(id=int(request.data.get('commune', address.commune)))
        address.complet_adress = request.data.get('complet_adress', address.complet_adress)
        address.save()
        # company.save()
        return Response({"detail": "company updated successfully."}, status=status.HTTP_200_OK)


#class ImportWilaya(APIView):
#    permission_classes = [AllowAny]
#    parser_classes = (FormParser, MultiPartParser)

#    def post(self, request):
#        for file in request.FILES.values():
#            reader = csv.reader(file)
#            objects = []
#            for row in reader:
#                print(row[0].title)
#                objects.append(Wilaya(
#                  code=row[0],
#                  name=row[1],
#                ))
#            Wilaya.objects.bulk_create(objects)

#        return Response({"success": "Good job, buddy"})




#class ProductViewSet(APIView):
#    """
#    A simple ViewSet for viewing and editing Product.
#    """
#    permission_classes = [AllowAny]
#    queryset = Wilaya.objects.all()
#    serializer_class = WilayaSerializer
    
#    def post(self, request):

#        file = request.FILES["file"]

#        content = file.read()  # these are bytes
#        file_content = ContentFile(content)
#        file_name = fs.save(
#            "_tmp.csv", file_content
#        )
#        tmp_file = fs.path(file_name)

#        csv_file = open(tmp_file, errors="ignore")
#        reader = csv.reader(csv_file)
#        #next(reader)
        
#        wilaya_list = []
#        for id_, row in enumerate(reader):
#            (
#                code,
#                name,
#            ) = row
#            wilaya_list.append(
#                Wilaya(
#                    code=code,
#                    name=name,
#                )
#            )

#        Wilaya.objects.bulk_create(wilaya_list)

#        return Response("Successfully upload the data")


#def upload_file_view(request):
#    form = CsvModelForm(request.POST or None, request.FILES or None)
#    if form.is_valid():
#        form.save()
#        form = CsvModelForm()
#        obj = Csvwilaya.objects.get(activated=False)
#        with open(obj.file_name.path,'r') as f:
#            reader = csv.reader(f)

#            for i,row in enumerate(reader):
#                row = "".join(row)
#                row = row.replace(";"," ")
#                row = row.split()
#                code = row[0]
#                name = row[1]
#                print(code)
#                print(name)
#                Wilaya.objects.create(
#                   code = code,
#                   name=name)
#                obj.activated = True
#                obj.save()
#    return render(request, "base.html",{'form':form})

#class ImportWilayaData(generics.GenericAPIView):
#    parser_classes = [parsers.MultiPartParser]
    
#    def post(self, request, *args, **kwargs):
#        file = request.FILES['excel']
#        df = pd.read_excel(file)
        
#        """Rename the headeers in the excel file
#           to match Django models fields"""
        
#        rename_columns = {"numero": "code", "wilaya": "name"}
        
#        df.rename(columns = rename_columns, inplace=True)
        
#        #Call the Student Resource Model and make its instance
#        wilaya_resource = WilayaResource()
        
#        # Load the pandas dataframe into a tablib dataset
#        dataset = Dataset().load(df)
        
#        # Call the import_data hook and pass the tablib dataset
#        result = wilaya_resource.import_data(dataset,\
#             dry_run=True, raise_errors = True)

#        if not result.has_errors():
#            result = wilayaform_resource.import_data(dataset, dry_run=False)
#            return Response({"status": "Student Data Imported Successfully"})

#        return Response({"status": "Not Imported Student Data"},\
#                 status=status.HTTP_400_BAD_REQUEST)

class WilayaListView(generics.ListAPIView):
    queryset = Wilaya.objects.all()
    serializer_class = WilayaSerializer


class CommunesByWilayaView(generics.ListAPIView):
    serializer_class = CommuneSerializer

    def get_queryset(self):
        wilaya_id = self.kwargs['wilaya_id']
        wilaya = Wilaya.objects.get(pk=wilaya_id)
        return wilaya.wilaya.all()
    

class TodayOffersList(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Joboffer.objects.all()
    serializer_class = JobofferSerializerToday
    
    def get_queryset(self):
        start_date = datetime.now().date()
        end_date = start_date + timedelta( days=1 ) 
        today =  datetime.now().date()
        print(today)
        return Joboffer.objects.filter(company = self.request.user.company,job_creation_date__range=(start_date, end_date))


class ThisweekOffersList(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Joboffer.objects.all()
    serializer_class = JobofferSerializerToday
    
    def get_queryset(self):
        start_date = datetime.now().date()
        start_week = start_date - timedelta( days=6 ) 
        end_date = start_date + timedelta( days=1 ) 
        today =  datetime.now().date()
        print(today)
        return Joboffer.objects.filter(company = self.request.user.company,job_creation_date__range=(start_week, end_date))

class ThismonthOffersList(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Joboffer.objects.all()
    serializer_class = JobofferSerializerToday
    
    def get_queryset(self):
        start_date = datetime.now().date()
        start_month = start_date - timedelta( days=30 ) 
        end_date = start_date + timedelta( days=1 ) 
        today =  datetime.now().date()
        print(today)
        return Joboffer.objects.filter(company = self.request.user.company,job_creation_date__range=(start_month, end_date))
    

def get_wilaya_commune_names(request, wilaya_id, commune_id):
    try:
        wilaya = Wilaya.objects.get(id=wilaya_id)
        commune = Commune.objects.get(id=commune_id)
        
        data = {
            "wilaya_name": wilaya.name,
            "commune_name": commune.name
        }
        
        return JsonResponse(data)
    except Wilaya.DoesNotExist:
        return JsonResponse({"error": "Wilaya not found."}, status=404)
    except Commune.DoesNotExist:
        return JsonResponse({"error": "Commune not found."}, status=404)