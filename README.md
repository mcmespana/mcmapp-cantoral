# mcmapp-cantoral
[![Canciones subidas a la app](https://github.com/mcmespana/mcmapp-cantoral/actions/workflows/generate_and_upload.yml/badge.svg)](https://github.com/mcmespana/mcmapp-cantoral/actions/workflows/generate_and_upload.yml)
[![Canciones subidas a la app](https://github.com/mcmespana/mcmapp-cantoral/actions/workflows/sincroniza-cambios-firebase.yml/badge.svg)](https://github.com/mcmespana/mcmapp-cantoral/actions/workflows/sincroniza-cambios-firebase.yml)

Incluye...
* Todas las canciones del Cantoral MCM en formato Chord Pro (`songs/`)
* Generador del `songs-vX.json` y un uploader automático a la MCM App
* Admin local para editar, importar y revisar canciones (`scripts/admin/`)
* Conversor de acordes en formato tabulado a formato Chord Pro

Más documentación: [`AGENTS.md`](AGENTS.md) (estructura y comandos),
[`docs/CAMPOS_CANCIONES.md`](docs/CAMPOS_CANCIONES.md) (contrato de campos
y directivas), [`scripts/admin/README.md`](scripts/admin/README.md) (admin),
[`deploy/ugreen-nas/README.md`](deploy/ugreen-nas/README.md) (admin en el NAS)
y [`docs/REVISION_OIDO.md`](docs/REVISION_OIDO.md) (pendientes de revisión de
acordes a oído).

## Automatización de songs.json

Este repositorio incluye un flujo de trabajo de GitHub Actions que genera
automáticamente la última versión de `songs.json` y la publica en Firebase.
Cada vez que se hace push a la rama `main` con cambios en la carpeta `songs`
se ejecutan las siguientes acciones:

1. Se ejecuta `scripts/crear_songs_json.py` para crear un nuevo archivo
   `songs-vX.json` en la carpeta `songs` (solo dentro del runner).
2. El archivo resultante se envía a la base de datos de Firebase y se
   actualiza el campo `songs/updatedAt` con la marca de tiempo actual.

Los `songs-vX.json` **ya no se commitean desde el workflow**: la fuente de
verdad es Firebase. El repo conserva únicamente la última versión como punto
de partida de la numeración. Desde el admin (**Otros > JSON de canciones**) se
puede descargar el JSON actual o guardar una versión nueva en el repo.

Para que la publicación en Firebase funcione es necesario definir dos
**Secrets** en el repositorio de GitHub:

- `FIREBASE_URL`: URL base de la Realtime Database (por ejemplo
  `https://tu-proyecto.firebaseio.com`).
- `FIREBASE_TOKEN`: token con permisos de escritura en la base de datos.

## Otros flujos

- **Sincronización de ediciones desde la app**: un workflow
  (`sincroniza-cambios-firebase.yml`) corre cada 2 días y baja a los `.cho` las
  ediciones que los administradores hacen en la app (`scripts/sincronizaCambiosDeFirebase.py`).
- **Admin local** (`scripts/admin/`): editor y catálogo de canciones, importadores
  (docx, LaTeX, doceacordes.es), etiquetas y revisión; también corre en un NAS
  (`deploy/ugreen-nas/`).
- **`peticiones/`**: histórico de las peticiones de canciones y reportes que la
  gente envía desde la app; lo escribe el botón *Consultar peticiones* del admin.
- **`songs-backup-edits/`**: copias de seguridad previas a cada edición. Las crean
  el admin y el sync, pero git las ignora (el historial ya guarda cada `.cho`).

## Campos de canción en `songs-vX.json`

Cada entrada de canción puede incluir, además de los clásicos
(`title`, `filename`, `author`, `key`, `capo`, `content`), estos
campos opcionales — emitidos sólo cuando existen — que provienen de
*custom directives* MCM dentro del propio `.cho`:

| Campo JSON       | Directive en `.cho`              | Tipo                       | Descripción |
|------------------|----------------------------------|----------------------------|-------------|
| `rhythm`         | `{ritmo: …}`                     | string                     | Patrón rítmico ("parones+rasgueo", "balada 6/8"…). |
| `album`          | `{album: …}`                     | string                     | Álbum/disco donde aparece la versión de referencia. |
| `liturgicalTime` | `{tiempo: …}`                    | string                     | Tiempo litúrgico y/o fiestas (separados por ` \| `). |
| `source`         | `{fuente: …}`                    | string                     | Origen del chordpro (ej. `doceacordes.es - Parroquia San Bruno`). |
| `videoEmbed`     | `{video: URL}`                   | string                     | URL embebible del vídeo principal. |
| `youtubeLinks`   | `{youtube: Label \| URL}` (repetible) | `[{label, url}, …]`   | Lista ordenada de enlaces YouTube (orden = prioridad). |
| `audioLinks`     | `{audio: Label \| URL}` (repetible)   | `[{label, url}, …]`   | Lista ordenada de grabaciones internas (Drive, mp3…). |
| `comment`        | `{comentario: …}`                | string                     | Comentario libre (no se renderiza en el chordpro). |

Estas directives **no se imprimen** en el cuerpo de la canción que ve
el cantor: `scripts/crear_songs_json.py` las extrae a campos propios
del JSON y las elimina del campo `content` antes de emitirlo.

Edición desde el admin local: panel **🎬 Multimedia** del editor de
canción + acción rápida (icono ➕📺 / ➕🎧) en el catálogo. Las
canciones importadas con **🎸 Importar de doceacordes.es** rellenan
estos campos automáticamente con un scraping de la página oficial.
