from django.apps import AppConfig


class UserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user'

    def ready(self):
        import user.signals
        from .models import Permission
        if not Permission.objects.exists():
            permission_list = [
                {"name": "create_custom_user", "text": "create user"},
                {"name": "update_custom_user", "text": "update user"},
                {"name": "delete_custom_user", "text": "delete user"},
                {"name": "get_custom_user", "text": "get user"},
                {"name": "create_candidate", "text": "create candidate"},
                {"name": "update_candidate", "text": "update candidate"},
                {"name": "delete_candidate", "text": "delete candidate"},
                {"name": "get_candidate", "text": "get candidate"},
                {"name": "create_skill", "text": "create skill"},
                {"name": "update_skill", "text": "update skill"},
                {"name": "delete_skill", "text": "delete skill"},
                {"name": "get_skill", "text": "get skill"},
                {"name": "create_education", "text": "create education"},
                {"name": "update_education", "text": "update education"},
                {"name": "delete_education", "text": "delete education"},
                {"name": "get_education", "text": "get education"},
                {"name": "create_experience", "text": "create experience"},
                {"name": "update_experience", "text": "update experience"},
                {"name": "delete_experience", "text": "delete experience"},
                {"name": "get_experience", "text": "get experience"},
                {"name": "create_user_address", "text": "create user address"},
                {"name": "update_user_address", "text": "update user address"},
                {"name": "delete_user_address", "text": "delete user address"},
                {"name": "get_user_address", "text": "get user address"},
                {"name": "create_manager", "text": "create manager"},
                {"name": "update_manager", "text": "update manager"},
                {"name": "delete_manager", "text": "delete manager"},
                {"name": "get_manager", "text": "get manager"},
                {"name": "create_interview", "text": "create interview"},
                {"name": "update_interview", "text": "update interview"},
                {"name": "delete_interview", "text": "delete interview"},
                {"name": "get_interview", "text": "get interview"},
                {"name": "create_question", "text": "create question"},
                {"name": "update_question", "text": "update question"},
                {"name": "delete_question", "text": "delete question"},
                {"name": "get_question", "text": "get question"},
                {"name": "create_event", "text": "create event"},
                {"name": "update_event", "text": "update event"},
                {"name": "delete_event", "text": "delete event"},
                {"name": "get_event", "text": "get event"},
                {"name": "create_cv", "text": "create cv"},
                {"name": "update_cv", "text": "update cv"},
                {"name": "delete_cv", "text": "delete cv"},
                {"name": "get_cv", "text": "get cv"},
                {"name": "create_permission", "text": "create permission"},
                {"name": "update_permission", "text": "update permission"},
                {"name": "delete_permission", "text": "delete permission"},
                {"name": "get_permission", "text": "get permission"},
                {"name": "create_manager_permission", "text": "create manager permission"},
                {"name": "update_manager_permission", "text": "update manager permission"},
                {"name": "delete_manager_permission", "text": "delete manager permission"},
                {"name": "get_manager_permission", "text": "get manager permission"},
                {"name": "create_history", "text": "create history"},
                {"name": "update_history", "text": "update history"},
                {"name": "delete_history", "text": "delete history"},
                {"name": "get_history", "text": "get history"},

                # company models
                {"name": "create_wilaya", "text": "create wilaya"},
                {"name": "update_wilaya", "text": "update wilaya"},
                {"name": "delete_wilaya", "text": "delete wilaya"},
                {"name": "get_wilaya", "text": "get wilaya"},
                {"name": "create_commune", "text": "create commune"},
                {"name": "update_commune", "text": "update commune"},
                {"name": "delete_commune", "text": "delete commune"},
                {"name": "get_commune", "text": "get commune"},
                {"name": "create_company", "text": "create company"},
                {"name": "update_company", "text": "update company"},
                {"name": "delete_company", "text": "delet company"},
                {"name": "get_company", "text": "get company"},
                {"name": "create_company_address", "text": "create company address"},
                {"name": "update_company_address", "text": "update company address"},
                {"name": "delete_company_address", "text": "delete company address"},
                {"name": "get_company_address", "text": "get company address"},
                {"name": "create_job_offer", "text": "create job offer"},
                {"name": "update_job_offer", "text": "update job offer"},
                {"name": "delete_job_offer", "text": "delete job offer"},
                {"name": "get_job_offer", "text": "get job offer"}
            ]

            for permission in permission_list:
                Permission.objects.create(name=permission["name"], text=permission["text"])
