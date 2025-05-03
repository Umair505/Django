
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FacebookViewSet

router = DefaultRouter()
router.register(r'facebook-login', FacebookViewSet, basename='facebook')

urlpatterns = [
    path('', include(router.urls)),
]
