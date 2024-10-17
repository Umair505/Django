from django.urls import path
from .import views
urlpatterns = [
    path('',views.home,name = 'home'),
    path('signup/',views.signup,name = 'signup'),
    path('login/',views.user_login,name='login'),
    path('logout/',views.user_logout,name='logout'),
    path('profile/',views.profile,name='profile'),
    path('passchange/',views.passchange,name='passchange'),
    path('passchange2/',views.passchange2,name='passchange2'),
    
]
