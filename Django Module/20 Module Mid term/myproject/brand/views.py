from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import  CreateView
from .models import  Brand
from django.contrib.messages.views import SuccessMessageMixin

class CreateBrand(LoginRequiredMixin, SuccessMessageMixin, CreateView):
    model = Brand
    fields = ['name']
    template_name = 'add_brand.html'
    success_url = reverse_lazy('home')
    success_message = "Brand created successfully."

    def form_valid(self, form):
        return super().form_valid(form)
