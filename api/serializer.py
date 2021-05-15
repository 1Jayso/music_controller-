from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at' )


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        
        fields = ('guest_can_pause', 'votes_to_skip')
        



class UpdateRoomSerializer(serializers.ModelSerializer):
    # This code will ensure that we dont use the unique code
    # generated in the models.py file. 
    #because when we want to update the room, the code of that 
    # room will always be a part of a room. 
    code = serializers.CharField(validators=[])
    class Meta:
        model = Room
        
        fields = ('guest_can_pause', 'votes_to_skip', 'code')
        