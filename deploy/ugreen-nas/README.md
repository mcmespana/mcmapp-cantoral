# Desplegar el admin del Cantoral en el UGREEN NASync DXP2800 (gratis)

Nada de VPS ni de tocar el dominio: el NAS se queda cerrado a cal y canto
(0 puertos abiertos en tu router) y **Cloudflare Quick Tunnel** abre un
túnel saliente hacia Cloudflare, que da la cara en internet con una URL
del tipo `https://palabras-random.trycloudflare.com`. Coste: 0 €. No hace
falta cuenta de Cloudflare ni tocar el DNS de `movimientoconsolacion.com`
(ese dominio se queda exactamente como está, con su correo intacto).

La única pega: esa URL cambia si el contenedor del túnel se reinicia (por
ejemplo, un reinicio del NAS). Si quieres una URL fija con vuestro propio
dominio más adelante, ver la nota al final — pero eso sí requiere mover el
dominio a Cloudflare, y ya dijiste que ni de coña, así que de momento nos
quedamos con la URL random y, si quieres, le pones tú un redirect desde
donde te sea más cómodo.

## Paso 1 — Activar SSH en el NAS

Panel de UGOS Pro → **Control Panel → Terminal & SNMP → Enable SSH
service**. Anota la IP local del NAS.

## Paso 2 — Desplegar

Conéctate por SSH (`ssh tu-usuario@ip-del-nas`) y pega entero el contenido
de [`bootstrap-nas.sh`](./bootstrap-nas.sh). Te va guiando: pide la clave
de despliegue para GitHub, los usuarios/contraseña del admin, levanta el
contenedor de la app (solo accesible en `127.0.0.1:8765` del propio NAS) y
al final levanta el túnel de Cloudflare.

## Paso 3 — Coger la URL pública

Al terminar el script, o en cualquier momento después:

```
docker logs cantoral-tunnel 2>&1 | grep trycloudflare.com
```

Esa es la URL a la que entráis desde fuera. Te pedirá usuario/contraseña
(los que definiste en el script).

## Mantenimiento

- Actualizar código: `cd /volume1/docker/cantoral-admin/repo && git pull`,
  luego `sh /volume1/docker/cantoral-admin/run-cantoral.sh`.
- Cambiar usuarios/contraseñas: edita
  `/volume1/docker/cantoral-admin/cantoral-admin.env` y vuelve a correr
  `run-cantoral.sh`.
- Logs de la app: `docker logs -f cantoral-admin`.
- Si la URL pública cambió (reinicio del NAS o del contenedor), vuelve a
  mirarla con el comando del paso 3.
- Si `/volume1` no es la ruta real de tu almacenamiento (compruébalo con
  `ls /volume1` al entrar por SSH), cambia `BASE_DIR` al principio de
  `bootstrap-nas.sh` antes de pegarlo.

## Nota: URL fija con vuestro dominio (opcional, para más adelante)

Si algún día quieres `cantoral.movimientoconsolacion.com` en vez de la URL
random, la única forma gratis en Cloudflare exige mover TODO el dominio
(nameservers) a Cloudflare — con el riesgo de correo que ya comentamos. La
alternativa sin ese riesgo es registrar un dominio nuevo y barato dedicado
solo a esto (unos 10 €/año, sin tocar `movimientoconsolacion.com` para
nada) y mover ese a Cloudflare. Si te interesa en algún momento, dímelo y
lo montamos aparte.
