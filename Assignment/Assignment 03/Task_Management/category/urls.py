from django.urls import path
from . import views
urlpatterns = [
    path('',views.show_category,name='show_category'),
    path('add/',views.add_category,name='add_category'),
]