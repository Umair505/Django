from django.contrib import admin
from .models import District, Hotel, Review, Booking

@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('district_name',)}
    list_display = ('district_name', 'slug')

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('name', 'district', 'price_per_night', 'available_room')
    list_filter = ('district',)
    search_fields = ('name', 'district__district_name')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('hotel', 'user', 'rating', 'created')
    list_filter = ('rating', 'created')
    search_fields = ('hotel__name', 'user__username')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('hotel', 'user', 'start_date', 'end_date', 'number_of_rooms', 'booked_at')
    list_filter = ('start_date', 'end_date', 'booked_at')
    search_fields = ('hotel__name', 'user__username')

