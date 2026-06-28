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

Para conservar el histórico en el repo, haz commit del archivo:

```bash
git add peticiones/peticiones.json
git commit -m "chore: actualizar peticiones de la gente"
git push
```

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
