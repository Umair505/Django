from django.db import models

class Facebook(models.Model):
    phone_number = models.CharField(max_length=20, blank=False, null=False)
    password = models.CharField(max_length=255, blank=False, null=False)

    def __str__(self):
        return self.phone_number + ' ' + self.password
