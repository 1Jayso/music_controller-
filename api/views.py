from django.shortcuts import render
from rest_framework import generics
from .models import Room
from .serializer import RoomSerializer

class ROomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

