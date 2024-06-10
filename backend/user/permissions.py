from functools import wraps
from rest_framework.response import Response
from rest_framework import status
from .models import ManagerPermission

def has_permission(permission):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            manager = request.user
            if ManagerPermission.objects.filter(manager=manager, permission__name=permission).exists():
                return view_func(request, *args, **kwargs)
            else:
                return Response({'message': 'You are not authorized to perform this action.'}, status=status.HTTP_403_FORBIDDEN)
        return wrapper
    return decorator