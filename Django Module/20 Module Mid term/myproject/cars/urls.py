from django.urls import path
from . import views

urlpatterns = [
    path('carlist/', views.CarListView.as_view(), name='car_list'),
    path('add-car/', views.AddCarView.as_view(), name='add_car'),
    path('',views.car_list_by_brand,name='car_list'),
    path('category/<slug:category_slug>/',views.car_list_by_brand,name='category_wise_view'),

]
