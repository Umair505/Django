from django.urls import path
from . import views

urlpatterns = [
    path('accounts/signup/', views.CreateUserView.as_view(), name='signup'),
    path('accounts/login/', views.UserLoginView.as_view(), name='login'),
    path('accounts/logout/', views.userlogout, name='logout'),
    path('accounts/profile/', views.profile, name='profile'),
    path('accounts/edit_profile/<int:pk>', views.EditUserView.as_view(), name='edit_profile')
]
