from rest_framework.routers import DefaultRouter

from django.urls import include, path
from celeplanner.views import EventView

router = DefaultRouter(trailing_slash=False)
router.register(r"events", EventView)

urlpatterns = [
    path("", include(router.urls)),
]
