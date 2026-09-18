from django.db import models

class Ticket(models.Model):
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    travel_date = models.DateField()
    passengers = models.IntegerField()

    def __str__(self):
        return f"{self.source} -> {self.destination}"

    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)


  