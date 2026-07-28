import json
import os

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .engine import RecommendationPipeline

pipeline = RecommendationPipeline()
expected_token = os.getenv('DJANGO_ML_SERVICE_TOKEN', 'novatunes-local-token')


@require_http_methods(['GET'])
def health_check(_request):
    return JsonResponse({'status': 'ok', 'service': 'django-ml-service'})


@csrf_exempt
@require_http_methods(['POST'])
def recommend(request):
    try:
        auth_header = request.headers.get('Authorization', '')
        if auth_header != f'Bearer {expected_token}':
            return JsonResponse({'error': 'unauthorized'}, status=401)

        payload = json.loads(request.body.decode('utf-8'))
        user_id = payload.get('user_id', '')
        history = payload.get('history', [])
        catalog = payload.get('catalog', [])
        limit = int(payload.get('limit', 10))

        recommendations = pipeline.recommend_for_user(
            user_id=user_id,
            history_payload=history,
            catalog_payload=catalog,
            limit=limit,
        )
        return JsonResponse({'user_id': user_id, 'recommendations': recommendations})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'invalid_json'}, status=400)
    except ValueError as exc:
        return JsonResponse({'error': 'bad_request', 'detail': str(exc)}, status=400)
    except Exception as exc:
        return JsonResponse({'error': 'server_error', 'detail': str(exc)}, status=500)
