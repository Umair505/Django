from django.shortcuts import render
import datetime
# Create your views here.
def home(request):
    d= {'name':'Moinul Islam Umar','age':23,'today': datetime.datetime.now(),'frnd':['Abdullah','mahin','sayem','numbers'],'numbers':[1,2,3,4]}
    return render(request,'home.html',d)