from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        return False
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True # Allow read-only requests for everyone
        return obj.author == request.user #edit korte chaile check korbe user ki author kina jodi author hoi taile edit,delete korte parbe
    
class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.user_type == "admin"
class IsViewerUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.user_type == "viewer"