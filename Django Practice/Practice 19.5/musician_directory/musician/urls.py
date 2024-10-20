from django.urls import path
from . import views

urlpatterns = [
    path('',views.MusicianListView.as_view(),name ='musician_list'),
    path('create/',views.MusicianCreateView.as_view(),name ='musician_create'),
    path('edit/<int:pk>/',views.MusicianUpdateView.as_view(),name ='musician_edit'),
    path('delete/<int:pk>/',views.MusicianDeleteView.as_view(),name ='delete_musician'),
]