from django.shortcuts import render,redirect
from .forms import SignupForm
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm,PasswordChangeForm,SetPasswordForm
from django.contrib.auth import authenticate,login,logout,update_session_auth_hash
# Create your views here.
def home(request):
    return render(request,'home.html')

def signup(request):
    if not request.user.is_authenticated:
        if request.method == 'POST':
            form = SignupForm(request.POST)
            if form.is_valid():
                messages.success(request,'Account created Successfully')
                form.save()
        
        else:
            form = SignupForm()
        return render(request,'./signup.html',{'form':form})
    else:
        return redirect('profile')

        
def user_login(request):
    if not request.user.is_authenticated:
        if request.method == 'POST':
            form = AuthenticationForm(request=request,data = request.POST)
            if form.is_valid():
                name = form.cleaned_data['username']
                userpass = form.cleaned_data['password']
                user = authenticate(username = name,password = userpass)
                if user is not None:
                    login(request,user)
                    return redirect('profile')
                
        else:
            form = AuthenticationForm()
        return render(request,'./login.html',{'form':form})
    else:
        return redirect('profile')
def profile(request):
    if request.user.is_authenticated:
        return render(request,'./profile.html')
    else:
        return redirect('signup')

def passchange(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            form = PasswordChangeForm(user = request.user,data = request.POST)
            if form.is_valid():
                form.save()
                update_session_auth_hash(request,form.user)
                messages.success(request,'Password successfully updated!')
                return redirect('profile')
        else:
            form = PasswordChangeForm(user = request.user)
        return render(request,'./pass_change.html',{'form':form})
    else:
        return redirect('login')

def passchange2(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            form = SetPasswordForm(user = request.user,data = request.POST)
            if form.is_valid():
                form.save()
                update_session_auth_hash(request,form.user)
                messages.success(request,'Password Successfully Updated!')
                return redirect('profile')
        else:
            form = SetPasswordForm(user = request.user)
        return render(request,'./pass_change.html',{'form':form})
    return redirect('login')
def user_logout(request):
    if request.user.is_authenticated:
        logout(request)
        messages.success(request,'Logout Successfully!')
        return redirect('login')
    else:
        return redirect('signup')
