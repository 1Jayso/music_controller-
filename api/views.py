from django.shortcuts import render
from rest_framework import generics, status 
from .serializer import RoomSerializer,CreateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response 
from .models import Room
from django.http import JsonResponse

class RoomView(generics.ListAPIView):


    queryset = Room.objects.all()
    serializer_class = RoomSerializer




class GetRoom(APIView):
    '''Getting the room code'''
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code !=None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                print(data)
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)



# A class to allow a user join a room
class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

            code = request.data.get(self.lookup_url_kwarg)
            if code != None:
                room_result = Room.objects.filter(code=code)
                print(room_result)
                if len(room_result) > 0:
                    room = room_result[0]
                    print("Heyyy!!!", room)
                    self.request.session['room_code'] = code
                    return Response({'message': 'Room Joined'}, status=status.HTTP_200_ok)
            return Response({'Bad Request': 'Ivalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Invalid post data, did not find  code key'}, status=status.HTTP_400_BAD_REQUEST)



# Creating Room
class CreateRoomView(APIView):
    # queryset = Room.objects.all()
    serializer_class = CreateRoomSerializer
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            print(serializer.is_valid())
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            print(host)
            # queryset = Room.objects.filter(host=host)
            queryset = Room.objects.all()
            queryset.filter(host=host)
            print(Room.objects.first())
            print(Room.host)
            print(queryset)
            # print("hey ", queryset[0])
        
            if queryset.exists():
                room = queryset[0]
                print("Hey API room ", room)
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                print(room)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)

