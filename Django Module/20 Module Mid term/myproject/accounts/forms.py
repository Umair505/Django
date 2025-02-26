from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm,UserChangeForm


class CustomUserCreationForm(UserCreationForm):
    first_name = forms.CharField(max_length=20)
    last_name = forms.CharField(max_length=20)
    
    class Meta:
        model = User
        fields =['username','first_name','last_name','email']
        
        
class ChangeUserData(UserChangeForm):
    password =None
    class Meta:
        model = User
        fields =['username','first_name','last_name','email']
        