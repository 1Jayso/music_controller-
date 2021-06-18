from django.shortcuts import render
from rest_framework import response
from rest_framework.response import Response, responses
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from rest_framework import status
from requests import Request, post
from .util import update_or_create_user_tokens


class AuthURL(APIView):
    def get(self, Request, format=None):
        scopes = 'user-read-playback-state user-modify\
         user-read-currently playing'

        url = Request("GET", "https://accounts.spotify.com/authorise", Param={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().uri
        return Response({'url': url}, status=status.HTTP_200_ok)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post("https://accounts.spotify.com/api/token", data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()


access_token = responses.get('access_token')
token_type = responses.get('token_type')
refresh_token = responses.get('refresh_token')
expires_in = responses.get('expires_in')
error = responses.get('error')

update_or_create_user_tokens()
