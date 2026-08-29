#!/bin/sh
# Cambia el tunel anonimo de Cloudflare por Tailscale Funnel: misma idea
# (tunel saliente, 0 puertos abiertos en el router) pero con URL fija y
# panel de control en login.tailscale.com.
#
# ANTES de ejecutar esto, en https://login.tailscale.com:
#   1. Crea la cuenta (vale el login de Google).
#   2. DNS -> HTTPS Certificates -> Enable. Sin esto Funnel no arranca.
#   3. Settings -> Keys -> Generate auth key. Copia el tskey-auth-...
#
# Ejecutar por SSH en el NAS. Pega el script entero.
set -eu

BASE_DIR="/volume1/docker/cantoral-admin"
STATE_DIR="$BASE_DIR/tailscale"
APP_PORT=8765
TS_NAME="cantoral"

printf "Pega aqui tu auth key de Tailscale (tskey-auth-...): "
read TS_AUTHKEY
[ -n "$TS_AUTHKEY" ] || { echo "Sin auth key no puedo seguir."; exit 1; }

sudo mkdir -p "$STATE_DIR"

echo "== 1/3: Levantando Tailscale =="
sudo docker rm -f cantoral-tailscale 2>/dev/null || true
sudo docker run -d --name cantoral-tailscale --restart=always \
  --network host \
  --cap-add=NET_ADMIN --cap-add=NET_RAW \
  --device=/dev/net/tun \
  -v "$STATE_DIR":/var/lib/tailscale \
  -e TS_STATE_DIR=/var/lib/tailscale \
  -e TS_USERSPACE=false \
  -e TS_HOSTNAME="$TS_NAME" \
  -e TS_AUTHKEY="$TS_AUTHKEY" \
  tailscale/tailscale:latest

echo "   esperando a que conecte..."
i=0
while [ $i -lt 30 ]; do
  if sudo docker exec cantoral-tailscale tailscale status >/dev/null 2>&1; then
    break
  fi
  i=$((i + 1))
  sleep 2
done

echo "== 2/3: Publicando el admin en internet (Funnel) =="
# Si Funnel no esta permitido todavia en la politica del tailnet, este comando
# imprime una URL para autorizarlo: abrela, acepta, y vuelve a lanzarlo.
sudo docker exec cantoral-tailscale tailscale funnel --bg "$APP_PORT"

echo "== 3/3: Tu URL fija =="
sudo docker exec cantoral-tailscale tailscale funnel status

echo ""
echo "Si arriba ves una URL https://$TS_NAME.....ts.net, ya esta: esa no cambia nunca."
echo "Compruebala en el navegador (te pedira usuario y contrasena del admin)."
echo ""
echo "Cuando confirmes que va, puedes retirar el tunel viejo de Cloudflare:"
echo "  sudo docker rm -f cantoral-tunnel"
