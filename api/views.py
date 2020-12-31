from django.shortcuts import render
from rest_framework import generics, status 
from .models import Room
from .serializer import RoomSerializer,CreateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response 

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


# Creating Room
class CreateRoomView(APIView):
    # queryset = Room.objects.all()
    serializer_class = CreateRoomSerializer
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data['guest_can_pause']
            votes_to_skip = serializer.data['votes_to_skip']
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            # print("hey ", queryset[0])
        
            if queryset.exists():
                room = queryset[0]
                print("Hey API room ", room)
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


