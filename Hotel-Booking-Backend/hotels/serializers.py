from rest_framework import serializers
from django.db import transaction
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.urls import reverse
from .models import Hotel, Review, Booking, District
from account.models import UserAccount
from django.utils.translation import gettext_lazy as _


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = '__all__'

class HotelSerializer(serializers.ModelSerializer):
    district_name = serializers.CharField(source='district.district_name', read_only=True) 

    class Meta:
        model = Hotel
        fields = ['id', 'name', 'address', 'district_name', 'district', 'photo', 'description', 'price_per_night', 'available_room']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [ 'body',  'rating', 'hotel', 'user']
        
        
        
class ReviewSerializerAll(serializers.ModelSerializer):
    hotel = HotelSerializer()
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        return obj.user.username if obj.user else 'Anonymous'
    
    class Meta:
        model = Review
        fields = ['id', 'body', 'created', 'rating', 'hotel', 'user']
        

class BookingSerializer(serializers.Serializer):
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
        except UserAccount.DoesNotExist:
            raise serializers.ValidationError({'error': _('User account does not exist')})

        total_days = (end_date - start_date).days
        total_cost = hotel.price_per_night * number_of_rooms * total_days

        if user_account.balance < total_cost:
            raise serializers.ValidationError({'error': _('Insufficient balance')})

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
                # user_account.balance -= total_cost
                # user_account.save(update_fields=['balance'])
                UserAccount.objects.filter(id=user_account.id).update(balance=user_account.balance - total_cost)

                hotel = validated_data['hotel']
                hotel.available_room -= number_of_rooms
                hotel.save(update_fields=['available_room'])

                booking = Booking.objects.create(
                    user_id=user_id,  
                    hotel=hotel,
                    start_date=start_date,
                    end_date=end_date,
                    number_of_rooms=number_of_rooms
                )

                # Sending booking confirmation email
                email_subject = _("Booking Confirmation")
                email_body = render_to_string('book_confirm_email.html', {
                    'hotel_name': hotel.name,
                    'start_date': start_date,
                    'end_date': end_date,
                    'total_cost': total_cost,
                    'pdf_link': self.context['request'].build_absolute_uri(reverse('download_booking_pdf', args=[booking.id]))
                })
                email = EmailMultiAlternatives(email_subject, '', to=[user_account.user.email])
                email.attach_alternative(email_body, "text/html")
                email.send()

            return booking
        except Exception as e:
            raise serializers.ValidationError({'error': _('Failed to create booking.')})



class AllBookingSerializer(serializers.ModelSerializer):
    hotel = HotelSerializer()
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        return obj.user.username if obj.user else None

    class Meta:
        model = Booking
        fields = ['id', 'hotel', 'start_date', 'end_date', 'number_of_rooms', 'booked_at', 'user']



class AllHotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = ['id', 'name']
        
