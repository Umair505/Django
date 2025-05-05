
import uuid
import logging
from datetime import datetime
from django.db import transaction
from django.shortcuts import render, reverse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from django.http import HttpResponse
from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from sslcommerz_lib import SSLCOMMERZ
from account.models import UserAccount
from hotels.models import Hotel, Booking


logger = logging.getLogger(__name__)
global_data = {}
my_array = []

def generate_transaction_id():
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    unique_id = uuid.uuid4().hex[:6].upper()
    return f'TXN-{timestamp}-{unique_id}'

class PaymentSerializer(serializers.Serializer):
    hotel_id = serializers.IntegerField()
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    number_of_rooms = serializers.IntegerField()
    user_id = serializers.IntegerField()

    def validate(self, data):
        hotel_id = data.get('hotel_id')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        number_of_rooms = data.get('number_of_rooms')
        user_id = data.get('user_id')

        try:
            hotel = Hotel.objects.get(id=hotel_id)
        except Hotel.DoesNotExist:
            raise serializers.ValidationError({'error': _('Hotel does not exist')})

        try:
            user_account = UserAccount.objects.get(user_id=user_id)
            print("user account is : ================================= ",user_account)
        except UserAccount.DoesNotExist:
            raise serializers.ValidationError({'error': _('User account does not exist')})

        total_days = (end_date - start_date).days
        total_cost = hotel.price_per_night * number_of_rooms * total_days *117

        if total_days <= 0:
            raise serializers.ValidationError({'error': _('Invalid booking dates')})

        if hotel.available_room < number_of_rooms:
            raise serializers.ValidationError({'error': _('Not enough rooms available')})

        data['hotel'] = hotel
        data['user_account'] = user_account
        data['total_cost'] = total_cost
        return data

    def create(self, validated_data):
        try:
            user_id = validated_data.pop('user_id')
            user_account = validated_data['user_account']
            total_cost = validated_data['total_cost']
            number_of_rooms = validated_data['number_of_rooms']
            start_date = validated_data['start_date']
            end_date = validated_data['end_date']

            with transaction.atomic():
                transaction_id = generate_transaction_id()
                settings = {
                    'store_id': 'bookh668dde6d76e0c',
                    'store_pass': 'bookh668dde6d76e0c@ssl',
                    'issandbox': True
                }

                sslcz = SSLCOMMERZ(settings)
                hotel = validated_data['hotel']
                post_body = {
                    'total_amount': total_cost,
                    'currency': "BDT",
                    'tran_id': transaction_id,
                    'success_url': 'https://hotel-booking-website-backend.vercel.app/payment/success/', # slashe
                    'fail_url': 'https://hotel-booking-website-backend.vercel.app/payment/fail/',
                    'cancel_url': 'https://hotel-booking-website-backend.vercel.app/payment/cancel/',
                    'emi_option': 0,
                    'cus_name': user_account.user.first_name,
                    'cus_email': user_account.user.email,
                    'cus_phone': "01401734642",
                    'cus_add1': "Mymensingh",
                    'cus_city': "Dhaka",
                    'cus_country': "Bangladesh",
                    'shipping_method': "NO",
                    'num_of_item': number_of_rooms,
                    'product_name': hotel.name,
                    'product_category': "Room",
                    'product_profile': "general"
                }

                response = sslcz.createSession(post_body)

                if response.get('status') == 'SUCCESS':
                    gateway_url = response['GatewayPageURL']
                    booking = Booking.objects.create(
                        user_id=user_id,
                        hotel=hotel,
                        start_date=start_date,
                        end_date=end_date,
                        number_of_rooms=number_of_rooms,
                    )

                    booking_id = booking.id
                    print("Booking id =========================================",booking_id)
                    my_array.append(booking_id)
                    global_data[transaction_id] = user_account
                    return {
                        'booking_id': booking.id,
                        'payment_url': gateway_url,
                        'transaction_id': transaction_id
                    }
                else:
                    raise serializers.ValidationError({'error': _('Failed to create payment session')})

        except Exception as e:
            raise serializers.ValidationError({'error': _('Failed to create booking.')})

class PaymentViewSet(viewsets.ViewSet):
    def create(self, request):
        serializer = PaymentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            payment_data = serializer.save()
            return Response(payment_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def payment_success(request):
    if request.method == 'POST':
        transaction_id = request.POST.get('tran_id')
        print("transaction id ==============================", transaction_id)
        if my_array:
            temp_booking_id = my_array.pop(0)
            print("temp booking id =================================",temp_booking_id)
        else:
            temp_booking_id = None
        
        if temp_booking_id is None:
            return render(request, 'booking_fail.html')

        try:
            booking = Booking.objects.get(id=temp_booking_id)
            hotel = booking.hotel
            user_account = global_data.get(transaction_id)

            hotel.available_room -= booking.number_of_rooms
            hotel.save(update_fields=['available_room'])

            email_subject = _("Booking Confirmation")
            email_body = render_to_string('book_confirm_email.html', {
                'hotel_name': hotel.name,
                'start_date': booking.start_date,
                'end_date': booking.end_date,
                'total_cost': hotel.price_per_night * booking.number_of_rooms * (booking.end_date - booking.start_date).days,
                'pdf_link': request.build_absolute_uri(reverse('download_booking_pdf', args=[booking.id]))
            })
            email = EmailMultiAlternatives(email_subject, '', to=[user_account.user.email])
            email.attach_alternative(email_body, "text/html")
            email.send()

            context = {
                'hotel_name': hotel.name,
                'hotel_address': hotel.address,
                'start_date': booking.start_date,
                'end_date': booking.end_date,
                'total_cost': hotel.price_per_night * booking.number_of_rooms * (booking.end_date - booking.start_date).days,
                'pdf_link': request.build_absolute_uri(reverse('download_booking_pdf', args=[booking.id])),
                'user_name': user_account.user.username,
                'user_email': user_account.user.email,
            }

            return render(request, 'booking_success.html', context)

        except Booking.DoesNotExist:
            logger.error(f"Booking with ID {temp_booking_id} does not exist.")
            return render(request, 'booking_fail.html')

    return HttpResponse("Payment success page. This page should be accessed via POST request from the payment gateway.")
@csrf_exempt
def booking_fail(request):
    return render(request, 'booking_fail.html')
@csrf_exempt
def booking_cancel(request):
    return render(request, 'booking_cancel.html')
