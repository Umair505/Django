from django.shortcuts import render, redirect,get_object_or_404
from . models import Task
from .forms import TaskForm
from django.contrib import messages


def show_task(request):
    task = Task.objects.all().order_by('-task_assign_date')
    return render(request,'show_task.html',{'data':task})

def add_task(request):
    if request.method=='POST':
        form =TaskForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request,'Task added successfully')
            return redirect('show_task')
    else:
        form = TaskForm()
    
    return render(request, 'add_task.html',{'form':form})

def edit_task(request,id):

    task = get_object_or_404(Task,pk=id)
    if request.method =='POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            messages.success(request,'Task uploaded successfully')
            return redirect('show_task')
    else:
        form= TaskForm(instance=task)
    return render(request,'edit_task.html',{'form':form})

def delete_task(request,id):
    task = get_object_or_404(Task,pk=id)
    task.delete()
    messages.success(request, 'Successfully Deleted Task')
    return redirect('show_task')
        
            