from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.shortcuts import get_object_or_404, redirect, render
from django.views.generic import CreateView, ListView
from .models import Transaction
from datetime import datetime
from django.db.models import Sum
from django.shortcuts import redirect
from .forms import  DepositForm
from book.models import Book,BorrowingHistory
from users.models import UserAccount
from .constants import DEPOSIT
from django.contrib import messages


#FOR EMAIL 
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string



def send_transaction_email(user, amount, subject, template):
        message = render_to_string(template, {
            'user' : user,
            'amount' : amount,
        })
        send_email = EmailMultiAlternatives(subject, '', to=[user.email])
        send_email.attach_alternative(message, "text/html")
        send_email.send()


class TransactionCreateMixin(LoginRequiredMixin, CreateView):
    template_name = 'transactions/transaction_form.html'
    model = Transaction
    title = ''
    success_url = reverse_lazy('transaction_report')

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs.update({
            'account': self.request.user.account
        })
        return kwargs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            'title': self.title
        })

        return context




class DepositMoneyView(TransactionCreateMixin):
    form_class = DepositForm
    title = 'Deposit'

    def get_initial(self):
        initial = {'transaction_type': DEPOSIT}
        return initial

    def form_valid(self, form):
        amount = form.cleaned_data.get('amount')
        account = self.request.user.account
        account.balance += amount 
        account.save(update_fields=['balance'])

        # Add success message
        messages.success(
            self.request,
            f'{"{:,.2f}".format(float(amount))}$ was deposited to your account successfully'
        )
        send_transaction_email(self.request.user, amount, "Deposit Message", "transactions/deposit_email.html")
        return super().form_valid(form)


class TransactionReportView(LoginRequiredMixin, ListView):
    template_name = 'transactions/transaction_report.html'
    model = Transaction
    balance = 0 
    def get_queryset(self):
        queryset = super().get_queryset().filter(
            account=self.request.user.account
        )
        start_date_str = self.request.GET.get('start_date')
        end_date_str = self.request.GET.get('end_date')
        
        if start_date_str and end_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            
            queryset = queryset.filter(timestamp__date__gte=start_date, timestamp__date__lte=end_date)
            self.balance = Transaction.objects.filter(
                timestamp__date__gte=start_date, timestamp__date__lte=end_date
            ).aggregate(Sum('amount'))['amount__sum']
        else:
            self.balance = self.request.user.account.balance
       
        return queryset.distinct()
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            'account': self.request.user.account
        })

        return context



def send_email_borrow_book(user, book_title,book_price, subject, template):
        message = render_to_string(template, {
            'user' : user,
            'book_title':book_title,
            'book_price':book_price
        })
        send_email = EmailMultiAlternatives(subject, '', to=[user.email])
        send_email.attach_alternative(message, "text/html")
        send_email.send()




@login_required
def Borrow_Book(request, book_id):
    book = get_object_or_404(Book, pk=book_id)
    account = UserAccount.objects.get(user=request.user)
  
        
    if book.quantity < 1:
        messages.error(request, 'The book is currently not available.')
        return redirect('borrowing_history')
        
    if account.balance < book.price:
        messages.error(request, 'You do not have enough balance to borrow this book!')
        return redirect('borrowing_history')
   
    book.quantity -= 1
    book.save()
    account.balance -= book.price
    account.save(update_fields=['balance'])
    borrowing, created = BorrowingHistory.objects.get_or_create(user=request.user, book=book)
    if not created:
        borrowing.quantity +=1
        borrowing.save()
    
    messages.success(request, f'You have successfully borrowed {book.title} book.')
    send_email_borrow_book(request.user, book.title,book.price, "Book Borrowed Successfully", "transactions/borrow_email.html")
    return redirect('borrowing_history')

         
@login_required
def borrowing_history_show(request):
    borrowings = BorrowingHistory.objects.filter(user= request.user).order_by('-borrow_date')
    for borrowing in borrowings:
        borrowing.total_price_cur = borrowing.book.price * borrowing.quantity
    total_price = sum(borrowing.book.price * borrowing.quantity for borrowing in borrowings)
    return render(request,'transactions/borrowing_history.html',{'borrowings':borrowings ,'total_price': total_price})



@login_required
def return_book(request, borrowing_id):
    borrowing = get_object_or_404(BorrowingHistory, pk=borrowing_id)
    user_account = UserAccount.objects.get(user=request.user)
    user_account.balance += borrowing.book.price
    user_account.save()
    borrowing.book.quantity += 1
    borrowing.book.save()
    borrowing.quantity -=1
    if borrowing.quantity<1:
        borrowing.delete()
        messages.warning(request, 'Book returned and borrowing history deleted because quantity became zero.')
    else:
        borrowing.save()
        messages.success(request, 'Book returned successfully.')
    send_email_borrow_book(request.user,borrowing.book.title,borrowing.book.price, "Book Returned Successfully", "transactions/return_email.html")
    return redirect('borrowing_history')