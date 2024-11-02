from django.urls import path
from . import views
urlpatterns = [
    path('car_detail<int:pk>/', views.car_detail, name='car_detail'),
    path('buy_car<int:pk>/', views.buy_car, name='buy_car')
]
