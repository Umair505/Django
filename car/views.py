from django.shortcuts import get_object_or_404, redirect, render
from django.views.generic.detail import DetailView
from .models import Car
from comment.forms import AddCommentForm


def car_detail(request, pk):
    car = get_object_or_404(Car, pk=pk)
    comments = car.comments.all()
    
    if request.method == 'POST':
        comment_form = AddCommentForm(request.POST)
        if comment_form.is_valid():
            new_comment = comment_form.save(commit=False)
            new_comment.car = car
            new_comment.save()
    else:
        comment_form = AddCommentForm()
    
    context = {
        'car': car,
        'comments': comments,
        'comment_form': comment_form,
    }
    return render(request, 'car_detail.html', context)
        
def buy_car(request, pk):
    car = get_object_or_404(Car, pk=pk)
    car.quantity -= 1
    car.buyers.add(request.user)
    car.save()
    return redirect("profile")