# _para-borrar

Material que ningun script, workflow ni documento del repo usa, apartado
durante la limpieza de octubre 2026. **Nada de aqui se lee en runtime**: si
estas de acuerdo, borra la carpeta entera (el historial de git conserva todos
los blobs). Si algo te interesa, sacalo de aqui o guardalo fuera del repo.

La carpeta esta excluida de la imagen Docker (`.dockerignore`).

| Fichero | Por que esta aqui |
| ------- | ----------------- |
| `scripts/Cantoral Consolación CS v2.0.4.pdf` (18 MB) | PDF del cantoral. Ningun script lo lee; solo es fuente historica. |
| `scripts/Cantoral 2.0.4 - Versión Google Docs.docx` (0,9 MB) | Version del cantoral exportada de Google Docs. El importador solo lee el docx de Castellon (`scripts/Cantoral Consolación Castellón v2.0.4.docx`, que se queda). |
| `scripts/ejempos_latex/` | 4 `.tex` de ejemplo (el nombre de la carpeta tiene una errata). `alabo_tu_bondad`, `bendigamos_al_senor` y `preparad_el_camino` son identicos a los de `scripts/input/entrada/`; `dios_esta_aqui.tex` no esta en `scripts/input/`, pero la cancion ya existe como `songs/A. Entrada/02.dios_esta_aqui.cho`. |
| `scripts/ejemplos_doceacordes.es/` | 4 `.cho` de ejemplo de doceacordes.es (uno es un `- copia`) y `documentacion_doce_acordes.md`, notas para extraer datos de la web por JS en el DOM. El importador real es `scripts/admin/doceacordes_import.py` (usa `scripts/canciones_doce_acordes.json`). El `.md` puede tener valor documental. |
| `scripts/Z. PRUEBA - Recibir cambios Firebase copia.command` | Copia del launcher `Z. Recibir cambios Firebase.command` que solo difiere en una linea (anade `--dry-run` al script por defecto). Sin referencias. |

## Decisiones tomadas en la misma limpieza (para que no se pierda el rastro)

- `scripts/input/` **no** se ha movido aunque el hallazgo lo proponia: el
  importador de LaTeX del admin (`scripts/admin/latex_import.py`,
  vista "Importar de LaTeX") escanea `scripts/input/<categoria>/*.tex`.
- Los PDF/docx duplicados por normalizacion Unicode (NFC/NFD) se borraron
  directamente: los blobs eran identicos.
- `songs/C. Salmos/15.benedictus.chordpro` no estaba en ninguna otra
  categoria, asi que se renombro a `.cho` (el generador solo recoge `.cho`).
- `docs/PARA_APP_ENLACES_SPOTIFY_DRIVE_OTROS.md` se borro: la app ya lee
  `spotifyLinks` / `driveLinks` / `otherLinks` y el contrato vive en
  `docs/CAMPOS_CANCIONES.md`.
