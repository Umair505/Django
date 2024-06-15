from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
def courses(request):
    return HttpResponse("This is a first app/Courses Page.")
def about(request):
    return HttpResponse("This is a first app/About page.")
def home(request):
    return HttpResponse("This is a first app page.")
