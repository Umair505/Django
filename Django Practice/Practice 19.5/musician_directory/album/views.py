from django.shortcuts import render
from .models import Album
from .forms import AlbumForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, CreateView, UpdateView,DeleteView
from django.urls import reverse_lazy
from django.contrib import messages
    
class AlbumListView(ListView):
    model = Album
    context_object_name = 'albums'  
    template_name ='album_list.html'

    def get_queryset(self):
        return Album.objects.all().order_by('-release_date')
    
class AlbumCreateView(LoginRequiredMixin, CreateView):
    model = Album
    form_class = AlbumForm
    template_name = 'album_form.html'

    def get_success_url(self):
        messages.success(self.request, 'Album created successfully.')
        return reverse_lazy('album_list')

class AlbumUpdateView(LoginRequiredMixin, UpdateView):
    model = Album
    form_class = AlbumForm
    template_name = 'album_form.html'

    def get_success_url(self):
        messages.success(self.request, 'Album updated successfully.')  
        return reverse_lazy('album_list')

class AlbumDeleteView(LoginRequiredMixin, DeleteView):
    model = Album
    template_name = 'album_delete.html'

    def get_success_url(self):
        messages.success(self.request, 'Album deleted successfully.')  
        return reverse_lazy('album_list')