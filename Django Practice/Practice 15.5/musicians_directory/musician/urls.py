from django.urls import path
from . import views

urlpatterns = [
    path('', views.musician_list, name='musician_list'),
    path('create/', views.musician_create, name='musician_create'),
    path('edit/<int:pk>/', views.musician_edit, name='musician_edit'),
    path('delete/<int:pk>/', views.musician_delete, name='musician_delete'),
]
