# Cantoral Admin

Mini app local (Flask + Alpine.js, sin build step) para gestionar el cantoral
de la **Familia Consolación**.

## Arrancarlo

**Windows**: doble-click en `scripts/C. Admin Cantoral - WINDOWS.bat`
**Mac/Linux**: doble-click en `scripts/C. Admin Cantoral - MAC.command`

O a mano:
```bash
pip install flask pillow
python scripts/admin/server.py
# abre http://127.0.0.1:8765/
```

## Qué hace

### Dashboard
Contadores en vivo: cuántas canciones tienes en `/songs`, cuántas hay en el
cantoral .docx, cuántas faltan, cuántas tienen `📝 TO DO` pendiente, cuántas
son tuyas que no están en el cantoral.

### Catálogo (📋)
Tabla con todas las canciones del repo. Cada fila lleva badges:
- ✅ existe en repo + en cantoral
- ➕ solo en repo (canción manual que añadiste tú)
- 📝 con TO DO pendiente de revisión

Filtros: por categoría, por TO DO, por "solo manuales", buscador.

### Editor de canción

Click en cualquier título → editor con 3 pestañas + panel lateral de metadatos.

#### 🎨 Visual
La pestaña principal de trabajo. Cada letra es un `<span>` independiente
(preserva el ancho variable estilo Word) y los acordes flotan absolutamente
encima centrados sobre la letra a la que apuntan.

**Drag de acordes** — al SOLTAR:
| modificador  | comportamiento |
| ------------ | -------------- |
| (ninguno)    | snap al inicio de palabra más cercano |
| `Shift`      | snap a inicio de **sílaba** (silabeado español) |
| `Alt`        | sin snap, carácter a carácter (pixel-perfect) |

**Edición de acordes**:
- Doble-click sobre un acorde → prompt para cambiar texto (vacío = borrar).
- Click derecho → borrar con confirmación.
- `Supr` con acorde seleccionado → borrar.
- Botón **"+ Acorde"** → activa modo añadir, click en una letra para insertar.

**Edición de letra**:
- Doble-click en la letra de una línea → prompt para editar el texto entero.
  Los acordes intentan reubicarse en la misma palabra del nuevo texto.

**Selección de líneas** (gutter izquierdo `○`):
- Click en gutter → selecciona/desmarca línea.
- `Shift`+click → selección de rango.
- Líneas seleccionadas habilitan la toolbar de acciones.

**Toolbar de acciones**:
- 🟡 **Marcar estribillo** — envuelve la selección en `{soc}…{eoc}`.
- **Quitar marca** — elimina los marcadores cercanos.
- 📋 **Copiar acordes** — guarda en portapapeles el patrón de acordes de la
  selección (con su letra original para mapear por palabra).
- 📥 **Pegar acordes** — aplica el patrón a la selección actual, alineando
  por _palabra_: acorde de la palabra N origen → palabra N destino. Después
  solo hay que retocar a mano lo que haga falta.
- 🔁 **Insertar estribillo** — pega un bloque `{soc}…{eoc}` ya existente
  después de la selección.

**Atajo de teclado**: `Ctrl/Cmd+S` guarda.

#### 📝 Raw
ChordPro crudo en textarea. Para reorganizar líneas grandes, mover bloques,
añadir comentarios, etc. Sincroniza con el Visual al cambiar de pestaña.

#### 👁 Preview
Render limpio sin botones — como se verá en la app móvil. Los acordes salen
en color sobre la letra, **sin corchetes**.

### Importar del cantoral (📥)
Lista las canciones del `.docx` que aún no están en el repo. Checkboxes para
seleccionar, batch import añade `{comment: TO DO: PENDIENTE REVISIÓN ACORDES}`
al principio. Aparecen marcadas con 📝 en el catálogo.

### Reordenar (🔀)
Elige categoría, arrastra filas, "Aplicar nuevo orden" renombra los archivos
`01.xxx.cho`, `02.yyy.cho`… con backup previo de la carpeta entera.

### Nueva canción a mano (➕)
Botón en el dashboard. Modos:
- **En blanco** — crea el .cho solo con cabecera y TO DO. Editas con el visual.
- **Pegar ChordPro** — pegas el texto ya en formato `{title:...}\n[C]Letra...`.

(En la lista hay dos modos más marcados como "próximamente": pegar formato
Ultimate Guitar y pegar texto con acordes en línea de encima. Ver TAREAS_PENDIENTES.md.)

## Guardado y publicación

La app guarda directamente en los archivos `.cho`. Cuando termines de editar,
en la terminal:

```bash
git add songs/
git commit -m "..."
git push
```

Un GitHub Action regenera `songs-vX.json` y lo sube a Firebase automáticamente.
No necesitas regenerar el JSON tú.

El indicador del topbar muestra el estado: `Sin cambios` / `● Sin guardar` /
`Guardando…` / `✓ Guardado · haz commit cuando termines`.

## TO DO marker

Línea exacta añadida a las canciones recién importadas o creadas:
`{comment: TO DO: PENDIENTE REVISIÓN ACORDES}`.

La regex de detección es `\bTO\s+DO\b` (espacio entre TO y DO, así nunca
confunde con la palabra española "todo"). Cuando termines de revisar una,
pulsa **"✓ Revisada"** en el editor y se elimina la línea.

## Backups

Cada edición / borrado / reordenación deja una copia en
`songs-backup-edits/<timestamp>/`. La carpeta crece — borra contenido antiguo
de vez en cuando.

## Limitaciones conocidas

- 9 canciones del docx (~4%) tienen el cuerpo dentro de un text box de Word
  (drawing element). El parser las marca con warning y no genera acordes;
  hay que crearlas con "Nueva canción a mano".
- El matching difuso de títulos entre repo y docx puede equivocarse con
  variantes (ej. "Hijos" vs "Hijas").
- No hay autenticación. **No exponer fuera de localhost**.
