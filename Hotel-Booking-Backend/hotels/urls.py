from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
from .views import (
    DistrictListAPIView, DistrictDetailAPIView,
    HotelListAPIView, HotelDetailAPIView,
    AllReviewsListAPIView,
    download_booking_pdf,BookHotelView,ReviewViewSet,AllBookingsListAPIView,HotelNameListView
)

router.register('review_add',ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('districts/', DistrictListAPIView.as_view(), name='district-list'),
    path('districts/<int:pk>/', DistrictDetailAPIView.as_view(), name='district-detail'),
    path('hotels/', HotelListAPIView.as_view(), name='hotel-list'),
    path('hotels/<int:pk>/', HotelDetailAPIView.as_view(), name='hotel-detail'),
    path('download-booking-pdf/<int:booking_id>/', download_booking_pdf, name='download_booking_pdf'),
    path('reviews/', AllReviewsListAPIView.as_view(), name='all-reviews-list'),
    path('book/', BookHotelView.as_view(), name='book_hotel'),
    path('bookings/', AllBookingsListAPIView.as_view(), name='all-bookings-list'),
     path('names/', HotelNameListView.as_view(), name='hotel-name-list'),
    
    
]


