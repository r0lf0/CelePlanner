from celeplanner.models import Event
from rest_framework import viewsets

from celeplanner.serializers import EventSerializer


class EventView(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
