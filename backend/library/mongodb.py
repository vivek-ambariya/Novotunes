from functools import lru_cache

from django.conf import settings
from pymongo import MongoClient


@lru_cache(maxsize=1)
def get_mongo_client() -> MongoClient:
    uri = getattr(settings, 'MONGO_URI', 'mongodb://127.0.0.1:27017/')
    return MongoClient(uri, serverSelectionTimeoutMS=2000)


@lru_cache(maxsize=1)
def get_mongo_db():
    db_name = getattr(settings, 'MONGO_DB_NAME', 'novatunes')
    configured_db = getattr(settings, 'MONGO_DB', None)
    if configured_db is not None:
        return configured_db
    return get_mongo_client()[db_name]


def get_collection(name: str):
    return get_mongo_db()[name]


def ping() -> bool:
    get_mongo_client().admin.command('ping')
    return True
