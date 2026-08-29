#!/usr/bin/env bash
# Pega este script entero en Google Cloud Shell (shell.cloud.google.com) y
# dale a Enter. Crea la IP fija, el firewall y la VM gratuita (e2-micro).
#
# Antes de pegarlo, cambia PROJECT_ID por el ID de tu proyecto de GCP
# (lo ves en la parte de arriba de la consola, o con `gcloud projects list`).
set -euo pipefail

PROJECT_ID="tu-project-id-aqui"
ZONE="us-central1-a"           # us-west1-*, us-central1-* o us-east1-* -> gratis
INSTANCE_NAME="cantoral-admin"

gcloud config set project "$PROJECT_ID"

gcloud services enable compute.googleapis.com

# IP fija: gratis mientras esté pegada a una VM encendida.
gcloud compute addresses create "${INSTANCE_NAME}-ip" --region="${ZONE%-*}" || true

STATIC_IP=$(gcloud compute addresses describe "${INSTANCE_NAME}-ip" \
  --region="${ZONE%-*}" --format="value(address)")

# Abre 80/443 (web) y 22 (ssh) al mundo. El puerto de la app (8765) NO se
# abre: solo se accede a través de Caddy/Nginx en 80/443.
gcloud compute firewall-rules create cantoral-admin-web \
  --allow=tcp:80,tcp:443 --direction=INGRESS --target-tags=cantoral-admin \
  --quiet || true

gcloud compute instances create "$INSTANCE_NAME" \
  --zone="$ZONE" \
  --machine-type=e2-micro \
  --image-family=debian-12 \
  --image-project=debian-cloud \
  --boot-disk-size=30GB \
  --boot-disk-type=pd-standard \
  --address="$STATIC_IP" \
  --tags=cantoral-admin

echo ""
echo "VM creada. IP fija: $STATIC_IP"
echo "Ahora conéctate con:"
echo "  gcloud compute ssh $INSTANCE_NAME --zone=$ZONE"
echo "y ejecuta ahí dentro el script 02-bootstrap-vm.sh"
