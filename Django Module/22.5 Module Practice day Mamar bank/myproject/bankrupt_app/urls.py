from django.urls import path
from .views import AmniView

urlpatterns = [
    path("amni/", AmniView.as_view(), name="amni_dekhi"),
 
]
