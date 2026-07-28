FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port (Django default)
EXPOSE 8000

# Run migrations and start server
CMD bash -c "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"
