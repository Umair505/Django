from django.shortcuts import render
from rest_framework import viewsets
# Create your views here.
  
from.import models
from.import serializers
class ContactViewSet(viewsets.ModelViewSet):
    queryset = models.ContactUs.objects.all()
    serializer_class = serializers.ContactUsSerializer