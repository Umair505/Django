from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.utils import timezone
from django.shortcuts import get_object_or_404, redirect, render
from django.views.generic import CreateView, ListView
from transactions.models import Transaction
from datetime import datetime
from django.http import HttpResponse
from django.db.models import Sum
from django.views import View
from django.shortcuts import redirect
from django.views.generic import FormView
from .forms import TransferForm
from .models import Transfer
from accounts.models import UserBankAccount
from bankrupt_app.models import IsBankrupt
from transactions.forms import (
    DepositForm,
    WithdrawForm,
    LoanRequestForm,
)
from transactions.constants import DEPOSIT, WITHDRAWAL,LOAN, LOAN_PAID


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
        account.save(
            update_fields=[
                'balance'
            ]
        )

        messages.success(
            self.request,
            f'{"{:,.2f}".format(float(amount))}$ was deposited to your account successfully'
        )

        return super().form_valid(form)


class WithdrawMoneyView(TransactionCreateMixin):
    form_class = WithdrawForm
    title = 'Withdraw Money'

    def get_initial(self):
        initial = {'transaction_type': WITHDRAWAL}
        return initial

    def form_valid(self, form):
        amount = form.cleaned_data.get('amount')
        
        bankrupt_status = IsBankrupt.objects.first()
        if bankrupt_status and bankrupt_status.is_bankrupt:
            messages.error(self.request,'The bank is bankrupt.Withdrawal are disabled')
            return redirect('withdraw_money')
        

        if amount > self.request.user.account.balance:
            messages.error(self.request, 'Insufficient funds.')
            return redirect('withdraw_money')
        
        self.request.user.account.balance -= form.cleaned_data.get('amount')
        self.request.user.account.save(update_fields=['balance'])

        messages.success(
            self.request,
            f'Successfully withdrawn {"{:,.2f}".format(float(amount))}$ from your account'
        )

        return super().form_valid(form)
    
    
    

class LoanRequestView(TransactionCreateMixin):
    form_class = LoanRequestForm
    title = 'Request For Loan'

    def get_initial(self):
        initial = {'transaction_type': LOAN}
        return initial

    def form_valid(self, form):
        amount = form.cleaned_data.get('amount')
        current_loan_count = Transaction.objects.filter(
            account=self.request.user.account,transaction_type=3,loan_approve=True).count()
        if current_loan_count >= 3:
            return HttpResponse("You have cross the loan limits")
        messages.success(
            self.request,
            f'Loan request for {"{:,.2f}".format(float(amount))}$ submitted successfully'
        )

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
    
           
class PayLoanView(LoginRequiredMixin, View):
    def get(self, request, loan_id):
        loan = get_object_or_404(Transaction, id=loan_id)
        print(loan)
        if loan.loan_approve:
            user_account = loan.account
            if loan.amount < user_account.balance:
                user_account.balance -= loan.amount
                loan.balance_after_transaction = user_account.balance
                user_account.save()
                loan.loan_approved = True
                loan.transaction_type = LOAN_PAID
                loan.save()
                return redirect('loan_list')
            else:
                messages.error(
            self.request,
            f'Loan amount is greater than available balance'
        )

        return redirect('loan_list')


class LoanListView(LoginRequiredMixin,ListView):
    model = Transaction
    template_name = 'transactions/loan_request.html'
    context_object_name = 'loans'
    
    def get_queryset(self):
        user_account = self.request.user.account
        queryset = Transaction.objects.filter(account=user_account,transaction_type=3)
        print(queryset)
        return queryset
    


class TransferMoneyView(FormView):
    template_name = 'transactions/transfer_form.html'
    form_class = TransferForm
    success_url = 'home'  

    def form_valid(self, form):
        sender_account = self.request.user.account
        receiver_account = form.cleaned_data['receiver']
        amount = form.cleaned_data['amount']

        if sender_account.balance < amount:
            messages.error(self.request, 'Insufficient balance. Transfer failed.')
        else:
            sender_account.balance -= amount
            receiver_account.balance += amount
            sender_account.save()
            receiver_account.save()

            Transfer.objects.create(sender=sender_account, receiver=receiver_account, amount=amount)
            messages.success(self.request, f'Successfully transferred ${amount} to {receiver_account.user.username}.')

        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, 'Transfer failed! Please check the details.')
        return super().form_invalid(form)
    
    
    
    
    
    
@login_required
def transfer_money(request):
    form = TransferForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            sender_account = request.user.account
            receiver_account_no = form.cleaned_data['receiver_account_no']
            receiver_account = UserBankAccount.objects.get(account_no=receiver_account_no)
            amount = form.cleaned_data['amount']

            if sender_account.balance < amount:
                messages.error(request, 'Insufficient balance. Transfer failed.')
            else:
                sender_account.balance -= amount
                receiver_account.balance += amount
                sender_account.save()
                receiver_account.save()

                Transfer.objects.create(sender=sender_account, receiver=receiver_account, amount=amount)
                messages.success(request, f'Successfully transferred ${amount} to Account No: {receiver_account_no}.')
                return redirect('home')
    return render(request, 'transactions/transfer_form.html', {'form': form})
