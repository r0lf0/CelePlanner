from django.db import models


class Event(models.Model):
    event_date = models.DateField()
    title = models.CharField(max_length=255)
    description = models.TextField()
    gcal_id = models.CharField(max_length=255, unique=True)
