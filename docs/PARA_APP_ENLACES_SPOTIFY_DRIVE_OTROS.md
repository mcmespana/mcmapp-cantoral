# Para la app (`mcmapp`): soporte de enlaces Spotify / Drive / Otros

> Encargo puntual para pasarle a una sesión de Claude en el repo de la app.
> El contrato completo y actualizado vive en
> [`docs/CAMPOS_CANCIONES.md`](./CAMPOS_CANCIONES.md) (§2 tabla maestra, §3.1,
> §7) de **este** repo (`mcmapp-cantoral`); este documento es el resumen
> accionable de lo que hay que implementar en la app.

## Qué ha cambiado en `songs/data`

Además de `youtubeLinks` y `audioLinks` (ya existentes, sin cambios), cada
canción puede traer ahora **tres campos opcionales nuevos**, con la misma
forma `array de {label, url}` (el `label` puede ser `""`):

```json
{
  "spotifyLinks": [ { "label": "Alborada", "url": "https://open.spotify.com/track/1a2b3c4d5e" } ],
  "driveLinks":   [ { "label": "Partitura", "url": "https://drive.google.com/file/d/1AbCdEfGhIjK/view?usp=drive_link" } ],
  "otherLinks":   [ { "label": "Cancionero (web)", "url": "https://doceacordes.es/partituras/ven-a-celebrar.pdf" } ]
}
```

Como el resto de multimedia, **solo aparecen si tienen contenido** — si una
canción no tiene enlaces de un tipo, la clave no existe (tratadlo como
`[]`).

## Por qué van separados de `audioLinks`

`audioLinks` es "escuchar": la app lo reproduce con el **reproductor
flotante embebido**, sin salir de la pantalla. Spotify, y los enlaces de
"ver documento", no encajan en ese modelo:

| Campo | Cómo debe abrirlo la app | Detalle |
|-------|---------------------------|---------|
| `audioLinks` (ya existe) | Reproductor flotante embebido, dentro de la app. | Incluye enlaces de Drive que son audio — eso **no cambia**. |
| `youtubeLinks` (ya existe) | Embebido (como ya lo hacéis). | Sin cambios. |
| **`spotifyLinks`** (nuevo) | **Sale de la app**: abre la app de Spotify instalada, o Spotify Web si no lo está (`open.spotify.com/...`). El usuario vuelve manualmente al cantoral — no hay reproductor embebido de Spotify. | Botón tipo "Abrir en Spotify" con el icono de Spotify. |
| **`driveLinks`** (nuevo) | **Pantalla completa dentro de la app**, como visor de documento (NO como audio). Es el mismo tipo de enlace de compartir de Drive que ya usáis para `audioLinks` (`drive.google.com/file/d/<id>/view?usp=drive_link`); reutilizad la misma extracción de `<id>` que ya tengáis para el audio embebido de Drive, pero el resultado se **muestra**, no se reproduce como sonido — pensad partitura/PDF/imagen escaneada. | Botón tipo "Ver partitura" que abre un visor a pantalla completa. |
| **`otherLinks`** (nuevo) | **Pantalla completa dentro de la app**, abriendo la URL tal cual (sin transformarla) — típicamente en un WebView/visor. | Cajón de sastre: cualquier otro recurso (partitura en una web externa, etc.) que no es ni Spotify ni Drive. |

Puntos que os ahorrarán bugs:

- **No hay auto-detección de tipo por URL.** Un enlace de Drive puede estar
  en `audioLinks` (se reproduce como sonido) o en `driveLinks` (se muestra
  como documento) — el repo decide cuál es cuál según la directiva que use
  quien edita la canción (`{audio:}` vs `{drive:}`), no según la forma de la
  URL. La app debe fiarse del campo en el que viene el enlace, no intentar
  adivinar por el dominio.
- `spotifyLinks` es el **único** de los cinco que sale de la app. Todos los
  demás (incluidos los dos nuevos `driveLinks`/`otherLinks`) se quedan
  dentro, solo que a pantalla completa en vez de en el reproductor flotante.
- Los tres campos son arrays repetibles: una canción puede tener varios
  enlaces de Spotify (single + álbum, por ejemplo), no solo uno.

## Si la app permite editar/añadir estos enlaces

Igual que ya hacéis con `audioLinksNew`/`youtubeLinksNew` al escribir en
`songs/ediciones/<pushId>`, para proponer cambios en los nuevos campos
mandad `spotifyLinksNew`, `driveLinksNew` y/o `otherLinksNew` (mismo formato
`[{label,url}]`; array vacío = borrar todos los enlaces de ese tipo). El
repo (`sincronizaCambiosDeFirebase.py`) ya sabe aplicarlos a la cabecera del
`.cho` correspondiente — no hace falta nada extra de vuestro lado salvo
mandar el campo con el nombre correcto.

## Ejemplo completo de una canción con los cinco tipos de enlace

```json
{
  "title": "01. Ven a Celebrar",
  "filename": "01.ven_a_celebrar.cho",
  "author": "Alborada",
  "key": "G",
  "capo": 2,
  "info": "",
  "youtubeLinks": [
    { "label": "Versión oficial", "url": "https://www.youtube.com/embed/yffsxTH2DiE" }
  ],
  "audioLinks": [
    { "label": "Pista guía", "url": "https://example.com/guia.mp3" }
  ],
  "spotifyLinks": [
    { "label": "Alborada", "url": "https://open.spotify.com/track/1a2b3c4d5e" }
  ],
  "driveLinks": [
    { "label": "Partitura", "url": "https://drive.google.com/file/d/1AbCdEfGhIjK/view?usp=drive_link" }
  ],
  "otherLinks": [
    { "label": "Cancionero (web)", "url": "https://doceacordes.es/partituras/ven-a-celebrar.pdf" }
  ],
  "content": "..."
}
```

## Referencia

Contrato completo, incluida la convención `label | url` y la sintaxis
ChordPro (`{spotify:}`, `{drive:}`, `{otro:}`) que escribe quien edita la
canción: [`docs/CAMPOS_CANCIONES.md`](./CAMPOS_CANCIONES.md), §2 y §3.1 del
repo `mcmapp-cantoral`.
