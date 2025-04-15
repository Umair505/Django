from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import Transaction

@receiver(post_save, sender=Transaction)
def handle_transaction_save(sender, instance, created, **kwargs):
    if created and instance.transaction_type == 'Deposit':
        instance.send_confirmation_email(instance.account.user, instance.amount)
