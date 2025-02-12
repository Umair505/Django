from django.contrib import admin
from .models import Category, Book, Review, BorrowingHistory

# Register your models here.
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ['name', 'slug']

admin.site.register(Category, CategoryAdmin)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'price', 'quantity')
    search_fields = ('title', 'description')
    list_filter = ('categories',)
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'image')
        }),
        ('Price and Quantity', {
            'fields': ('price', 'quantity')
        }),
        ('Categories', {
            'fields': ('categories',)
        }),
    )
    filter_horizontal = ('categories',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('book', 'user', 'rating', 'created_at')
    search_fields = ('book__title', 'user__username', 'comment')
    list_filter = ('rating', 'created_at')

@admin.register(BorrowingHistory)
class BorrowingHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'borrow_date', 'quantity')
    search_fields = ('user__username', 'book__title')
    list_filter = ('borrow_date',)

