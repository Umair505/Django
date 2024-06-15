from django.db import models
from categories.models import Category
from author.models import Author
# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=50)
    content= models.TextField()
    category = models.ManyToManyField(Category) # Ekta post multiple catg thakte pare abar ekta catg moddhe multiple post thakte pare
    author = models.ForeignKey(Author,on_delete=models.CASCADE)#author del hoi gele shob post delete hoye jabe
    def __str__(self):
        return f"{self.title}: {self.author}"
    
