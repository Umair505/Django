from django.urls import path
from . import views

urlpatterns = [
    
    path('', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.UserLoginView.as_view(), name='user_login'), 
    path('logout/', views.user_logout, name='user_logout'), 
    path('profile/', views.profile_view, name='profile'), 
    path('profile/edit/change_password/', views.pass_change, name='user_pass'),  
]




