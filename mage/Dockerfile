# Stage 1: Build the application
FROM python:3.12-slim AS builder

# Set working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies

RUN apt-get update && \
DEBIAN_FRONTEND=noninteractive apt-get install -y \
cmake \
protobuf-compiler \
libprotobuf-dev \
poppler-utils \
libgl1 \
libgl1-mesa-glx \
libglib2.0-0 \
libgtk2.0-dev \
libsm6 \
libxrender1 \
libxext6 \
tesseract-ocr \
tesseract-ocr-eng \
python3-nltk \
libreoffice

RUN pip install --upgrade -r requirements.txt
RUN python -m nltk.downloader punkt
RUN pip install langchain-mongodb
# RUN apt-get install -y pandoc
# RUN pip install pypandoc
# # Stage 2: Create the production imasge
# FROM python:3.12-slim

# # Set working directory
# WORKDIR /app

# # Copy only necessary files from the builder stage
# COPY --from=builder /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/

# Copy the entire current directory (.) to /app in the container
COPY . /app
# Expose port
EXPOSE 8054

# Command to run the FastAPI application
CMD ["fastapi", "run", "app/main.py","--host", "0.0.0.0", "--port", "8054"]
# CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8080"]

