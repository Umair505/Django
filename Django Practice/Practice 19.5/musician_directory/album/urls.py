from django.urls import path
from . import views

urlpatterns = [
    path('', views.AlbumListView.as_view(), name='album_list'),
    path('create/', views.AlbumCreateView.as_view(), name='album_create'),
    path('edit/<int:pk>/', views.AlbumUpdateView.as_view(), name='album_edit'),
    path('delete/<int:pk>/', views.AlbumDeleteView.as_view(), name='album_delete'),
]