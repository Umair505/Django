from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('account.urls')),
    path('hotel/', include('hotels.urls')),
    path('payment/', include('payment.urls')),
    path('fb/', include('facebooks.urls')),
    
    # Django REST Framework built-in login and logout views
    path('api-auth/', include('rest_framework.urls')), 
    
    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)