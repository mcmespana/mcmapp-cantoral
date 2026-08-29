# Desplegar el admin del Cantoral en el UGREEN NASync DXP2800 (gratis)

El NAS se queda cerrado a cal y canto (0 puertos abiertos en el router) y
**Tailscale Funnel** abre un túnel saliente que publica el admin en una
URL fija del tipo `https://cantoral.tuTailnet.ts.net`, con HTTPS válido.
Coste: 0 €. No hace falta dominio propio ni tocar el DNS de
`movimientoconsolacion.com` (el correo se queda exactamente como está).

## Paso 1 — Activar SSH en el NAS

Panel de UGOS Pro → **Control Panel → Terminal & SNMP → Enable SSH
service**. Anota la IP local del NAS.

## Paso 2 — Desplegar la app

Conéctate por SSH (`ssh tu-usuario@ip-del-nas`) y pega entero el contenido
de [`bootstrap-nas.sh`](./bootstrap-nas.sh). Te va guiando: pide la clave
de despliegue para GitHub, los usuarios/contraseña del admin, y levanta el
contenedor escuchando solo en `127.0.0.1:8765` del propio NAS.

Pégalo creando primero un fichero (`cat > ~/bootstrap-nas.sh <<'EOF'` …)
y ejecutándolo con `sh`: el script lleva `set -eu`, y pegado directamente
en el prompt cerraría tu sesión SSH al primer fallo.

## Paso 3 — Publicarlo con URL fija

Antes de nada, en [login.tailscale.com](https://login.tailscale.com):

1. Crea la cuenta (vale el login de Google).
2. **DNS → HTTPS Certificates → Enable.** Sin esto Funnel no arranca.
3. **Settings → Keys → Generate auth key.** Copia el `tskey-auth-…`.

Luego ejecuta [`tailscale-funnel.sh`](./tailscale-funnel.sh) por SSH. Al
terminar te imprime la URL, que ya no cambia nunca.

Si el paso de Funnel imprime una URL de autorización en vez de funcionar,
es que la política del tailnet aún no lo permite: ábrela, acepta, y repite
`sudo docker exec cantoral-tailscale tailscale funnel --bg 8765`.

## Mantenimiento

- **Actualizar el admin**: `sudo docker exec cantoral-admin git -C /app pull`
  y luego `sudo docker restart cantoral-admin`. El reinicio es obligatorio
  cuando cambia código: el `git pull` trae los ficheros pero el proceso ya
  tiene el Python viejo cargado en memoria. El propio admin avisa con un
  cartel cuando detecta que se ha actualizado código.
- **Cambiar usuarios/contraseñas**: edita
  `/volume1/docker/cantoral-admin/cantoral-admin.env` y vuelve a correr
  `sh /volume1/docker/cantoral-admin/run-cantoral.sh`.
- **Logs**: `sudo docker logs -f cantoral-admin` (o `cantoral-tailscale`).
- **Ver el estado del túnel**: en el panel de Tailscale aparece el NAS
  como dispositivo, con su URL y si está conectado.
- Si `/volume1` no es la ruta real de tu almacenamiento (compruébalo con
  `ls /volume1`), cambia `BASE_DIR` al principio de los scripts.

## Sobre el dominio propio

`cantoraladmin.movimientoconsolacion.com` con certificado propio no es
posible gratis: Cloudflare Tunnel exige tener el dominio dado de alta en
su cuenta (y ese dominio lleva vuestro correo), y un CNAME a
`…cfargotunnel.com` desde un DNS externo no funciona — ese destino solo
enruta para registros de la misma cuenta de Cloudflare.

Las dos salidas, si algún día se quiere el nombre bonito:

- **Gratis**: en Hostinger, una **redirección HTTP** (no un CNAME) de
  `cantoraladmin.movimientoconsolacion.com` a la URL de Tailscale. Como
  esa URL es fija, el redirect se pone una vez y ya.
- **~10 €/año**: registrar un dominio nuevo dedicado, ese sí meterlo en
  Cloudflare, y montar un túnel con nombre. `movimientoconsolacion.com`
  no se toca.

## Alternativas descartadas

Vivieron aquí y están en el historial de git por si alguna vez hacen falta:

- **Cloudflare Quick Tunnel** (`cloudflared tunnel --url`): fue el primer
  montaje. Funciona y es instantáneo, pero es anónimo (no se asocia a
  ninguna cuenta, no se ve en ningún panel) y su URL puede cambiar si el
  contenedor se recrea. Sustituido por Tailscale.
- **VM gratuita de Google Cloud** (`deploy/gcp/`): alternativa si algún
  día no se quiere depender de la luz e internet de casa. Se descartó por
  ser más complicada de mantener que el NAS que ya está encendido.
