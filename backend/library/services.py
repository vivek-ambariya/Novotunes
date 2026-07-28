from __future__ import annotations

import base64
from typing import Any, Dict, List

from .repositories import MongoCatalogRepository


EMOTION_TO_GENRES = {
    'happy': ['Indie Pop', 'Chillhop', 'Dance'],
    'calm': ['Ambient', 'Lo-Fi', 'Piano'],
    'sad': ['Ambient', 'Dream Pop', 'Space Ambient'],
    'angry': ['Electronic', 'Industrial', 'Darkwave'],
    'surprise': ['Synthwave', 'Dance', 'Electronic'],
    'neutral': ['Lo-Fi', 'Chillhop', 'Jazz Fusion'],
    'focus': ['Lo-Fi', 'Piano', 'Ambient'],
    'energy': ['Dance', 'Electronic', 'Synthwave'],
    'dreamy': ['Dream Pop', 'Space Ambient', 'Ambient'],
    'relax': ['Ambient', 'Piano', 'Smooth'],
    'peaceful': ['Piano', 'Acoustic', 'Ambient'],
}


class MoodDetectionService:
    def __init__(self, repository: MongoCatalogRepository | None = None):
        self.repository = repository or MongoCatalogRepository()

    def detect_emotion(self, image_b64: str | None) -> str:
        if not image_b64:
            return 'neutral'

        try:
            raw = image_b64.split(',', 1)[-1]
            image_bytes = base64.b64decode(raw)
        except Exception:
            return 'neutral'

        try:
            import cv2
            from deepface import DeepFace  # type: ignore

            image_array = np.frombuffer(image_bytes, dtype=np.uint8)
            image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            if image is None:
                return 'neutral'
            result = DeepFace.analyze(image, actions=['emotion'], enforce_detection=False)
            if isinstance(result, list) and result:
                return str(result[0].get('dominant_emotion', 'neutral')).lower()
            if isinstance(result, dict):
                return str(result.get('dominant_emotion', 'neutral')).lower()
        except Exception:
            pass

        try:
            if not image_bytes:
                return 'neutral'
            brightness = sum(image_bytes) / len(image_bytes)
            if brightness > 155:
                return 'happy'
            if brightness < 75:
                return 'calm'
            return 'focus'
        except Exception:
            return 'neutral'

    def build_queue(self, emotion: str, limit: int = 10) -> List[Dict[str, Any]]:
        queue: List[Dict[str, Any]] = []
        seen = set()

        # 1. Fetch tracks matching the detected mood directly
        for track in self.repository.list_tracks({'mood': emotion}, limit=limit):
            if track['track_id'] in seen:
                continue
            queue.append(track)
            seen.add(track['track_id'])
            if len(queue) >= limit:
                return queue

        # 2. Fetch tracks matching the associated genres
        genres = EMOTION_TO_GENRES.get(emotion, EMOTION_TO_GENRES['neutral'])
        for genre in genres:
            for track in self.repository.list_tracks({'genre': genre}, limit=limit):
                if track['track_id'] in seen:
                    continue
                queue.append(track)
                seen.add(track['track_id'])
                if len(queue) >= limit:
                    return queue

        # 3. Fallback to popular tracks
        if len(queue) < limit:
            for track in self.repository.list_tracks(limit=limit):
                if track['track_id'] in seen:
                    continue
                queue.append(track)
                seen.add(track['track_id'])
                if len(queue) >= limit:
                    break

        return queue[:limit]

    def detect_mood_from_text(self, text: str) -> str:
        if not text:
            return 'neutral'
        
        text_lower = text.lower()
        
        # Mapping keywords to our supported moods
        mood_keywords = {
            'happy': ['happy', 'joy', 'excited', 'good', 'glad', 'cheerful', 'bright', 'delighted'],
            'sad': ['sad', 'depressed', 'cry', 'lonely', 'blue', 'heartbroken', 'down', 'sorrow', 'grief'],
            'romantic': ['romantic', 'love', 'date', 'heart', 'sweetheart', 'passionate', 'romance', 'lovely'],
            'angry': ['angry', 'mad', 'furious', 'rage', 'annoyed', 'pissed', 'hate', 'frustrated'],
            'relaxed': ['relax', 'chill', 'easy', 'peace', 'mellow', 'soft', 'rest', 'soothing'],
            'calm': ['calm', 'serene', 'quiet', 'tranquil', 'still', 'peaceful', 'gentle'],
            'focus': ['focus', 'concentrate', 'work', 'code', 'mind', 'think', 'mental'],
            'study': ['study', 'learn', 'read', 'exam', 'homework', 'book', 'course'],
            'workout': ['workout', 'gym', 'run', 'lift', 'exercise', 'cardio', 'fit', 'train', 'active'],
            'party': ['party', 'dance', 'club', 'celebrate', 'drink', 'nightlife', 'groove'],
            'sleep': ['sleep', 'bed', 'dream', 'night', 'tired', 'insomnia', 'slumber'],
            'travel': ['travel', 'trip', 'road', 'drive', 'flight', 'journey', 'car', 'ride'],
            'stress': ['stress', 'anxious', 'pressure', 'worry', 'panic', 'overwhelm', 'tense', 'stressed'],
            'motivation': ['motivation', 'inspire', 'goal', 'drive', 'push', 'win', 'energy', 'strong', 'achieve']
        }
        
        scores = {mood: 0 for mood in mood_keywords}
        for mood, keywords in mood_keywords.items():
            for kw in keywords:
                if kw in text_lower:
                    scores[mood] += 1
                    
        best_mood = max(scores, key=scores.get)
        if scores[best_mood] > 0:
            return best_mood
            
        return 'neutral'

    def detect_and_queue(self, image_b64: str | None, limit: int = 10) -> Dict[str, Any]:
        emotion = self.detect_emotion(image_b64)
        queue = self.build_queue(emotion, limit=limit)
        return {
            'detected_emotion': emotion,
            'queue': queue,
            'message': 'AI generation successful',
        }

    def detect_from_text_and_queue(self, text: str, limit: int = 10) -> Dict[str, Any]:
        emotion = self.detect_mood_from_text(text)
        queue = self.build_queue(emotion, limit=limit)
        return {
            'detected_emotion': emotion,
            'queue': queue,
            'message': 'AI text mood detection successful',
        }


class RecommendationService:
    def __init__(self, repository: MongoCatalogRepository | None = None):
        self.repository = repository or MongoCatalogRepository()

    def recommend(self, user_id: str, history: List[Dict[str, Any]], catalog: List[Dict[str, Any]] | None, limit: int = 10) -> List[Dict[str, Any]]:
        catalog_payload = catalog or self.repository.list_tracks(limit=200)
        if not catalog_payload:
            return []

        history_track_ids = {str(event.get('song_id') or event.get('track_id')) for event in history if event.get('song_id') or event.get('track_id')}
        seen_track_ids = set(history_track_ids)

        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity

            texts = []
            for item in catalog_payload:
                genres = item.get('genres', [])
                genre_text = ' '.join(genres) if isinstance(genres, list) else str(genres)
                texts.append(f"{item.get('title', '')} {item.get('artist', '')} {genre_text} {item.get('mood', '')}")

            vectorizer = TfidfVectorizer(stop_words='english')
            matrix = vectorizer.fit_transform(texts)
            reference_rows = [index for index, item in enumerate(catalog_payload) if str(item.get('track_id') or item.get('song_id')) in seen_track_ids]
            if reference_rows:
                profile = matrix[reference_rows].mean(axis=0)
            else:
                profile = matrix.mean(axis=0)
            scores = cosine_similarity(profile, matrix)[0]
        except Exception:
            scores = [
                float(item.get('popularity', 0.0)) + (0.25 if item.get('mood') in {'happy', 'energy', 'focus'} else 0.0)
                for item in catalog_payload
            ]

        ranked_indices = sorted(range(len(scores)), key=lambda index: scores[index], reverse=True)
        recommendations: List[Dict[str, Any]] = []
        for index in ranked_indices:
            item = catalog_payload[int(index)]
            track_id = str(item.get('track_id') or item.get('song_id') or '')
            if track_id in seen_track_ids:
                continue
            recommendations.append({
                'track_id': track_id,
                'title': str(item.get('title', '')),
                'artist': str(item.get('artist', '')),
                'score': float(scores[int(index)]),
                'genres': item.get('genres', []),
                'mood': item.get('mood', 'neutral'),
            })
            if len(recommendations) >= limit:
                break

        if not recommendations:
            recommendations = [
                {
                    'track_id': str(item.get('track_id') or item.get('song_id') or ''),
                    'title': str(item.get('title', '')),
                    'artist': str(item.get('artist', '')),
                    'score': float(item.get('popularity', 0.0)),
                    'genres': item.get('genres', []),
                    'mood': item.get('mood', 'neutral'),
                }
                for item in catalog_payload[:limit]
            ]

        return recommendations[:limit]
