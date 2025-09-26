from django.contrib import admin

from celeplanner.models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ["event_date", "title", "description", "gcal_id"]
