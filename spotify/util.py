from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta


def get_user_token(session_id):
    user_token = SpotifyToken.objects.filter(user=session_id)
    if user_token.exists():
        return user_token[0]
    return None


def update_or_create_user_tokens(session_id, access_token, token_type,
                                 expires_in, refresh_token):
    tokens = get_user_token(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access-token', 'refresh_token',
                    'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token,
                              refresh_token=refresh_token,
                              expires_in=expires_in, token_type=token_type)
