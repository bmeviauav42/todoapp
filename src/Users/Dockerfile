FROM python:2.7.16-slim
WORKDIR /app
EXPOSE 80

# Copy dependencies file and install dependencies first
# Faster build if the dependencies do not change (only the source code), thanks to Docker build caching
COPY ["Users/requirements.txt", "."]
RUN pip install --trusted-host pypi.python.org -r requirements.txt

COPY ["Users/app.py", "."]
CMD ["python", "app.py"]