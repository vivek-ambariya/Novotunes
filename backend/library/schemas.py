from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List
from uuid import uuid4


@dataclass
class TrackSchema:
    title: str
    artist: str
    audio_url: str
    genres: List[str] = field(default_factory=list)
    mood: str = 'neutral'
    duration: int = 0
    album: str = ''
    cover_image: str = ''
    popularity: float = 0.0
    type: str = 'song'
    release_year: int = 2026
    track_id: str = field(default_factory=lambda: str(uuid4()))
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def to_document(self) -> Dict[str, Any]:
        return {
            'track_id': self.track_id,
            'title': self.title,
            'artist': self.artist,
            'audio_url': self.audio_url,
            'genres': list(self.genres),
            'mood': self.mood,
            'duration': int(self.duration),
            'album': self.album,
            'cover_image': self.cover_image,
            'popularity': float(self.popularity),
            'type': self.type,
            'release_year': int(self.release_year),
            'created_at': self.created_at,
        }


@dataclass
class PlaylistSchema:
    name: str
    owner_id: str
    tracks: List[str] = field(default_factory=list)
    is_public: bool = True
    description: str = ''
    playlist_id: str = field(default_factory=lambda: str(uuid4()))
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def to_document(self) -> Dict[str, Any]:
        return {
            'playlist_id': self.playlist_id,
            'name': self.name,
            'owner_id': self.owner_id,
            'tracks': list(self.tracks),
            'is_public': self.is_public,
            'description': self.description,
            'created_at': self.created_at,
        }


@dataclass
class PodcastSchema:
    title: str
    host: str
    description: str = ''
    category: str = 'General'
    cover_image: str = ''
    episodes: List[Dict[str, Any]] = field(default_factory=list)
    podcast_id: str = field(default_factory=lambda: str(uuid4()))
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def to_document(self) -> Dict[str, Any]:
        return {
            'podcast_id': self.podcast_id,
            'title': self.title,
            'host': self.host,
            'description': self.description,
            'category': self.category,
            'cover_image': self.cover_image,
            'episodes': list(self.episodes),
            'created_at': self.created_at,
        }
