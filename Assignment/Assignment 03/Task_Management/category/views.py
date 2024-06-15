from django.shortcuts import render,redirect
from django.contrib import messages
from . models import Category
from . forms import CategoryForm
# Create your views here.
def show_category(request):
    categories = Category.objects.all()
    return render(request,'show_category.html',{'categories':categories})

def add_category(request):
    if request.method == 'POST':
        form = CategoryForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request,'Category Added Succesfully')
            return redirect('show_category')
    else:
        form = CategoryForm()
    return render(request,'add_category.html',{'form':form})
            