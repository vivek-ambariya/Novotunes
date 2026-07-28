from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/listening_room/(?P<room_name>[\w-]+)/$', consumers.RoomConsumer.as_asgi()),
]
