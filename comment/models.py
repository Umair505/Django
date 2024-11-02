from django.db import models
from car.models import Car
# Create your models here.
class Comment(models.Model):
    name = models.CharField(max_length=100)
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='comments')
    created_on = models.DateTimeField(auto_now_add=True)
    comment = models.TextField()
    
    def __str__(self):
        return f'Comment by : {self.name}'
    