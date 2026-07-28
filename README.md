# NovaTunes

Hybrid music streaming application scaffold with:

- `frontend/` React + Tailwind UI shell
- `node-backend/` Express API gateway
- `django-ml-service/` Django recommendation service

## Layout

```text
NovaTunes/
  frontend/
  node-backend/
  django-ml-service/
```

## Next Steps

1. Run `./start-all.ps1 -InstallDependencies` from the repo root on Windows.
2. Or start each service manually: Django on `8000`, Express on `5000`, and Vite on `5173`.
3. Open the frontend at `http://127.0.0.1:5173` to confirm the live API bridge.
