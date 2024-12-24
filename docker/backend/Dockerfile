# Use an official Python image as the base
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirement file
COPY ../../../backend/gym/gym_system/requirements.txt /app

# Install dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy application files
COPY ../../../backend/gym/gym_system /app

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose application port
EXPOSE 8000

# Copy the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "gym_system.wsgi:application"]
