from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from .models import History

@receiver(post_save)
def create_history_record_on_save(sender, instance, created, **kwargs):
    # Ignore history model itself to avoid recursion
    # if sender == History:
    #     return

    # if not created:
    #     action = "update"
    # else:
    #     action = "create"
    
    # # Assuming the user is available in the instance (replace 'user' with the actual attribute name)
    # user = instance.user
    
    # # Get the ContentType instance for the model being saved
    # content_type = ContentType.objects.get_for_model(sender)


    user_model = get_user_model()
    user_ct = ContentType.objects.get_for_model(user_model)

    if sender == user_model:
        if created:
            history = History(
                action_type='create',
                manager=instance,  # Assuming the user is available in the instance
                target_model=user_ct,
                target_id=instance.id,
            )
            history.save()
    # # Log the history record
    # History.objects.create(
    #     action_type=action,
    #     manager=user,  # Replace 'user' with the actual attribute name
    #     target_model=content_type,
    #     target_id=instance.pk,
    # )

@receiver(post_delete)
def create_history_record_on_delete(sender, instance, **kwargs):
    # Ignore history model itself to avoid recursion
    # if sender == History:
    #     return

    # target_model = ContentType.objects.get_for_model(sender)
    # History.objects.create(
    #     action_type='delete',
    #     manager=instance.user,  # Assuming the user is available in the instance
    #     target_model=target_model,
    #     target_id=instance.id,
    # )
    pass
