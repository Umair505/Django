from .forms import BookForm
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, CreateView
from django.contrib.messages.views import SuccessMessageMixin
from .models import Book, Category

def book_list_by_category(request, category_slug=None):
    books = Book.objects.all()
    category = None

    if category_slug is not None:
        category = get_object_or_404(Category, slug=category_slug)
        books = books.filter(categories=category)

    categories = Category.objects.all()
    return render(request, 'book/book_list.html', {'books': books, 'categories': categories, 'category': category})






