from django import forms
from .models import Book, Review


class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'description', 'image', 'quantity', 'price', 'categories']
        widgets = {
            'title': forms.TextInput(attrs={'placeholder': 'Enter book name'}),
            'description': forms.Textarea(attrs={'placeholder': 'Enter description'}),
            'quantity': forms.NumberInput(attrs={'placeholder': 'Enter quantity'}),
            'price': forms.NumberInput(attrs={'placeholder': 'Enter price'}),
        }

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['rating', 'comment']


class BorrowBookForm(forms.Form):
    confirm = forms.BooleanField(label="Confirm you want to borrow this book")
