from django.shortcuts import render
from django.views.generic import FormView
from .forms import UserRegistrationForm ,UserUpdateForm
from django.contrib.auth import login, logout
from django.urls import reverse_lazy
from django.contrib.auth.views import LoginView
from django.views import View
from django.shortcuts import redirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import RedirectView
from django.contrib import messages
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.views import PasswordChangeView
from django.urls import reverse_lazy
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

def send_email(user,subject,template):
    message = render_to_string(template,{
        'user':user
    })
    sent_email = EmailMultiAlternatives(subject,'',to=[user.email])
    sent_email.attach_alternative(message,'text/html')
    sent_email.send()
   

class UserRegistrationView(FormView):
    template_name = 'accounts/user_registration.html'
    form_class = UserRegistrationForm
    success_url = reverse_lazy('home')
    
    def form_valid(self,form):
        print(form.cleaned_data)
        user = form.save()
        login(self.request, user)
        messages.success(self.request, f'Account created fo successfully.')
        send_email(user,'Register Successful','accounts/register_email.html')

        return super().form_valid(form) 
    
class UserLoginView(LoginView):
    template_name = 'accounts/user_login.html'

    def form_valid(self, form):
        user = form.get_user()
        messages.success(self.request, 'Logged in successfully.')
        send_email(user, 'Login Successful', 'accounts/login_email.html')
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('home')
    
class LogoutView(LoginRequiredMixin, RedirectView):
    url = reverse_lazy('home')

    def get(self, request, *args, **kwargs):
        logout(request)
        messages.success(request, 'You have been logged out successfully!')
        return super().get(request, *args, **kwargs)


class UserAccountUpdateView(View):
        template_name = 'accounts/user_info_update.html'

        def get(self,request):
            form = UserUpdateForm(instance=request.user)
            return render(request,self.template_name,{'form':form})
        
        
        def post(self,request):
            form = UserUpdateForm(request.POST,instance= request.user)
            if form.is_valid():
                form.save()
                messages.success(request, 'Your information has been updated successfully!')
                send_email(request.user,'Information updated Successful','accounts/info_update_email.html')
                return redirect('home')
            return render(request,self.template_name,{'form':form})


def sent_pass_change_email(user,subject,template):
    message = render_to_string(template,{
        'user':user
    })
    sent_email = EmailMultiAlternatives(subject,'',to=[user.email])
    sent_email.attach_alternative(message,'text/html')
    sent_email.send()
   
    
            
class ChangePasswordView(PasswordChangeView):
    form_class = PasswordChangeForm
    success_url = reverse_lazy('home')
    template_name = 'accounts/change_password.html'
    
    def form_valid(self,form):
        messages.success(self.request, f'Successfully changed your password.')
        sent_pass_change_email(self.request.user,'Successfully Changed Password', 'accounts/change_pass_email.html')
        return super().form_valid(form) 