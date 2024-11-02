from django.shortcuts import render, redirect
from django.views.generic import CreateView, UpdateView
from django.contrib.auth.views import LoginView
from django.contrib.auth.models import User
from buyer.forms import SignupForm, EditProfileForm
from django.urls import reverse_lazy
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from car.models import Car
from django.contrib import messages
# Create your views here.
class CreateUserView(CreateView):
    model = User
    template_name = 'signup.html'
    form_class = SignupForm
    success_url = reverse_lazy('home')
    
    
class UserLoginView(LoginView):
    template_name = 'login.html'
    success_url = reverse_lazy('home')
    redirect_authenticated_user = False
    
class EditUserView(UpdateView):
    model = User
    template_name = 'edit_profile.html'
    form_class = EditProfileForm
    success_url = reverse_lazy('home')
    pk_url_kwargs = 'pk'
    
@login_required
def userlogout(request):
    logout(request)
    return redirect('home')

@login_required
def profile(request):
    cars = Car.objects.filter(buyers=request.user)
    return render(request, 'profile.html', {'cars' : cars})

    
    