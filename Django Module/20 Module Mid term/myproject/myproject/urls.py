"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('cars/', include('cars.urls')),
    path('brand/', include('brand.urls')),
    path('', views.home, name='home'),
    path('category/<slug:category_slug>/',
         views.home, name='category_wise_view'),
    path('details/<int:id>', views.DetailPostView.as_view(), name='car_detail'),
    path('purchase/<int:car_id>/', views.purchased_cars, name='purchase_car'),
    path('purchases-list/', views.purchase_list, name='purchase_list'),
    path('profile/', views.profile_view, name='profile_views'),
    



]

urlpatterns += static(settings.MEDIA_URL,
                      document_root=settings.MEDIA_ROOT)
