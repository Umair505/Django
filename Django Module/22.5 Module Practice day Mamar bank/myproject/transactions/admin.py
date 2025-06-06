from django.contrib import admin
from .models import Transaction,Transfer

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['account', 'amount', 'balance_after_transaction',
                    'transaction_type', 'loan_approve', 'get_is_bankrupt']

    def save_model(self, request, obj, form, change):
        obj.account.balance += obj.amount
        obj.balance_after_transaction = obj.account.balance
        obj.account.save()
        super().save_model(request, obj, form, change)

    def get_is_bankrupt(self, obj):
        return obj.account.is_bankrupt

    get_is_bankrupt.short_description = 'Is Bankrupt'
    get_is_bankrupt.boolean = True


admin.site.register(Transfer)