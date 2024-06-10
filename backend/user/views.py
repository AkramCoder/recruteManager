from dataclasses import fields
import json
from django.core.serializers import serialize
from urllib import request
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import CreateAPIView, DestroyAPIView, ListAPIView
from django.http import JsonResponse
from djoser.views import UserViewSet
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
# from djoser.views import UserCreateView as RegistrationView
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from djoser import utils
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
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
                     Permission,
                     ManagerPermission,
                     History)
from company.models import Company
from .serializers import (CustomUserCreateSerializer, 
                          CustomUserSerializer,
                          CandidateCreateSerializer,
                          CandidateSerializer, 
                          SelectedCandidateSerializer,
                          SkillSerializer,
                          EducationSerializer,
                          ExperienceSerializer,
                          AddressSerializer, 
                          ManagerSerializer,
                          ManagerSelectSerializer,
                          InterviewSerializer,
                          InterviewCreateSerializer,
                          QuestionSerializer,
                          EventSerializer,
                          CvSerializer,
                          ManagerUserSerializer,
                          CandidateEventsSerializer,
                          EventDetailSerializer,
                          CandidateDetailsSerializer,
                          EducationCreateSerializer,
                          InterviewDetailSerializer,
                          InterviewsDetailsListSerializer,
                          EventsDetailsSerializer,
                          ManagerDetailsSerializer,
                          ManagerPermissionSerializer,
                          HistorySerializer,
                          TextSerializer, 
                          ResetPasswordEmailRequestSerializer,
                          SetNewPasswordSerializer)
# from djoser.views import UserCreateView as DjoserUserCreateView
# from djoser.views import RegistrationView
from djoser.conf import settings
from .textType import get_data_type
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import smart_str, force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator


class CustomUserCreateAPIView(generics.CreateAPIView):
    serializer_class = CustomUserCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        data= {'request': request, 'data': request.data}
        serializer = self.serializer_class(data=data)
        # serializer.is_valid(raise_exception=True)
        email= request.data['email']
        if CustomUser.objects.filter(email=email).exists():
            user = CustomUser.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(str(user.id).encode('utf-8'))
            token = PasswordResetTokenGenerator().make_token(user)
            # current_site = get_current_site(request=request).domain
            # relativeLink = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            current_site = "127.0.0.1:3000"
            relative_link = "/complete-reset-password/"+uidb64+"/"+token
            print('------>', current_site)
            print('------>', relative_link)
            absurl = 'http://'+current_site+relative_link
            email_body = 'Hi \n Use the link bellow to reset your password \n'+absurl
            data = {
                'email_body': email_body,
                'to_email': user.email,
                'email_subject': 'Reset your password'
            }
            Util.send_email(data)

        return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)

class PasswordTokenCheckAPI(generics.GenericAPIView):
    def get(self, request, uidb64, token):

        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'error': 'Token is not valid, please request new one'}, status=status.HTTP_401_UNAUTHORIZED)
            
            return Response({'success': True, 'message': 'Credentials valid', 'uidb64': uidb64, 'token': token}, status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError as identifier:
            if not PasswordResetTokenGenerator().check_token(user):
                return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)
            

class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)
    

# class CustomRegistrationView(RegistrationView):
#     def perform_create(self, serializer):
#         # Call the base perform_create method to create the user
#         user = super().perform_create(serializer)

#         # Generate a token for the user
#         token = default_token_generator.make_token(user)

#         # Create a reset password link with the token
#         reset_password_link = self._generate_reset_password_link(user.id, token)

#         # Send the password reset link to the user's email
#         utils.send_email(
#             'Password Reset',
#             'Reset your password by clicking the link below:',
#             reset_password_link,
#             [user.email],
#         )

#     def _generate_reset_password_link(self, user_id, token):
#         # Construct the reset password URL using Djoser's URL pattern
#         reset_password_url = reverse('password-reset-confirm', kwargs={'uid': user_id, 'token': token})
#         return f"https://yourdomain.com{reset_password_url}"
 
# class CustomUserCreate(RegistrationView):
#     def perform_create(self, serializer):
#         # Call the base perform_create method to create the user
#         user = super().perform_create(serializer)

#         # Check your custom test logic here
#         if your_custom_test_logic(user):
#             # Generate a token for the user
#             token = default_token_generator.make_token(user)

#             # Create a reset password link with the token
#             reset_password_link = f"https://yourdomain.com/reset-password/{user.id}/{token}/"

#             # Send the password reset link to the user's email
#             send_password_reset_email(user.email, reset_password_link)


class AuthView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': 'You are authenticated'}
        return Response(content)

#@api_view(["GET"])
#def currentUserView(request):
#    user = request.user
#    if user.is_authenticated:
#        user_info = serialize("json", [request.user],fields=['email','first_name','last_name','gender','birthday'])
#        user_info_id = json.loads(user_info)
#        return JsonResponse({"user":user_info_id[0]['fields']})
#    else:
#       return JsonResponse({"user":None})
#    if request.user.is_authenticated:
#        user_info = serialize("json", [request.user],fields=['email','first_name'])
#        user_info_id = json.loads(user_info)
#        return JsonResponse({"user":user_info_id[0]['fields']})
#    else:
#        return JsonResponse({"user":None})

class CustomUserCreateView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    
class UserUpdateView(APIView):
    # authentication_classes = [SessionAuthentication, TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    def put(self, request):
        try:
            user = CustomUser.objects.get(id=request.data.get('id'))
        except CustomUser.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Update user fields
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.gender = request.data.get('gender', user.gender)
        user.birthday = request.data.get('birthday', user.birthday)
        user.phone_number = request.data.get('phone_number', user.phone_number)
        user.profile_picture = request.data.get('profile_picture', user.profile_picture)
        user.language = request.data.get('language', user.language)

        # Save updated user
        user.save()

        return Response({"detail": "User updated successfully."}, status=status.HTTP_200_OK)
    

# class CustomUserUpdateAPIView(generics.UpdateAPIView):
#     serializer_class = CustomUserSerializer
#     queryset = CustomUser.objects.all()
#     permission_classes = [AllowAny]
    
#     def get_queryset(self):
#         return self.request.user
        

#     def update(self, request, *args, **kwargs):
#         print("=================11")
#         partial = kwargs.pop('partial', False)
#         instance = CustomUser.objects.get(id=17)
#         print("===========>", instance)
#         print("===========>", request.data)
#         print("===========>", partial)

#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)

#         if getattr(instance, '_prefetched_objects_cache', None):
#             instance._prefetched_objects_cache = {}

#         return Response(serializer.data)
    
class DetailCustomUserCreateAPIView(generics.CreateAPIView):
    serializer_class = CustomUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CandidateList(generics.ListCreateAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateCreateSerializer


class CandidateDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateDetailsSerializer


class CandidateViewDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer


class SelectedCandidateListCreateAPIView(generics.ListCreateAPIView):
    queryset = Selectedcandidate.objects.all()
    serializer_class = SelectedCandidateSerializer
    permission_classes = (IsAuthenticated,)


class SelectedCandidateRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Selectedcandidate.objects.all()
    serializer_class = SelectedCandidateSerializer
    permission_classes = (IsAuthenticated,)

class SkillListCreateView(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class SkillRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class EducationListCreateView(generics.ListCreateAPIView):
    queryset = Education.objects.all()
    serializer_class = EducationCreateSerializer


class EducationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

class ExperienceList(generics.ListCreateAPIView):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer

class ExperienceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer

class AddressListCreateView(generics.ListCreateAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

# class AddressRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Address.objects.all()
#     serializer_class = AddressSerializer
#     permission_classes = [AllowAny]
#     # def get_queryset(self):
#     #     return self.queryset.filter(user=self.kwargs['pk'])
#     def get_queryset(self):
#         print('----------->', self.kwargs['pk'])
#         address = Address.objects.filter(user=self.kwargs['pk'])
#         print('------', address)
#         return address

class AddressRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        print('----------->', self.kwargs['pk'])
        address = Address.objects.filter(user=self.kwargs['pk'])
        print('------', address)
        return address
    
@api_view(['GET'])
def getAddress(request, pk):
    try:
        address = Address.objects.get(user=pk)
    except Address.DoesNotExist:
        return Response({'error': 'Address not found'}, status=404)

    serializer = AddressSerializer(address)
    return Response(serializer.data)


class ManagerListCreateView(generics.ListCreateAPIView):
    """
    API endpoint that allows managers to be listed or created.
    """
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer

# to display in select fields
class ManagerListSelectView(generics.ListCreateAPIView):
    """
    API endpoint that allows managers to be listed or created.
    """
    queryset = Manager.objects.all()
    serializer_class = ManagerSelectSerializer


class ManagerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that allows a manager to be retrieved, updated or deleted.
    """
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer

class InterviewList(generics.ListCreateAPIView):
    queryset = Interview.objects.all()
    serializer_class = InterviewSerializer
    permission_classes = (AllowAny,)

class InterviewCreateList(generics.ListCreateAPIView):
    queryset = Interview.objects.all()
    serializer_class = InterviewCreateSerializer
    permission_classes = (AllowAny,)

class InterviewDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Interview.objects.all()
    serializer_class = InterviewCreateSerializer
    permission_classes = (AllowAny,)

# interview with its questions
class InterviewDetailQuestions(generics.RetrieveUpdateDestroyAPIView):
    queryset = Interview.objects.all()
    serializer_class = InterviewDetailSerializer

class QuestionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = (AllowAny,)

    def perform_create(self, serializer):
        # automatically set the interview based on the URL parameter
        interview_id = self.kwargs.get('interview_id')
        interview = get_object_or_404(Interview, id=interview_id)
        serializer.save(interview=interview)


class QuestionRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = (AllowAny,)

class EventListCreateAPIView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = (AllowAny,)

class EventRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class CvListCreateView(generics.ListCreateAPIView):
    queryset = Cv.objects.all()
    serializer_class = CvSerializer

class CvDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cv.objects.all()
    serializer_class = CvSerializer



#---------------------------------------------------------------

class Managercurrent(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = ManagerUserSerializer
    permission_classes = [IsAuthenticated]

class CurrentManager(generics.RetrieveUpdateDestroyAPIView):
    queryset = Manager.objects.all()
    serializer_class = ManagerDetailsSerializer
    # permission_classes = [IsAuthenticated]

class CandidateEventList(generics.ListCreateAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateEventsSerializer

class EventDetailView(APIView):
    def get(self, request, event_id):
        try:
            event = Event.objects.select_related('responsable', 'candidate').get(id=event_id)
        except Event.DoesNotExist:
            return Response({"detail": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = EventDetailSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
class EventsDetailsView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventsDetailsSerializer


class InterviewDetailView(APIView):
    def get(self, request, pk):
        try:
            interview = Interview.objects.prefetch_related('responsable').get(id=pk)
        except Event.DoesNotExist:
            return Response({"detail": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = InterviewDetailSerializer(interview)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CandidateCompanyListCreateAPIView(generics.ListCreateAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        return self.queryset.filter(company = self.request.user.company)
    
class CandidateCVListView(APIView):
    serializer_class = CvSerializer

    def get(self, request, candidate_ids):
        candidate_data = []

        candidate_id_list = candidate_ids.split(',')
        for candidate_id in candidate_id_list:
            try:
                cv = Cv.objects.get(candidate=candidate_id)
                candidate = Candidate.objects.get(id=candidate_id)
                serialized_cv = self.serializer_class(cv).data
                serialized_candidate = CandidateSerializer(candidate).data
                serialized_cv['candidate'] = serialized_candidate
                candidate_data.append(serialized_cv)
            except Candidate.DoesNotExist:
                pass  

        return Response(candidate_data, status=status.HTTP_200_OK)
    
class ManagerDetailsListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ManagerDetailsSerializer

    def get_queryset(self):
        selected_manager_id = self.kwargs['manager_id']  
        managers_with_same_parent = Manager.objects.filter(parent=selected_manager_id)
        return managers_with_same_parent

class InterviewDetailList(generics.ListCreateAPIView):
    queryset = Interview.objects.all()
    serializer_class = InterviewsDetailsListSerializer

class ManagerPermissionCreateView(CreateAPIView):
    queryset = ManagerPermission.objects.all()
    serializer_class = ManagerPermissionSerializer

class ManagerPermissionDeleteView(DestroyAPIView):
    queryset = ManagerPermission.objects.all()

class ManagerPermissionListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ManagerPermissionSerializer

    def get_queryset(self):
        manager_id = self.request.query_params.get('managerId')
        queryset = ManagerPermission.objects.filter(manager_id=manager_id)
        return queryset

class PermissionListAPIView(APIView):
    def get(self, request):
        permissions = Permission.objects.all()
        data = [{'id': p.id, 'name': p.name, 'text': p.text} for p in permissions]
        return Response(data)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_update_manager_permission(request):
    if request.method == 'POST':
        data = request.data
        print("data----->", request.data['managerId'])
        manager = Manager.objects.get(id=int(data['managerId'])) 
        if manager.managerpermission_set.exists():
            # manager permissions exist 
            temp = manager.managerpermission_set.all()
            for item in temp: 
                item.delete()

            for p in data.getlist('permissions[]'):
                permission = Permission.objects.get(id=int(p))  # Get the desired permission
                manager_permission = ManagerPermission(manager=manager, permission=permission)
                manager_permission.save()
            return Response({"message": "manager permissions created successfully"}, status=status.HTTP_201_CREATED)
        else: 
            print("manager permission doesn't exist")
            for p in data.getlist('permissions[]'):
                permission = Permission.objects.get(id=int(p))  # Get the desired permission
                manager_permission = ManagerPermission(manager=manager, permission=permission)
                manager_permission.save()
            return Response({"message": "manager permissions created successfully"}, status=status.HTTP_201_CREATED)

    return Response({"message": "Invalid request method"}, status=status.HTTP_400_BAD_REQUEST)

class HistoryListView(generics.ListAPIView):
    queryset = History.objects.all()
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]

class TextProcessingView(APIView):
    def post(self, request):
        serializer = TextSerializer(data=request.data)

        if serializer.is_valid():
            input_text = serializer.validated_data['input_text']
            result = get_data_type(input_text)

            response_data = {'entities': result}

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)