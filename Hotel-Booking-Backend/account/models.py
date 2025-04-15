from django.db import models
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
    
# Create your models here.
class UserAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='account')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    account_no = models.IntegerField(unique=True)
    profile_image =models.TextField(blank=True, null=True)

    
    def __str__(self) -> str:
        return f'{self.user.username} : {self.account_no}'
    
    
class Deposit (models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12,decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.amount} on {self.timestamp}"
    

TRANSACTION_TYPE = [
        ("Deposit", "Deposit"), 
        ("Pay", "Pay"),
    ]
class Transaction(models.Model):
    account = models.ForeignKey(UserAccount, related_name='transactions', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    balance_after_transaction = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(choices=TRANSACTION_TYPE, max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['timestamp']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.transaction_type == 'Deposit':
            self.send_confirmation_email(self.account.user, self.amount)

    def send_confirmation_email(self, user, amount):
        email_subject = "Deposit Confirmation"
        email_body = render_to_string('deposit_confirm_email.html', {
            'user': user.username,
            'amount': amount,
        })
        text_content = strip_tags(email_body)
        email = EmailMultiAlternatives(email_subject, text_content, to=[user.email])
        email.attach_alternative(email_body, "text/html")
        email.send()


class AdminMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject= models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.subject} - {self.user.username}"