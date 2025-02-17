from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('author', 'Author'),
        ('editor', 'Editor'),
        ('admin', 'Admin')
    )
    user_type = models.CharField(max_length=10,choices=USER_TYPE_CHOICES,default='viewer')
