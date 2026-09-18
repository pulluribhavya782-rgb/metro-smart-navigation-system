from django.shortcuts import render, redirect, get_object_or_404
from .models import Ticket
from datetime import datetime

import qrcode
from io import BytesIO
from django.core.files import File


# Home Page
def home(request):
    return render(request, "home.html")


# Book Ticket
def book_ticket(request):

    if request.method == "POST":

        source = request.POST.get("source")
        destination = request.POST.get("destination")
        travel_date = request.POST.get("travel_date")
        passengers = request.POST.get("passengers")

        # Validation
        if not source:
            return render(request, "book_ticket.html", {
                "message": "Please select a valid source station."
            })

        if not destination:
            return render(request, "book_ticket.html", {
                "message": "Please select a valid destination station."
            })

        # Source and destination cannot be the same
        if source == destination:
            return render(request, "book_ticket.html", {
                "message": "Source and destination cannot be the same."
            })

        if not travel_date:
            return render(request, "book_ticket.html", {
                "message": "Please select a travel date."
            })

        if not passengers or int(passengers) < 1:
            return render(request, "book_ticket.html", {
                "message": "Please enter at least 1 passenger."
            })

        # Convert string to date
        travel_date = datetime.strptime(
            travel_date,
            "%Y-%m-%d"
        ).date()

        # Save Ticket
        ticket = Ticket.objects.create(
            source=source,
            destination=destination,
            travel_date=travel_date,
            passengers=int(passengers)
        )

        # -------------------------
        # Generate QR Code
        # -------------------------

        qr_data = f"""
Metro Smart Navigation Ticket

Ticket ID : {ticket.id}
Source : {ticket.source}
Destination : {ticket.destination}
Travel Date : {ticket.travel_date}
Passengers : {ticket.passengers}
"""

        qr = qrcode.make(qr_data)

        buffer = BytesIO()

        qr.save(
            buffer,
            format="PNG"
        )

        ticket.qr_code.save(
            f"ticket_{ticket.id}.png",
            File(buffer),
            save=True
        )

        return redirect(
            'ticket_detail',
            ticket.id
        )

    return render(
        request,
        "book_ticket.html"
    )


# Ticket Details
def ticket_detail(request, ticket_id):

    ticket = get_object_or_404(Ticket, id=ticket_id)

    return render(request, "ticket_detail.html", {
        "ticket": ticket
    })


# All Tickets
def ticket_list(request):

    tickets = Ticket.objects.all()

    return render(request, "ticket_list.html", {
        "tickets": tickets
    })

from django.shortcuts import render, get_object_or_404
from .models import Ticket

def navigation(request, ticket_id):
    ticket = get_object_or_404(Ticket, id=ticket_id)

    if ticket.destination in ["Miyapur", "JNTU College", "KPHB Colony"]:
        platform = 1
    else:
        platform = 2

    return render(request, "navigation.html", {
        "ticket": ticket,
        "platform": platform
    })