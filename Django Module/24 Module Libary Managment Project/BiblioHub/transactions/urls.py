from django.urls import path
from .views import DepositMoneyView,TransactionReportView,borrowing_history_show,Borrow_Book,return_book

urlpatterns = [
    path("deposit/", DepositMoneyView.as_view(), name="deposit_money"),
    path("report/", TransactionReportView.as_view(), name="transaction_report"),
    path('books/<int:book_id>/borrow/', Borrow_Book, name='borrow_book'),
    path('borrowing-history/', borrowing_history_show, name='borrowing_history'),
    path('borrowing-history/<int:borrowing_id>/return/', return_book, name='return_book'),
     
]
