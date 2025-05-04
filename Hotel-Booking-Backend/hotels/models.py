from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class District(models.Model):
    district_name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=200, unique=True, blank=True, null=True)

    def __str__(self):
        return self.district_name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.district_name)
        super().save(*args, **kwargs)


class Hotel(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    photo = models.TextField( blank=True, null=True)
    description = models.TextField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    available_room = models.IntegerField(default=0)
    district = models.ForeignKey(
        District, on_delete=models.CASCADE, related_name='hotels')

    def __str__(self):
        return f'{self.name} in {self.district.district_name}'


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    number_of_rooms = models.PositiveIntegerField()
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Booking by {self.user.username} at {self.hotel.name} from {self.start_date} to {self.end_date}'


class Review(models.Model):
    STAR_CHOICES = [
        ('⭐', '⭐'),
        ('⭐⭐', '⭐⭐'),
        ('⭐⭐⭐', '⭐⭐⭐'),
        ('⭐⭐⭐⭐', '⭐⭐⭐⭐'),
        ('⭐⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'),
    ]
    hotel = models.ForeignKey(
        Hotel, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews',)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    rating = models.CharField(choices=STAR_CHOICES, max_length=10)

    class Meta:
        unique_together = ('hotel', 'user')

    def __str__(self):
        if self.user:
            return f'Review by {self.user.username} for {self.hotel.name}'
        else:
            return f'Review for {self.hotel.name} (User not specified)'


class ContactUsModels(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    address = models.TextField()


