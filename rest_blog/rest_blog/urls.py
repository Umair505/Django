from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Routes
    path('api/posts/', include("posts.urls")),
    path('api-auth/', include("rest_framework.urls")),  # DRF's browsable API login/logout

    # Authentication Routes
    path('api/auth/', include("dj_rest_auth.urls")),  # Login, Logout, Password Reset
    path('api/auth/registration/', include("dj_rest_auth.registration.urls")),  # Registration
]
