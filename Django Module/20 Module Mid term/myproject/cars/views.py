from .forms import CarForm
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from django.views.generic import ListView, CreateView
from .models import Car
from brand.models import Brand
from django.contrib.messages.views import SuccessMessageMixin
from .models import Car

# add car
class AddCarView(LoginRequiredMixin, SuccessMessageMixin, CreateView):
    model = Car
    form_class = CarForm
    template_name = 'add_car.html'
    success_url = reverse_lazy('home')
    success_message = "Car was added successfully."

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)


class CarListView(ListView):
    model = Car
    template_name = 'car_list.html'

    def get_queryset(self):
        return Car.objects.all()




def car_list_by_brand(request, category_slug=None):
    data = Car.objects.all()

    if category_slug is not None:
        category = Brand.objects.get(slug=category_slug) # kon object er part ta ber kore niye aslo
        data = Car.objects.filter(category=category )
    categories = Brand.objects.all()

    return render(request, 'home.html', {'data': data, 'categories': categories})

