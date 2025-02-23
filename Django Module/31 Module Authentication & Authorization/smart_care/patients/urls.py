from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('list', views.PatientViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/',views.UserRegistrationApiView.as_view(),name='register'),
    path('login/',views.UserLoginApiView.as_view(),name='login'),
    path('logout/', views.UserLogoutView.as_view(), name='logout'), 
    path('active/<uid64>/<token>/', views.activate, name = 'activate'),
]