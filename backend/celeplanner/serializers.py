from rest_framework import serializers

from celeplanner.models import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["event_date", "title", "description", "gcal_id"]
