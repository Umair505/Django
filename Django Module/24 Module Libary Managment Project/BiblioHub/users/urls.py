from django.urls import path
from . import views 

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='user_logout'),
    path('profile/', views.UserAccountUpdateView.as_view(), name='profile'),
    path('password-change/', views.ChangePasswordView.as_view(), name='pass_change'),
]
