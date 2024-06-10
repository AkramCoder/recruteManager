from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.postgres.fields import ArrayField
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from company.models import Wilaya, Commune

from django.db import models
# from company.models import Company

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password):
        if not email:
            raise ValueError('Users must have an email address')
        
        print(email, " ", password)
        user = self.model(
            email=self.normalize_email(email)
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    FEMME = 'F'
    HOMME = 'H'
    GENDER = [
        (FEMME, 'Femme'),
        (HOMME, 'Homme'),
    ]
    email = models.EmailField(verbose_name='email_address', max_length=255, unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER, blank=True)
    birthday = models.DateField(null=True, blank=True)
    phone_number = ArrayField(models.CharField(max_length=10, unique=True, null=True, blank=True), blank=True, null=True)
    profile_picture = models.ImageField(null=True, blank=True)

    # as language level is common between all users I suggest to add two dimentional array field
    # like : [['language name', 'language level'],[],[],]  --> [['English', 'A'], ['Arabic', 'C']]
    language = ArrayField(ArrayField(models.CharField(max_length=10, default='en'), size=2), blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    

    # def __str__(self):
    #     return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin

    @property
    def managers(self):
        return self.manager 
    @property
    def address(self):
        return self.manager

    @property 
    def company(self):
        return self.company

class Candidate(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, null=True)
    company = models.ForeignKey("company.Company", on_delete=models.CASCADE)
    # which database it comes from emploilive or lepem or added manuelly
    source = models.CharField(max_length=150, blank=True)
    speciality = models.CharField(max_length=150, blank=True)
    facebook = models.CharField(max_length=256, null=True)
    linkedin = models.CharField(max_length=256, null=True)
    date_created = models.DateTimeField(auto_now=True)

    # added by yasmina
    @property
    def educations(self):
        return self.education_set.all()

    @property
    def experiences(self):
        return self.experience_set.all()

    @property
    def events(self):
        return self.event_set.all()

    @property
    def skills(self):
        return self.skill_set.all()

    @property
    def cvs(self):
        return self.cv_set.all()

    @property
    def interviews(self):
        return self.interview_set.all()


class Selectedcandidate(models.Model):
    job_offer = models.ForeignKey(
        "company.Joboffer", on_delete=models.CASCADE, null=True, blank=True)
    date_created = models.DateTimeField(auto_now=True)


class Skill(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    name = models.CharField(max_length=256, null=True)
    percentage = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True)


class Education(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    title = models.CharField(max_length=256, null=True)
    establishment = models.CharField(max_length=256, null=True)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    description = models.TextField(blank=True)


class Experience(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    name = models.CharField(max_length=256, null=True)
    campany = models.CharField(max_length=256, null=True)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    description = models.TextField(blank=True)

# class Wilaya(models.Model):
#     code = models.IntegerField(null=True)
#     name =  models.CharField(max_length=256, null=True, blank=True)

#     def __str__(self):
#         return self.name

# class Commune(models.Model):
#     wilaya = models.ForeignKey(Wilaya, on_delete=models.CASCADE, related_name="wilaya")  
#     name = models.CharField(max_length=256, null=True, blank=True)

#     def __str__(self):
#         return self.name
    
class Address(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, null=True)
    country = models.CharField(max_length=256, null=True, blank=True)
    wilaya = models.ForeignKey(Wilaya, on_delete=models.SET_NULL, null=True, blank=True)
    commune = models.ForeignKey(Commune, on_delete=models.SET_NULL, null=True, blank=True)
    zip_code = models.CharField(max_length=256, null=True, blank=True)
    address = models.CharField(max_length=256, null=True, blank=True)

    def __str__(self):
        return self.address


class Manager(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, null=True, related_name="manager")
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null= True, blank=True, related_name="manager_parent")
    company = models.ForeignKey("company.Company", on_delete=models.CASCADE, null= True, blank=True)
    current_poste = models.CharField(max_length=200, null=True)
    previous_poste = models.CharField(max_length=200, null=True)
    facebook = models.CharField(max_length=256, null=True)
    linkedin = models.CharField(max_length=256, null=True)
    date_created = models.DateTimeField(auto_now=True)



class Interview(models.Model):
    company = models.ForeignKey("company.Company", on_delete=models.CASCADE)
    name = models.CharField(max_length=256, null=True)
    interview_date = models.DateTimeField(auto_now=True)
    responsable = models.ManyToManyField(
        Manager)  # qui ont participé à l'Interview
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)

    @property
    def questions(self):
        return self.question_set.all()


class Question(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE)
    question = models.TextField(blank=True)
    response = models.TextField(blank=True)
    observation = models.TextField(blank=True)


class Event(models.Model):
    # appel entrant, appel sortant ...
    name = models.CharField(max_length=256, null=True)
    added_date = models.DateTimeField(auto_now=True)
    description = models.TextField(blank=True)
    responsable = models.ForeignKey(
        Manager, on_delete=models.CASCADE)  # qui a ajouté l'évènement
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)




class Cv(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now=True)
    cv_file = models.FileField(upload_to='uploads/')
    tags = ArrayField(models.CharField(max_length=256, blank=True))
    treated = models.BooleanField(default=False)



class Permission(models.Model):
    name = models.CharField(max_length=100, unique=True)
    text = models.CharField(max_length=100, unique=True, null=True, blank=True)
    

    def __str__(self):
        return self.name
    
class ManagerPermission(models.Model):
    manager = models.ForeignKey(Manager, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.manager.user.first_name} - {self.permission.name}"

User = get_user_model()

class History(models.Model):
    ACTION_CHOICES = (
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
    )

    action_type = models.CharField(max_length=10, choices=ACTION_CHOICES)
    action_date = models.DateTimeField(auto_now_add=True)
    manager = models.ForeignKey(User, on_delete=models.CASCADE)
    target_model = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    target_id = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.action_type} by {self.manager} on {self.action_date}"