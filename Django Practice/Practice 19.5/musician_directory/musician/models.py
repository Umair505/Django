from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User
# Create your models here.
class Musician(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15)
    instrument_type = models.CharField(max_length=50)
    
    def get_absolute_url(self):
        return reverse('musician_list')
    def __str__(self):
        return self.first_name