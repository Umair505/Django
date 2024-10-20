from django.shortcuts import render
from django.urls import reverse_lazy
from . models import Musician
from .forms import MusicianForm
from django.contrib.auth.mixins import LoginRequiredMixin
# Create your views here.
from django.views.generic import ListView,CreateView,DeleteView,UpdateView
from django.contrib import messages

class MusicianListView(ListView):
    model = Musician
    context_object_name = 'musicians'
    template_name = 'musician_list.html'
    
class MusicianCreateView(LoginRequiredMixin,CreateView):
    model = Musician
    form_class = MusicianForm
    template_name = 'musician_form.html'
    success_url = reverse_lazy('musician_list')
    
    def form_valid(self, form):
        messages.success(self.request,'Musician created Successfully!')
        return super().form_valid(form)

class MusicianUpdateView(LoginRequiredMixin,UpdateView):
    model = Musician
    form_class = MusicianForm
    template_name = 'musician_form.html'
    success_url = reverse_lazy('musician_list')
    
    def form_valid(self, form):
        messages.success(self.request,'Musician Updated Successfully!')
        return super().form_valid(form)
    
class MusicianDeleteView(LoginRequiredMixin,DeleteView):
    model = Musician
    success_url = reverse_lazy('musician_list')
    template_name = 'delete_musician.html'
    
    def delete(self,request,*args,**kwargs):
        messages.success(self.request,"Musician Deleted Successfully!")
        return super().delete(request,*args,**kwargs)