from dataclasses import fields
from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from .models import (CustomUser, 
                     Candidate, 
                     Selectedcandidate, 
                     Skill, 
                     Education,
                     Experience, 
                     Address, 
                     Manager, 
                     Interview,
                     Question,
                     Event,
                     Cv,
                     ManagerPermission,
                     History)
from django.urls import reverse
from company.models import Wilaya, Commune
from django.contrib.sites.shortcuts import get_current_site
from rest_framework.exceptions import AuthenticationFailed
import logging

logger = logging.getLogger(__name__)
class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    redirect_url = serializers.CharField(max_length=500, required=False)

    class Meta:
        fields = ['email']

    # def validate(self, attrs):
    #     email = attrs['data'].get('email', '')
    #     if CustomUser.objects.filter(email=email).exists():
    #         user = CustomUser.objects.get(email=email)
    #         uidb64 = urlsafe_base64_encode(user.id)
    #         token = PasswordResetTokenGenerator().make_token(user)

    #         current_site = get_current_site(request=attrs['data'].get('request')).domain
    #         relativeLink = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
    #         absurl = 'http://'+current_site+relativeLink
    #         email_body = 'Hi \n Use the link bellow to reset your password \n'+absurl
    #         data = {
    #             'email_body': email_body,
    #             'to_email': user.email,
    #             'email_subject': 'Reset your password'
    #         }

    #         Util.send_email(data)
    #     return super().validate(attrs)

def checkUrlAndGetId(uidb64):
    return urlsafe_base64_decode(uidb64).decode('utf-8')

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uidb64 = serializers.CharField(
        min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')
            print('tk------', token)
            print('uidb----', uidb64)
            print('uidb----', force_str(urlsafe_base64_decode(uidb64)))

            id = force_str(urlsafe_base64_decode(uidb64))
            print('uidb----', id)
            user = CustomUser.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)

            user.set_password(password)
            user.save()

            return (user)
        except Exception as e:
            logger.error(f"An error occurred: {e}")
            raise AuthenticationFailed('The reset link is invalid', 401)
        return super().validate(attrs)

class ArrayFieldSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        return data.tolist()

    def to_internal_value(self, data):
        return data

class CharArrayField(serializers.ListField):
    child = serializers.CharField()

    def __init__(self, *args, **kwargs):
        kwargs["child"] = serializers.CharField()
        super().__init__(*args, **kwargs)

    def to_representation(self, data):
        data = super().to_representation(data)
        return data

    def to_internal_value(self, data):
        data = super().to_internal_value(data)
        return data
    
class WilayaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wilaya
        fields = '__all__'

class CommuneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commune
        fields = '__all__'

class AddressSerializer(serializers.ModelSerializer):
    # wilaya = WilayaSerializer() 
    # commune = CommuneSerializer()
    class Meta:
        model = Address
        fields = '__all__'

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = CustomUser
        fields = ('id', 'email', 'password', 're_password')

#class CustomUserSerializer(serializers.ModelSerializer):
#    gender = serializers.CharField(required=True, max_length=10)
#    birthday = serializers.DateField(required=True)

#    class Meta:
#        model = CustomUser
#        fields = ('first_name', 'last_name','gender', 'birthday', 'phone_number')

class CustomUserSerializer(serializers.ModelSerializer):
    gender = serializers.CharField(required=True, max_length=10)
    birthday = serializers.DateField(required=True)
    phone_number = CharArrayField()

    class Meta:
        model = CustomUser
        fields = ('id', 'first_name', 'last_name','gender', 'birthday', 'phone_number', 'language', 'email')

class CustomUserCandidateSerializer(serializers.ModelSerializer):
    gender = serializers.CharField(required=True, max_length=10)
    birthday = serializers.DateField(required=True)
    address = AddressSerializer()
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name','gender', 'birthday', 'phone_number', 'email','profile_picture', 'address')

    # def update(self, instance, validated_data):
    #     print("===============>", validated_data.items())
    #     for key, value in validated_data.items():
    #         setattr(instance, key, value)
    #     instance.save()
    #     return instance

class CandidateSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = Candidate
        fields = '__all__'

class CandidateCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = '__all__'

class SelectedCandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Selectedcandidate
        fields = '__all__'

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'title', 'establishment','start_date','end_date','description']


class EducationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'title', 'establishment','start_date','end_date','description', 'candidate']

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'



class ManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = '__all__'
        

class ManagerSelectSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = Manager
        fields = '__all__'
        



class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class InterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = '__all__'     
     
class InterviewCreateSerializer(serializers.ModelSerializer):
    responsable = serializers.PrimaryKeyRelatedField(queryset=Manager.objects.all(), many=True)
    class Meta:
        model = Interview
        fields = '__all__'     
     



class EventSerializer(serializers.ModelSerializer):
    responsable = serializers.PrimaryKeyRelatedField(queryset=Manager.objects.all())
    candidate = serializers.PrimaryKeyRelatedField(queryset=Candidate.objects.all())
    class Meta:
        model = Event
        fields = '__all__'

class CvSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cv
        fields = '__all__'



# _______________________get user with manager data______________________________

class ManagerUserSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer()
    address = AddressSerializer()
    class Meta:
        model = CustomUser
        fields = ['id','email', 'first_name','last_name','gender','birthday','phone_number', 'profile_picture','manager','address'] 
        # add company to fields

class CandidateEventsSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True)
    class Meta:
        model = Candidate
        fields = ['id','source', 'speciality','facebook', 'linkedin', 'date_created', 'events']



class ManagerDetailsSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = Manager
        fields = '__all__'

class EventresponsableDetailSerializer(serializers.ModelSerializer):
    responsable = ManagerDetailsSerializer()
    candidate = CandidateSerializer()

    class Meta:
        model = Event
        fields = ('id', 'name', 'added_date', 'description', 'responsable', 'candidate')

class InterviewResponsableSerializer(serializers.ModelSerializer):
    responsable = ManagerDetailsSerializer(many=True)
    class Meta:
        model = Interview
        fields = '__all__'   

class CandidateDetailsSerializer(serializers.ModelSerializer):
    user = CustomUserCandidateSerializer()
    skills = SkillSerializer(many=True)
    educations = EducationSerializer(many=True)
    experiences = ExperienceSerializer(many=True)
    events = EventresponsableDetailSerializer(many=True)
    cvs = CvSerializer(many=True)
    interviews = InterviewResponsableSerializer(many=True)
    class Meta:
        model = Candidate
        fields = ['id', 'source', 'speciality','facebook',
                  'linkedin','date_created', 'user', 'skills',
                  'educations','experiences','events', 'cvs',
                  'interviews']

class CandidateUserSerializer(serializers.ModelSerializer):
    user = CustomUserCandidateSerializer()
    class Meta:
        model = Candidate
        fields = ['id', 'source', 'speciality','facebook',
                  'linkedin','date_created', 'user']

# candidate with user details only
class CandidateUserDetailsSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = Candidate
        fields = ['id', 'source', 'speciality','facebook',
                  'linkedin','date_created', 'user']

class EventDetailSerializer(serializers.ModelSerializer):
    responsable = ManagerDetailsSerializer()
    candidate = CandidateDetailsSerializer()

    class Meta:
        model = Event
        fields = ('id', 'name', 'added_date', 'description', 'responsable', 'candidate')

# event with candidates and managers and users details
class EventsDetailsSerializer(serializers.ModelSerializer):
    responsable = ManagerDetailsSerializer()
    candidate = CandidateUserDetailsSerializer()

    class Meta:
        model = Event
        fields = ('id', 'name', 'added_date', 'description', 'responsable', 'candidate')

class InterviewDetailSerializer(serializers.ModelSerializer):
    responsable = ManagerDetailsSerializer(many=True)
    candidate = CandidateUserSerializer()
    questions = QuestionSerializer(many=True)
    class Meta:
        model = Interview
        fields = ['id', 'name','interview_date', 'company','responsable','candidate', 'questions']

        

class InterviewDetailsCandidateSerializer(serializers.ModelSerializer):
    responsable = ManagerDetailsSerializer(many=True)
    candidate = CandidateUserSerializer()
    class Meta:
        model = Interview
        fields = ['id', 'name','interview_date', 'company','responsable','candidate']


class ManagerDetailsSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = Manager
        fields = '__all__'

class InterviewsDetailsListSerializer(serializers.ModelSerializer):
    responsable = ManagerDetailsSerializer(many=True)
    candidate = CandidateUserSerializer()
    class Meta:
        model = Interview
        fields = '__all__'

class ManagerPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagerPermission
        fields = '__all__'

class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = '__all__'  

class TextSerializer(serializers.Serializer):
    input_text = serializers.CharField()