from dataclasses import dataclass
import json
import os
from typing import Any, Dict, List

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


@dataclass
class Song:
    song_id: str
    title: str
    artist: str
    genres: List[str]
    popularity: float = 0.0

    @classmethod
    def from_dict(cls, payload: Dict[str, Any]) -> 'Song':
        return cls(
            song_id=str(payload.get('song_id', '')),
            title=str(payload.get('title', '')),
            artist=str(payload.get('artist', '')),
            genres=list(payload.get('genres', [])),
            popularity=float(payload.get('popularity', 0.0)),
        )


class UserHistory:
    def __init__(self, user_id: str, events: List[Dict[str, Any]] | None = None):
        self.user_id = str(user_id)
        self.events = events or []

    def add_event(self, song_id: str, action: str, weight: float = 1.0) -> None:
        self.events.append({
            'song_id': str(song_id),
            'action': str(action),
            'weight': float(weight),
        })

    def recent_song_ids(self, limit: int = 50) -> List[str]:
        return [event['song_id'] for event in self.events[-limit:]]

    def action_weights(self) -> Dict[str, float]:
        weights: Dict[str, float] = {}
        for event in self.events:
            song_id = event['song_id']
            weights[song_id] = weights.get(song_id, 0.0) + float(event.get('weight', 1.0))
        return weights


class RecommendationPipeline:
    def __init__(self, metadata_path: str = 'recommender/data/model_metadata.json'):
        self.metadata_path = metadata_path
        self.song_lookup: Dict[str, Song] = {}
        self.song_matrix = None
        self.catalog_frame = pd.DataFrame()

    def load_catalog(self, catalog_payload: List[Dict[str, Any]]) -> pd.DataFrame:
        try:
            frame = pd.DataFrame(catalog_payload)
            if frame.empty:
                raise ValueError('catalog is empty')

            required_columns = ['song_id', 'title', 'artist', 'genres']
            missing = [column for column in required_columns if column not in frame.columns]
            if missing:
                raise ValueError(f'missing columns: {missing}')

            frame['genres'] = frame['genres'].apply(lambda value: value if isinstance(value, list) else [])
            frame['genre_text'] = frame['genres'].apply(lambda genres: ' '.join(genres))
            frame['popularity'] = pd.to_numeric(frame.get('popularity', 0), errors='coerce').fillna(0.0)

            self.catalog_frame = frame
            self.song_lookup = {
                str(row.song_id): Song(
                    song_id=str(row.song_id),
                    title=str(row.title),
                    artist=str(row.artist),
                    genres=list(row.genres),
                    popularity=float(row.popularity),
                )
                for row in frame.itertuples(index=False)
            }
            return frame
        except Exception as exc:
            self._fallback_log(f'catalog_load_error: {exc}')
            raise

    def build_feature_matrix(self) -> np.ndarray:
        try:
            if self.catalog_frame.empty:
                raise ValueError('catalog not loaded')

            genre_tokens = self.catalog_frame['genre_text'].tolist()
            unique_tokens = sorted(set(' '.join(genre_tokens).split()))
            token_index = {token: idx for idx, token in enumerate(unique_tokens)}
            matrix = np.zeros((len(genre_tokens), len(unique_tokens)), dtype=float)

            for row_index, tokens in enumerate(genre_tokens):
                for token in tokens.split():
                    if token in token_index:
                        matrix[row_index, token_index[token]] += 1.0

            popularity = self.catalog_frame['popularity'].to_numpy(dtype=float).reshape(-1, 1)
            popularity = popularity / (popularity.max() + 1e-9)
            self.song_matrix = np.hstack([matrix, popularity])
            return self.song_matrix
        except Exception as exc:
            self._fallback_log(f'feature_matrix_error: {exc}')
            raise

    def build_user_profile(self, history: UserHistory) -> np.ndarray:
        try:
            if self.song_matrix is None:
                raise ValueError('feature matrix not built')

            weights = history.action_weights()
            song_ids = history.recent_song_ids()

            matched_rows = [
                self.catalog_frame.index[self.catalog_frame['song_id'].astype(str) == song_id][0]
                for song_id in song_ids
                if song_id in self.song_lookup
                and not self.catalog_frame.index[self.catalog_frame['song_id'].astype(str) == song_id].empty
            ]

            if not matched_rows:
                return np.mean(self.song_matrix, axis=0)

            weighted_vectors = []
            for row_index in matched_rows:
                song_id = str(self.catalog_frame.iloc[row_index]['song_id'])
                weight = weights.get(song_id, 1.0)
                weighted_vectors.append(self.song_matrix[row_index] * weight)

            return np.mean(np.array(weighted_vectors), axis=0)
        except Exception as exc:
            self._fallback_log(f'user_profile_error: {exc}')
            return np.mean(self.song_matrix, axis=0) if self.song_matrix is not None else np.array([])

    def recommend_for_user(
        self,
        user_id: str,
        history_payload: List[Dict[str, Any]],
        catalog_payload: List[Dict[str, Any]],
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        try:
            history = UserHistory(user_id=user_id, events=history_payload)
            self.load_catalog(catalog_payload)
            feature_matrix = self.build_feature_matrix()
            user_profile = self.build_user_profile(history)

            if feature_matrix.size == 0 or user_profile.size == 0:
                return []

            similarities = cosine_similarity([user_profile], feature_matrix)[0]
            seen_ids = set(history.recent_song_ids())
            ranked_indices = np.argsort(similarities)[::-1]

            recommendations = [
                {
                    'song_id': str(self.catalog_frame.iloc[idx]['song_id']),
                    'title': str(self.catalog_frame.iloc[idx]['title']),
                    'artist': str(self.catalog_frame.iloc[idx]['artist']),
                    'score': float(similarities[idx]),
                }
                for idx in ranked_indices
                if str(self.catalog_frame.iloc[idx]['song_id']) not in seen_ids
            ][:limit]

            self._persist_metadata({
                'user_id': user_id,
                'limit': limit,
                'catalog_size': int(len(self.catalog_frame)),
                'recommendation_count': int(len(recommendations)),
            })
            return recommendations
        except Exception as exc:
            self._fallback_log(f'recommendation_error: {exc}')
            return []

    def _persist_metadata(self, payload: Dict[str, Any]) -> None:
        try:
            os.makedirs(os.path.dirname(self.metadata_path), exist_ok=True)
            with open(self.metadata_path, 'w', encoding='utf-8') as handle:
                json.dump(payload, handle, indent=2)
        except Exception as exc:
            self._fallback_log(f'metadata_write_error: {exc}')

    def _fallback_log(self, message: str) -> None:
        log_path = 'recommender/data/user_history/fallback.log'
        try:
            os.makedirs(os.path.dirname(log_path), exist_ok=True)
            with open(log_path, 'a', encoding='utf-8') as handle:
                handle.write(message + '\n')
        except Exception:
            pass
