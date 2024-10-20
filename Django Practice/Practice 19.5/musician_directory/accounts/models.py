from django.db import models

# Create your models here.
class Author(models.Model):
    name =models.CharField(max_length=50)
    bio = models.TextField()
    phone = models.CharField(max_length=15)
    
    def __str__(self):
        return self.name