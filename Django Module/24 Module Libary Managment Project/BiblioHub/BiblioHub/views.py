from django.shortcuts import render, get_object_or_404
from django.views.generic import DetailView
from book.models import Book, Review,Category
from book.forms import ReviewForm
def home(request, category_slug=None):
    books = Book.objects.all()

    if category_slug is not None:
        category = get_object_or_404(Category, slug=category_slug)
        books = books.filter(categories=category)

    categories = Category.objects.all()
    return render(request, 'home.html', {'books': books, 'categories': categories})



class DetailBookView( DetailView):
    model = Book
    template_name = 'book_detail.html'
    form_class = ReviewForm

    def post(self, request, *args, **kwargs):
        book = self.get_object()
        comment_form = self.form_class(data=request.POST)
        if comment_form.is_valid():
            new_comment = comment_form.save(commit=False)
            new_comment.book = book
            new_comment.user = request.user  # Now request.user will always be a User instance
            new_comment.save()
        return self.get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        book = self.object
        reviews = Review.objects.filter(book=book)
        comment_form = self.form_class()
        context['reviews'] = reviews
        context['comment_form'] = comment_form
        return context



def about_us(request):
    return render(request,'about.html')