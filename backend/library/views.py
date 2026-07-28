from __future__ import annotations

from typing import Any, Dict

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .mongodb import ping
from .repositories import MongoCatalogRepository
from .services import MoodDetectionService, RecommendationService

repository = MongoCatalogRepository()
mood_service = MoodDetectionService(repository)
recommendation_service = RecommendationService(repository)


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(_request):
    repository.seed_if_empty()
    return Response({
        'status': 'ok',
        'service': 'nova-tunes-backend',
        'database': 'mongodb',
        'mongo_connected': ping(),
        'counts': repository.counts(),
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def seed_catalog(_request):
    counts = repository.seed_if_empty()
    return Response({'status': 'seeded', 'counts': counts})


@api_view(['GET'])
@permission_classes([AllowAny])
def catalog_view(request):
    repository.seed_if_empty()
    filters = {
        'mood': request.query_params.get('mood'),
        'genre': request.query_params.get('genre'),
        'search': request.query_params.get('search'),
    }
    limit = int(request.query_params.get('limit', 50))
    tracks = repository.list_tracks(filters=filters, limit=limit)
    return Response({
        'tracks': tracks,
        'playlists': repository.list_playlists(),
        'podcasts': repository.list_podcasts(),
        'counts': repository.counts(),
    })


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def playlists_view(request):
    repository.seed_if_empty()
    if request.method == 'POST':
        payload = request.data if isinstance(request.data, dict) else {}
        playlist = repository.create_playlist(payload)
        return Response({'playlist': playlist}, status=201)
    return Response({'playlists': repository.list_playlists()})


@api_view(['GET'])
@permission_classes([AllowAny])
def podcasts_view(request):
    repository.seed_if_empty()
    category = request.query_params.get('category')
    return Response({'podcasts': repository.list_podcasts(category=category)})


@api_view(['POST'])
@permission_classes([AllowAny])
def detect_mood_and_queue(request):
    repository.seed_if_empty()
    image_b64 = request.data.get('image')
    text = request.data.get('text')
    limit = int(request.data.get('limit', 10))
    if text:
        payload = mood_service.detect_from_text_and_queue(text, limit=limit)
    else:
        payload = mood_service.detect_and_queue(image_b64, limit=limit)
    repository.save_mood_session(payload)
    return Response(payload)


@api_view(['GET'])
@permission_classes([AllowAny])
def artists_view(request):
    repository.seed_if_empty()
    artists = repository.list_artists()
    return Response({'artists': artists})


@api_view(['GET'])
@permission_classes([AllowAny])
def artist_detail_view(request, artist_name: str):
    repository.seed_if_empty()
    artist = repository.get_artist_by_name(artist_name)
    if not artist:
        # Create a dynamic mock biography/profile if not fully seeded to prevent crash
        artist = {
            'name': artist_name,
            'bio': f'Alternative music project by {artist_name}.',
            'monthly_listeners': 1200000,
            'profile_pic': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop',
            'similar_artists': []
        }
    # Get tracks by this artist
    tracks = repository.list_tracks(limit=200)
    artist_tracks = [t for t in tracks if t.get('artist', '').lower() == artist_name.lower()]
    # Group into albums
    albums = {}
    for track in artist_tracks:
        album_name = track.get('album', 'Single')
        if album_name not in albums:
            albums[album_name] = {
                'name': album_name,
                'cover_image': track.get('cover_image', ''),
                'artist': artist_name,
                'release_year': track.get('release_year', 2026),
                'tracks': []
            }
        albums[album_name]['tracks'].append(track)
        
    return Response({
        'artist': artist,
        'tracks': artist_tracks,
        'albums': list(albums.values())
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def recommend_tracks(request):
    repository.seed_if_empty()
    user_id = str(request.data.get('user_id', 'demo-user'))
    history = list(request.data.get('history', []))
    catalog = request.data.get('catalog')
    limit = int(request.data.get('limit', 10))
    if not history:
        history = repository.get_user_history(user_id=user_id)
    recommendations = recommendation_service.recommend(user_id=user_id, history=history, catalog=catalog, limit=limit)
    return Response({'user_id': user_id, 'recommendations': recommendations, 'source': 'mongodb'})


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def room_state_view(request, room_name: str):
    repository.seed_if_empty()
    if request.method == 'POST':
        payload = request.data if isinstance(request.data, dict) else {}
        state = repository.update_room_state(room_name, payload)
        return Response({'room': state})
    return Response({'room': repository.get_room_state(room_name)})
