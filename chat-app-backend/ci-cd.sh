#!/bin/bash

# Run linter
echo "Running linter..."
flake8 .

# Run tests (replace with your actual test command)
echo "Running tests..."
pytest

# Start the docker
sudo systemctl start docker

# Build the Docker image
echo "Building Docker image..."
docker build -t chat-app .

# Run the container (locally)
echo "Running Docker container..."
docker run -p 8000:8000 chat-app
