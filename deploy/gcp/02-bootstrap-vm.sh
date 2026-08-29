#!/usr/bin/env bash
# Ejecuta esto DENTRO de la VM, tras conectarte con:
#   gcloud compute ssh cantoral-admin --zone=us-central1-a
# Pega el script entero y ve respondiendo a lo que te pregunte.
set -euo pipefail

REPO_URL="git@github.com:mcmespana/mcmapp-cantoral.git"
REPO_DIR="$HOME/mcmapp-cantoral"
KEY_PATH="$HOME/.ssh/cantoral_deploy_key"

echo "== 1/6: Instalando Docker y git =="
sudo apt-get update -y
sudo apt-get install -y docker.io git
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"

echo "== 2/6: Generando clave de despliegue (deploy key) =="
if [ ! -f "$KEY_PATH" ]; then
  ssh-keygen -t ed25519 -f "$KEY_PATH" -N "" -C "cantoral-admin-vm"
fi
mkdir -p "$HOME/.ssh"
grep -q github.com "$HOME/.ssh/known_hosts" 2>/dev/null || \
  ssh-keyscan -t ed25519 github.com >> "$HOME/.ssh/known_hosts"
cat > "$HOME/.ssh/config" <<EOF
Host github.com
  IdentityFile $KEY_PATH
  IdentitiesOnly yes
EOF

echo ""
echo ">>> Copia esta clave pública y añádela en:"
echo ">>> https://github.com/mcmespana/mcmapp-cantoral/settings/keys -> 'Add deploy key'"
echo ">>> Marca la casilla 'Allow write access' (para que pueda hacer git push)."
echo ""
cat "${KEY_PATH}.pub"
echo ""
read -rp "Pulsa Enter cuando la hayas añadido en GitHub... " _

echo "== 3/6: Clonando el repositorio =="
if [ ! -d "$REPO_DIR/.git" ]; then
  git clone "$REPO_URL" "$REPO_DIR"
fi
cd "$REPO_DIR"
git config user.email "cantoral-admin-bot@movimientoconsolacion.com"
git config user.name "Cantoral Admin (VM)"

echo "== 4/6: Configurando usuarios y credenciales =="
ENV_FILE="$HOME/cantoral-admin.env"
if [ ! -f "$ENV_FILE" ]; then
  read -rp "Usuarios del admin, formato user1:pass1,user2:pass2 : " ADMIN_USERS
  read -rp "FIREBASE_URL (deja vacío si no aplica): " FIREBASE_URL
  read -rsp "FIREBASE_TOKEN (deja vacío si no aplica): " FIREBASE_TOKEN
  echo ""
  cat > "$ENV_FILE" <<EOF
CANTORAL_ADMIN_USERS=$ADMIN_USERS
FIREBASE_URL=$FIREBASE_URL
FIREBASE_TOKEN=$FIREBASE_TOKEN
EOF
  chmod 600 "$ENV_FILE"
else
  echo "Ya existe $ENV_FILE, lo reutilizo (edítalo a mano para cambiar usuarios)."
fi

cat > "$HOME/run-cantoral.sh" <<EOF
#!/usr/bin/env bash
set -euo pipefail
sudo docker build -t cantoral-admin "$REPO_DIR"
sudo docker rm -f cantoral-admin 2>/dev/null || true
sudo docker run -d --name cantoral-admin --restart=always \\
  -v "$REPO_DIR":/app \\
  -v "$HOME/.ssh":/root/.ssh:ro \\
  --env-file "$ENV_FILE" \\
  -p 127.0.0.1:8765:8765 \\
  cantoral-admin
EOF
chmod +x "$HOME/run-cantoral.sh"

echo "== 5/6: Construyendo y arrancando el contenedor de la app =="
"$HOME/run-cantoral.sh"

echo "== 6/6: Poniendo Caddy delante (HTTPS automático si das un dominio) =="
EXTERNAL_IP=$(curl -s -H "Metadata-Flavor: Google" \
  "http://169.254.169.254/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip")
echo "IP pública de esta VM: $EXTERNAL_IP"
read -rp "¿Dominio/subdominio ya apuntando por DNS a esta IP? (vacío = usar solo HTTP con la IP): " DOMAIN

mkdir -p "$HOME/caddy"
if [ -n "$DOMAIN" ]; then
  cat > "$HOME/caddy/Caddyfile" <<EOF
$DOMAIN {
  reverse_proxy 127.0.0.1:8765
}
EOF
else
  cat > "$HOME/caddy/Caddyfile" <<EOF
:80 {
  reverse_proxy 127.0.0.1:8765
}
EOF
fi

sudo docker rm -f cantoral-caddy 2>/dev/null || true
sudo docker run -d --name cantoral-caddy --restart=always --network host \
  -v "$HOME/caddy/Caddyfile":/etc/caddy/Caddyfile \
  -v caddy_data:/data -v caddy_config:/config \
  caddy:2

echo ""
if [ -n "$DOMAIN" ]; then
  echo "Listo. Dale un par de minutos al certificado y entra en: https://$DOMAIN"
else
  echo "Listo. Entra en: http://$EXTERNAL_IP"
  echo "(Sin dominio no hay HTTPS: usuario/contraseña viajan sin cifrar. En cuanto"
  echo " tengas un subdominio apuntando aquí, vuelve a correr este bloque de Caddy.)"
fi
