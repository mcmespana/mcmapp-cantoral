FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    openssh-client \
    tesseract-ocr \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY scripts/requirements.txt scripts/requirements.txt
COPY scripts/admin/requirements.txt scripts/admin/requirements.txt
RUN pip install --no-cache-dir \
    -r scripts/requirements.txt \
    -r scripts/admin/requirements.txt \
    gunicorn

COPY . .

ENV CANTORAL_ADMIN_HOST=0.0.0.0
ENV CANTORAL_ADMIN_PORT=8765
EXPOSE 8765

CMD ["gunicorn", "--chdir", "scripts/admin", "--bind", "0.0.0.0:8765", \
     "--workers", "2", "--timeout", "120", "server:app"]
