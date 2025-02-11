from django.shortcuts import render
from django.views.generic import FormView
from .forms import UserRegistrationForm ,UserUpdateForm
from django.contrib.auth import login, logout
from django.urls import reverse_lazy
from django.contrib.auth.views import LoginView, LogoutView
from django.views import View
from django.shortcuts import redirect
from django.contrib.auth import login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import RedirectView
from django.contrib import messages
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.views import PasswordChangeView
from django.urls import reverse_lazy
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


class UserRegistrationView(FormView):
    template_name = 'accounts/user_registration.html'
    form_class = UserRegistrationForm
    success_url = reverse_lazy('home')
    
    def form_valid(self,form):
        print(form.cleaned_data)
        user = form.save()
        login(self.request, user)
        messages.success(self.request, f'Account created fo successfully.')

        return super().form_valid(form) 
    

class UserLoginView(LoginView):
    template_name = 'accounts/user_login.html'
    def get_success_url(self):
        messages.success(self.request, f'Logged successfully. ')
        return reverse_lazy('home')
    
class LogoutView(LoginRequiredMixin, RedirectView):
    url = reverse_lazy('home')

    def get(self, request, *args, **kwargs):
        logout(request)
        messages.success(request, 'You have been logged out successfully!')
        return super().get(request, *args, **kwargs)


class UserBankAccountUpdateView(View):
        template_name = 'accounts/user_registration.html'

        def get(self,request):
            form = UserUpdateForm(instance=request.user)
            return render(request,self.template_name,{'form':form})
        
        
        def post(self,request):
            form = UserUpdateForm(request.POST,instance= request.user)
            if form.is_valid():
                form.save()
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
    