from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import base64

# from deepface import DeepFace
# import cv2
# import numpy as np

@api_view(['POST'])
@permission_classes([AllowAny])
def detect_mood_and_queue(request):
    """
    Accepts a base64 encoded webcam image, runs DeepFace emotion detection,
    and returns a tailored track queue from MongoDB.
    """
    image_b64 = request.data.get('image')
    if not image_b64:
        return Response({"error": "No image provided"}, status=400)
    
    # ----------------------------------------------------
    # TODO: Implement OpenCV decoding & DeepFace Analytics
    # ----------------------------------------------------
    # img_data = base64.b64decode(image_b64.split(',')[1])
    # nparr = np.frombuffer(img_data, np.uint8)
    # img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    # result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
    # dominant_emotion = result[0]['dominant_emotion']
    
    # Placeholder Logic
    dominant_emotion = "happy"  # Mocked result

    # ----------------------------------------------------
    # TODO: Fetch tracks from MongoDB mapping to this emotion
    # ----------------------------------------------------
    # from django.conf import settings
    # db = settings.MONGO_DB
    # tracks = list(db.tracks.find({"genre": emotion_to_genre_map(dominant_emotion)}).limit(10))

    mock_queue = [
        {"track_id": "1", "title": "Sunshine Vibes", "emotion": dominant_emotion},
        {"track_id": "2", "title": "Upbeat Energy", "emotion": dominant_emotion},
    ]

    return Response({
        "detected_emotion": dominant_emotion,
        "queue": mock_queue,
        "message": "AI generation successful"
    })
