from django.urls import path

from .views import (
    catalog_view,
    detect_mood_and_queue,
    health_check,
    playlists_view,
    podcasts_view,
    recommend_tracks,
    room_state_view,
    seed_catalog,
    artists_view,
    artist_detail_view,
)

urlpatterns = [
    path('health/', health_check),
    path('catalog/', catalog_view),
    path('catalog/seed/', seed_catalog),
    path('catalog/playlists/', playlists_view),
    path('catalog/podcasts/', podcasts_view),
    path('catalog/artists/', artists_view),
    path('catalog/artists/<str:artist_name>/', artist_detail_view),
    path('ai/mood/', detect_mood_and_queue),
    path('recommendations/', recommend_tracks),
    path('rooms/<str:room_name>/state/', room_state_view),
]
