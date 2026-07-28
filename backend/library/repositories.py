from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Iterable, List, Optional

from pymongo import ASCENDING, DESCENDING

from .mongodb import get_collection
from .seed import DEFAULT_ARTISTS, DEFAULT_PLAYLISTS, DEFAULT_PODCASTS, DEFAULT_TRACKS
from .schemas import PlaylistSchema, PodcastSchema, TrackSchema


class MongoCatalogRepository:
    def __init__(self):
        self.tracks = get_collection('tracks')
        self.playlists = get_collection('playlists')
        self.podcasts = get_collection('podcasts')
        self.rooms = get_collection('rooms')
        self.play_history = get_collection('play_history')
        self.mood_sessions = get_collection('mood_sessions')
        self.artists = get_collection('artists')
        self.ensure_indexes()

    def ensure_indexes(self) -> None:
        self.tracks.create_index([('track_id', ASCENDING)], unique=True)
        self.tracks.create_index([('mood', ASCENDING), ('popularity', DESCENDING)])
        self.tracks.create_index([('genres', ASCENDING)])
        self.playlists.create_index([('playlist_id', ASCENDING)], unique=True)
        self.playlists.create_index([('owner_id', ASCENDING)])
        self.podcasts.create_index([('podcast_id', ASCENDING)], unique=True)
        self.rooms.create_index([('room_name', ASCENDING)], unique=True)
        self.play_history.create_index([('user_id', ASCENDING), ('created_at', DESCENDING)])
        self.mood_sessions.create_index([('created_at', DESCENDING)])
        self.artists.create_index([('artist_id', ASCENDING)], unique=True)
        self.artists.create_index([('name', ASCENDING)])

    def seed_if_empty(self) -> Dict[str, int]:
        counts = {
            'tracks': self.tracks.count_documents({}),
            'playlists': self.playlists.count_documents({}),
            'podcasts': self.podcasts.count_documents({}),
            'artists': self.artists.count_documents({}),
        }
        if counts['tracks'] < 100 or counts['playlists'] < 4 or counts['podcasts'] < 5 or counts['artists'] < 50:
            self.tracks.delete_many({})
            self.playlists.delete_many({})
            self.podcasts.delete_many({})
            self.artists.delete_many({})
            
            self.tracks.insert_many([TrackSchema(**track).to_document() for track in DEFAULT_TRACKS])
            self.playlists.insert_many([PlaylistSchema(**playlist).to_document() for playlist in DEFAULT_PLAYLISTS])
            self.podcasts.insert_many([PodcastSchema(**podcast).to_document() for podcast in DEFAULT_PODCASTS])
            self.artists.insert_many(DEFAULT_ARTISTS)
        elif counts['artists'] == 0:
            self.artists.insert_many(DEFAULT_ARTISTS)
        return self.counts()

    def counts(self) -> Dict[str, int]:
        return {
            'tracks': self.tracks.count_documents({}),
            'playlists': self.playlists.count_documents({}),
            'podcasts': self.podcasts.count_documents({}),
            'rooms': self.rooms.count_documents({}),
            'play_history': self.play_history.count_documents({}),
            'artists': self.artists.count_documents({}),
        }

    def list_artists(self) -> List[Dict[str, Any]]:
        cursor = self.artists.find({}).sort('name', ASCENDING)
        return [self._clean(doc) for doc in cursor]

    def get_artist_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        doc = self.artists.find_one({'name': name})
        if doc:
            return self._clean(doc)
        return None

    def _clean(self, document: Dict[str, Any]) -> Dict[str, Any]:
        cleaned = dict(document)
        cleaned.pop('_id', None)
        return cleaned

    def list_tracks(self, filters: Optional[Dict[str, Any]] = None, limit: int = 50) -> List[Dict[str, Any]]:
        query: Dict[str, Any] = {}
        if filters:
            if filters.get('mood'):
                query['mood'] = filters['mood']
            if filters.get('genre'):
                query['genres'] = filters['genre']
            if filters.get('search'):
                search = filters['search']
                query['$or'] = [
                    {'title': {'$regex': search, '$options': 'i'}},
                    {'artist': {'$regex': search, '$options': 'i'}},
                    {'album': {'$regex': search, '$options': 'i'}},
                ]
        cursor = self.tracks.find(query).sort([('popularity', DESCENDING), ('title', ASCENDING)]).limit(int(limit))
        return [self._clean(document) for document in cursor]

    def list_playlists(self, owner_id: Optional[str] = None) -> List[Dict[str, Any]]:
        query: Dict[str, Any] = {}
        if owner_id:
            query['owner_id'] = owner_id
        return [self._clean(doc) for doc in self.playlists.find(query).sort('created_at', DESCENDING)]

    def list_podcasts(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        query: Dict[str, Any] = {}
        if category:
            query['category'] = category
        return [self._clean(doc) for doc in self.podcasts.find(query).sort('created_at', DESCENDING)]

    def create_playlist(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        playlist = PlaylistSchema(
            name=payload['name'],
            owner_id=payload.get('owner_id', 'demo-user'),
            tracks=list(payload.get('tracks', [])),
            is_public=bool(payload.get('is_public', True)),
            description=payload.get('description', ''),
        )
        document = playlist.to_document()
        self.playlists.insert_one(document)
        return document

    def update_room_state(self, room_name: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        document = {
            'room_name': room_name,
            'action': payload.get('action', 'IDLE'),
            'track_id': payload.get('track_id'),
            'timestamp': payload.get('timestamp', 0),
            'volume': payload.get('volume', 0.7),
            'is_playing': payload.get('is_playing', False),
            'queue': list(payload.get('queue', [])),
            'members': list(payload.get('members', [])),
            'updated_at': now,
        }
        self.rooms.update_one({'room_name': room_name}, {'$set': document}, upsert=True)
        return document

    def get_room_state(self, room_name: str) -> Dict[str, Any]:
        document = self.rooms.find_one({'room_name': room_name}) or {}
        document.pop('_id', None)
        if not document:
            return {
                'room_name': room_name,
                'action': 'IDLE',
                'track_id': None,
                'timestamp': 0,
                'volume': 0.7,
                'is_playing': False,
                'queue': [],
                'members': [],
                'updated_at': None,
            }
        return document

    def record_play_history(self, user_id: str, track_id: str, action: str, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        document = {
            'user_id': user_id,
            'track_id': track_id,
            'action': action,
            'metadata': metadata or {},
            'created_at': datetime.now(timezone.utc).isoformat(),
        }
        self.play_history.insert_one(document)
        return document

    def get_user_history(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        cursor = self.play_history.find({'user_id': user_id}).sort('created_at', DESCENDING).limit(int(limit))
        return [self._clean(document) for document in cursor]

    def save_mood_session(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        document = {
            'user_id': payload.get('user_id', 'anonymous'),
            'detected_emotion': payload.get('detected_emotion', 'neutral'),
            'queue': list(payload.get('queue', [])),
            'created_at': datetime.now(timezone.utc).isoformat(),
        }
        self.mood_sessions.insert_one(document)
        return document
