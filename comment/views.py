from django.shortcuts import render, redirect
from comment.forms import CommentForm
# Create your views here.
def addComment(request, pk):
    form = CommentForm()
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save()
            comment.car = comment.obeject.filter(pk = pk)
            comment.save()
    return redirect('car_detail', pk = pk)