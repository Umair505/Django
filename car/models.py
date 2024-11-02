from django.db import models
from brand.models import Brand
from django.contrib.auth.models import User

# Create your models here.
class Car(models.Model):
    name = models.CharField(max_length=100)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    price = models.IntegerField()
    quantity = models.IntegerField()
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    buyers = models.ManyToManyField(User, blank=True)
        
    def __str__(self):
        return f'Car name : {self.name}'
    
    
    