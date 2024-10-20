from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User
from musician.models import Musician
from django.utils import timezone

class Album(models.Model):
    musician = models.ForeignKey(Musician, on_delete=models.CASCADE)
    album_name = models.CharField(max_length=100)
    release_date = models.DateTimeField(default=timezone.now)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])

    def __str__(self):
        return self.album_name
