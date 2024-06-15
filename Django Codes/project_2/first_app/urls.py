# from first_app.views import home
# from first_app import views
from . import views
from django.urls import path

urlpatterns = [
    path('',views.home),
]
