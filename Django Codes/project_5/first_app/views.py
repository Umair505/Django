from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request,'./first_app/home.html')

def about(request):
    return render(request,"./first_app/about.html")

def submit_form(request):
    return render(request,'./first_app/form.html')