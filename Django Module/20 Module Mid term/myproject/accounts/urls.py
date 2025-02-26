from django.urls import path
from . import views

urlpatterns = [

    path('register/',views.RegisterView.as_view(),name='register'),
    path('login/',views.LoginView.as_view(),name='user_login'),
    path('logout/',views.LogoutView.as_view(),name='user_logout'),
    path('update-profile-info/',views.edit_profile,name='update_profile'),
    path('change-password/',views.pass_change,name='password_update'),
    

]
