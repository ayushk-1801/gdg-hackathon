#!/bin/bash

# Set your DockerHub username
DOCKER_USERNAME="ayushk1801"
IMAGE_NAME="benkyoshi-worker"
TAG="latest"

# Build the Docker image
echo "Building Docker image..."
docker build -t $DOCKER_USERNAME/$IMAGE_NAME:$TAG -f Dockerfile .

# Login to DockerHub (you might be prompted for password)
echo "Logging in to DockerHub..."
docker login

# Push the image to DockerHub
echo "Pushing image to DockerHub..."
docker push $DOCKER_USERNAME/$IMAGE_NAME:$TAG

echo "Deployment complete! Image is available at: $DOCKER_USERNAME/$IMAGE_NAME:$TAG"
