from django.db import models
from django.contrib.auth.models import User
from brand.models import Brand

class Car(models.Model):
    category = models.ManyToManyField(Brand)
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='cars/media/uploads/', blank=True, null=True)
    quantity = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_history = models.ManyToManyField(User, through='Purchase')
     
    def __str__(self):
        return self.name

class Comment(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='comments')
    name = models.CharField(max_length=20)
    email = models.EmailField()
    body = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'Comment by {self.name}'

class Purchase(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    car = models.ForeignKey(Car,on_delete=models.CASCADE)
    purchase_date= models.DateTimeField(auto_now_add=True)
    
    