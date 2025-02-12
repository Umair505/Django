from django.contrib import admin
from .models import UserAccount, UserAddress

@admin.register(UserAccount)
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ('account_no', 'user_email', 'user_username', 'account_type', 'balance')
    list_filter = ('account_type', 'gender')
    search_fields = ('user__email', 'user__username', 'account_no')

    def user_email(self, obj):
        return obj.user.email

    def user_username(self, obj):
        return obj.user.username

    user_email.short_description = 'Email'
    user_username.short_description = 'Username'

@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    list_display = ('user_username', 'user_email', 'street_address', 'city', 'postal_code', 'country')
    search_fields = ('user__email', 'user__username')

    def user_email(self, obj):
        return obj.user.email

    def user_username(self, obj):
        return obj.user.username

    user_email.short_description = 'Email'
    user_username.short_description = 'Username'
