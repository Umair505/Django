from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.CreateBrand.as_view(), name='add_brand'),

]
