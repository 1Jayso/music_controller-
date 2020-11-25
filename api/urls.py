from django.urls import path
from .views import ROomView


urlpatterns = [
    path('', ROomView.as_view()),
    # path('', main)
]
