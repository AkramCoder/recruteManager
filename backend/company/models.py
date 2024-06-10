from django.db import models
#from import_export import resources

class Wilaya(models.Model):
    code = models.IntegerField(null=True)
    name =  models.CharField(max_length=256, null=True, blank=True)

    def __str__(self):
        return self.name

class Commune(models.Model):
    wilaya = models.ForeignKey(Wilaya, on_delete=models.CASCADE, related_name="wilaya")  
    name = models.CharField(max_length=256, null=True, blank=True)

    def __str__(self):
        return self.name
    
class Company(models.Model):
    COMPANY_TYPE = [
        ('Pub', 'Publique'),
        ('Prv', 'Privé'),
    ]

    COMPANY_LEVEL = [
        ('NAT', 'Nationale'),
        ('INT', 'Internationale'),
    ]
    user = models.OneToOneField(
        "user.CustomUser", on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200, null=True)
    company_type = models.CharField(max_length=3, choices=COMPANY_TYPE, default='Pub')
    level = models.CharField(
        max_length=3, choices=COMPANY_LEVEL, default='NAT')
    website = models.CharField(max_length=200, null=True)
    date_created = models.DateTimeField(auto_now=True)
    profile_picture = models.ImageField(null=True, blank=True, upload_to='logo/')

    @property
    def jobs(self):
        return self.joboffer_set.all()

    @property
    def managers(self):
        return self.manager_set.all()

    @property
    def adress(self):
        return self.adress
    
class Address(models.Model):
    company = models.OneToOneField(Company, on_delete=models.CASCADE, null=True)
    wilaya = models.ForeignKey(Wilaya, on_delete=models.CASCADE, null=True, blank=True, related_name="company_wilaya")
    commune = models.ForeignKey(Commune, on_delete=models.CASCADE, null=True, blank=True, related_name="company_commune")
    complet_adress = models.CharField(max_length=256, null=True, blank=True)

    def __str__(self):
        return self.complet_adress

class Joboffer(models.Model):
    GENDER = [
        ('F', 'Femme'),
        ('H', 'Homme'),
        ('H/F', 'H/F'),
    ]
    

    job_title = models.CharField(max_length=200, null=True)
    job_created_by = models.ForeignKey(
        "user.CustomUser", on_delete=models.CASCADE, related_name="job_created_by")  # author ( employer or manager)
    responsable = models.ForeignKey("user.CustomUser", on_delete=models.CASCADE, related_name="responsable")
    company = models.ForeignKey(Company, on_delete=models.CASCADE)

    job_creation_date = models.DateTimeField(auto_now=True)
    job_expire_date = models.DateField(blank=True,null=True)
    delai = models.CharField(max_length=200, blank=True, null=True) # number of months
    etat = models.CharField(max_length=200, blank=True)
    specialism = models.CharField(max_length=300, blank = True)
    searched_profile = models.TextField(blank=True)
    Main_tasks = models.TextField(blank=True)
    standard_tasks = models.TextField(blank=True)
    occasional_tasks = models.TextField(blank=True)
    job_experience_required = models.CharField(max_length=200, blank=True)  # select range from frontend number of years
    job_qualification = models.CharField(max_length=200, null=True)   # select range from frontend
    career_level = models.CharField(max_length=200, null=True, blank=True)
    job_salary_offered = models.CharField(max_length=200, null=True,  blank=True) # select range from frontend
    # True == valide and False == not valid
    job_status = models.BooleanField(default=False,  blank=True)
    job_wilaya = models.ForeignKey(Wilaya, on_delete=models.SET_NULL, null=True, blank=True)
    job_gender_required = models.CharField(
        max_length=3, choices=GENDER, default='H/F',  blank=True)
    age = models.CharField(max_length=200, blank=True, null=True) #  select range from frontend
    jobtype = models.CharField(max_length=200, null=True, blank=True) # CDD ou CDI ou .... (added)

    def __str__(self):
        return self.job_title