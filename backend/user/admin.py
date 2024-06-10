from django.contrib import admin

from .models import *

admin.site.register(CustomUser),
admin.site.register(Candidate),
admin.site.register(Selectedcandidate),
admin.site.register(Skill),
admin.site.register(Education),
admin.site.register(Experience),
admin.site.register(Address),
admin.site.register(Manager),
admin.site.register(Interview),
admin.site.register(Question),
admin.site.register(Event),
admin.site.register(Cv),
admin.site.register(Permission),
admin.site.register(ManagerPermission),
admin.site.register(History),


