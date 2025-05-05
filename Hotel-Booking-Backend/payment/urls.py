# urls.py
from django.urls import path
from .views import  payment_success, booking_fail, booking_cancel,PaymentViewSet
from hotels.views import download_booking_pdf

urlpatterns = [
    path('payment-booking/', PaymentViewSet.as_view({'post': 'create'}), name='payment'),
    path('success/', payment_success, name='payment_success'),
    path('fail/', booking_fail, name='payment_fail'),
    path('cancel/', booking_cancel, name='payment_cancel'),
    path('download/booking_pdf/<int:booking_id>/',download_booking_pdf , name='download_booking_pdf'),
]


