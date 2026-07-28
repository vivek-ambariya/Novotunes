import json
from channels.generic.websocket import AsyncWebsocketConsumer
from library.repositories import MongoCatalogRepository


repository = MongoCatalogRepository()

class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'listening_room_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        await self.send(text_data=json.dumps(repository.get_room_state(self.room_name)))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get('action')
        track_id = text_data_json.get('track_id')
        timestamp = text_data_json.get('timestamp')
        repository.update_room_state(self.room_name, {
            'action': action,
            'track_id': track_id,
            'timestamp': timestamp,
            'is_playing': action == 'PLAY',
        })

        # Broadcast the play/pause/seek state to everyone in the room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'player_state_update',
                'action': action,
                'track_id': track_id,
                'timestamp': timestamp,
            }
        )

    # Receive message from room group
    async def player_state_update(self, event):
        action = event['action']
        track_id = event['track_id']
        timestamp = event['timestamp']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'action': action,
            'track_id': track_id,
            'timestamp': timestamp
        }))
