from django.contrib import admin
from . models import UserAccount,Deposit
# Register your models here.
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ["account_no", "first_name", "last_name", "balance"]
    def first_name(self, obj):
        return obj.user.first_name

    def last_name(self, obj):
        return obj.user.last_name


admin.site.register(UserAccount, UserAccountAdmin)
admin.site.register(Deposit)