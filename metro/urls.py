from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('book_ticket/', views.book_ticket, name='book_ticket'),
    path('tickets/', views.ticket_list, name='ticket_list'),
    path('ticket/<int:ticket_id>/', views.ticket_detail, name='ticket_detail'),
    path('navigation/<int:ticket_id>/', views.navigation, name='navigation'),
]