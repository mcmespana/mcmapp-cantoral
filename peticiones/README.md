# Peticiones de la gente

Aquí se guarda lo que la gente envía desde la app móvil y que el **MCM Panel**
también muestra:

- **Solicitudes de canciones** (`songs/solicitudes` en Firebase): peticiones de
  canciones nuevas que la gente quiere en el cantoral.
- **Reportes de fallitos** (`songs/fallitos` en Firebase): avisos de errores en
  las canciones (acordes mal, letras, etc.).

## Cómo se actualiza

Desde el **Cantoral Admin** (el script `C. Admin Cantoral`), en el **Dashboard**
hay un botón destacado **🙋 Consultar peticiones de la gente**, y también una
pestaña **🙋 Peticiones** en el menú lateral.

Al pulsar **Consultar y guardar**:

1. El servidor lee `songs/solicitudes` y `songs/fallitos` de la Realtime
   Database de Firebase (usa `FIREBASE_URL` y `FIREBASE_TOKEN` del `.env` de la
   raíz del repo, igual que los scripts de sincronización).
2. Funde lo descargado con lo que ya había en `peticiones.json` (acumula
   histórico: las peticiones que desaparecen de Firebase porque ya se
   resolvieron se conservan marcadas con `_inFirebase: false`).
3. Guarda el resultado en `peticiones.json`.

Para conservar el histórico en el repo puedes pulsar **📦 Guardar en el repo
(commit)**, que hace `git add/commit/push` solo de esta carpeta, o hacerlo a mano:

```bash
git add peticiones/peticiones.json
git commit -m "chore: actualizar peticiones de la gente"
git push
```

## ¿Hacen falta variables de Firebase?

No hace falta configurar nada nuevo:

- **`FIREBASE_URL`** (obligatoria): la URL de la Realtime Database. Es la misma
  que ya usan los scripts de sincronización del repo, así que normalmente ya está
  en tu `.env`. No es secreta (va dentro de la app móvil).
- **`FIREBASE_TOKEN`** (opcional): el nodo `songs` es de lectura pública (la app
  lo lee sin login), así que para *consultar* peticiones basta con la URL. Solo
  haría falta un token si las reglas de la base de datos bloquearan la lectura.

## Formato de `peticiones.json`

```json
{
  "updatedAt": "2026-06-28T12:00:00+02:00",
  "solicitudes": {
    "<id-firebase>": {
      "title": "…", "author": "…", "category": "…", "content": "…",
      "userName": "…", "userLocation": "…", "platform": "web",
      "requestedAt": "…", "status": "pendiente",
      "_id": "<id-firebase>", "_firstSeen": "…", "_lastFetched": "…",
      "_inFirebase": true
    }
  },
  "fallitos": {
    "<categoria>/<cancion>/<id>": {
      "songTitle": "…", "songFilename": "…", "description": "…",
      "categoryKey": "catFofertorio", "categoryName": "Fofertorio",
      "userName": "…", "userLocation": "…", "platform": "web",
      "reportedAt": "…", "status": "pending",
      "_id": "…", "_firstSeen": "…", "_lastFetched": "…", "_inFirebase": true
    }
  }
}
```

Los campos con guion bajo (`_id`, `_firstSeen`, `_lastFetched`, `_inFirebase`)
los añade el admin para llevar el histórico; el resto vienen tal cual de la app.
