#!/bin/sh
# Ejecutar por SSH en el UGREEN NASync (Control Panel > Terminal & SNMP >
# Enable SSH service, si no lo tienes ya activado). Pega el script entero.
set -eu

REPO_URL="git@github.com:mcmespana/mcmapp-cantoral.git"
BASE_DIR="/volume1/docker/cantoral-admin"
REPO_DIR="$BASE_DIR/repo"
SSH_DIR="$BASE_DIR/ssh"
ENV_FILE="$BASE_DIR/cantoral-admin.env"
KEY_NAME="cantoral_deploy_key"

mkdir -p "$REPO_DIR" "$SSH_DIR"

echo "== 1/4: Generando clave de despliegue (deploy key) =="
if [ ! -f "$SSH_DIR/$KEY_NAME" ]; then
  sudo docker run --rm --entrypoint ssh-keygen -v "$SSH_DIR":/root/.ssh \
    alpine/git -t ed25519 -f "/root/.ssh/$KEY_NAME" -N ""
fi
sudo docker run --rm --entrypoint sh -v "$SSH_DIR":/root/.ssh alpine/git -c \
  "grep -q github.com /root/.ssh/known_hosts 2>/dev/null || ssh-keyscan -t ed25519 github.com >> /root/.ssh/known_hosts"
printf 'Host github.com\n  IdentityFile /root/.ssh/%s\n  IdentitiesOnly yes\n' "$KEY_NAME" | \
  sudo docker run --rm -i --entrypoint sh -v "$SSH_DIR":/root/.ssh alpine/git -c 'cat > /root/.ssh/config'
sudo docker run --rm --entrypoint sh -v "$SSH_DIR":/root/.ssh alpine/git -c \
  "chmod 600 /root/.ssh/$KEY_NAME && chmod 644 /root/.ssh/config /root/.ssh/known_hosts /root/.ssh/$KEY_NAME.pub"

echo ""
echo ">>> Copia esta clave publica y anadela en:"
echo ">>> https://github.com/mcmespana/mcmapp-cantoral/settings/keys -> 'Add deploy key'"
echo ">>> Marca 'Allow write access' (para que pueda hacer git push)."
echo ""
cat "$SSH_DIR/$KEY_NAME.pub"
echo ""
printf "Pulsa Enter cuando la hayas anadido en GitHub... "
read _dummy

echo "== 2/4: Clonando el repositorio =="
if [ ! -d "$REPO_DIR/.git" ]; then
  sudo docker run --rm -v "$REPO_DIR":/repo -v "$SSH_DIR":/root/.ssh \
    alpine/git clone "$REPO_URL" /repo
fi

echo "== 3/4: Usuarios y credenciales =="
if [ ! -f "$ENV_FILE" ]; then
  printf "Usuarios del admin, formato user1:pass1,user2:pass2 : "
  read ADMIN_USERS
  printf "FIREBASE_URL (vacio si no aplica): "
  read FIREBASE_URL
  printf "FIREBASE_TOKEN (vacio si no aplica): "
  read FIREBASE_TOKEN
  cat > "$ENV_FILE" <<EOF
CANTORAL_ADMIN_USERS=$ADMIN_USERS
FIREBASE_URL=$FIREBASE_URL
FIREBASE_TOKEN=$FIREBASE_TOKEN
EOF
  chmod 600 "$ENV_FILE"
else
  echo "Ya existe $ENV_FILE, lo reutilizo (editalo a mano para cambiar usuarios)."
fi

cat > "$BASE_DIR/run-cantoral.sh" <<EOF
#!/bin/sh
set -eu
sudo docker build -t cantoral-admin "$REPO_DIR"
sudo docker rm -f cantoral-admin 2>/dev/null || true
sudo docker run -d --name cantoral-admin --restart=always \\
  -v "$REPO_DIR":/app \\
  -v "$SSH_DIR":/root/.ssh \\
  --env-file "$ENV_FILE" \\
  -p 127.0.0.1:8765:8765 \\
  cantoral-admin
EOF
chmod +x "$BASE_DIR/run-cantoral.sh"

echo "== 4/4: Construyendo y arrancando el contenedor de la app =="
sh "$BASE_DIR/run-cantoral.sh"

echo "== Tunel de Cloudflare (Quick Tunnel, sin cuenta ni tocar tu dominio) =="
sudo docker rm -f cantoral-tunnel 2>/dev/null || true
sudo docker run -d --name cantoral-tunnel --restart=always --network host \
  cloudflare/cloudflared:latest tunnel --url http://localhost:8765

echo ""
echo "Listo. La app escucha SOLO en 127.0.0.1:8765 del propio NAS (no expuesta"
echo "a tu red ni a internet). Espera ~10 segundos y mira la URL publica con:"
echo "  sudo docker logs cantoral-tunnel 2>&1 | grep trycloudflare.com"
echo "Esa URL (tipo https://palabras-random.trycloudflare.com) es la que usas"
echo "desde fuera. Cambia solo si reinicias el contenedor cantoral-tunnel."
