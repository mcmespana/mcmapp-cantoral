# Desplegar el admin del Cantoral en Google Cloud (gratis)

Usa la VM `e2-micro` del *Always Free tier* de Google Cloud: gratis para
siempre mientras se quede dentro de los límites (1 VM e2-micro, 30 GB de
disco, 1 GB/mes de salida de datos) en `us-west1`, `us-central1` o
`us-east1`. A diferencia de Render, la VM no se duerme: no hace falta
ningún ping para mantenerla despierta.

## Antes de nada

1. Crea una cuenta de Google Cloud en https://console.cloud.google.com
   (pide tarjeta para verificar identidad; no cobra si te quedas dentro
   del tier gratis).
2. Crea un proyecto nuevo desde la consola.

## Pasos

1. Abre **Cloud Shell** (icono `>_` arriba a la derecha en la consola de
   Google Cloud). Ya viene con `gcloud` instalado y con tu sesión
   iniciada, no hace falta instalar nada en tu ordenador.
2. Copia el contenido de [`01-create-vm.sh`](./01-create-vm.sh), cambia
   `PROJECT_ID` por el ID real de tu proyecto, pégalo en Cloud Shell y
   dale a Enter. Crea la IP fija, el firewall y la VM.
3. Conéctate a la VM: `gcloud compute ssh cantoral-admin --zone=us-central1-a`
4. Copia y pega el contenido de [`02-bootstrap-vm.sh`](./02-bootstrap-vm.sh)
   dentro de esa sesión SSH. Te va guiando: te pide que añadas una clave
   de despliegue en GitHub, los usuarios/contraseña del admin, y
   opcionalmente un dominio para HTTPS automático (vía Caddy).

## Después

- Para actualizar el código tras un cambio: entra por SSH y ejecuta
  `cd ~/mcmapp-cantoral && git pull && sudo docker restart cantoral-admin`.
- Para ver logs: `sudo docker logs -f cantoral-admin`.
- Límite real a vigilar: 1 GB/mes de salida de datos gratis. Un admin
  usado por unas pocas personas no debería acercarse, pero si un día
  Google te cobra algo, será por superar ese tope (céntimos por GB).
