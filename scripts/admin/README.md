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

### Peticiones de la gente (🙋)
Botón destacado en el Dashboard (**🙋 Consultar peticiones de la gente**) y
pestaña propia en el menú. Consulta lo que la gente envía desde la app y que el
**MCM Panel** también muestra: **solicitudes de canciones** (`songs/solicitudes`)
y **reportes de fallitos** (`songs/fallitos`) de la Realtime Database.

Al pulsar **Consultar y guardar** descarga de Firebase, lo funde con el histórico
y lo guarda en `peticiones/peticiones.json` (en la raíz del repo). Las peticiones
que desaparecen de Firebase (ya resueltas) se conservan marcadas como archivadas.
Con el botón **📦 Guardar en el repo (commit)** hace `git add/commit/push` solo de
la carpeta `peticiones/` (no toca otras ediciones `.cho` en curso).

**Variables:** no hace falta añadir nada nuevo. Reutiliza el `FIREBASE_URL` del
`.env` de la raíz que ya usan los scripts de sincronización. `FIREBASE_TOKEN` es
**opcional**: como el nodo `songs` es de lectura pública (la app lo lee sin
login), basta con la URL. Ver `peticiones/README.md`.

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

Cada fila tiene además:
- **📥 Importar** — importa sólo esa canción, tal y como viene del cantoral,
  sin tener que marcar el checkbox y subir a la barra de acciones.
- **🎸 en doceacordes (N)** — la canción está en doceacordes; conviene importarla
  de allí. Con varios candidatos abre un popover para elegir.
- **🔎 buscar en doceacordes** — aparece cuando el emparejado automático no ha
  encontrado nada. Salta a la pestaña de doceacordes buscando ese título y
  muestra un aviso; la canción que elijas hereda la sección, la posición y el
  tono que tenía en el cantoral.

### Importar de doceacordes (🎸)
Catálogo completo de doceacordes.es. Se puede importar **de una en una** (botón
📥 de la fila) o **varias a la vez**:

1. Marca las canciones con su checkbox (o **Marcar las visibles**).
2. Elige una categoría en la barra de lote y pulsa **Aplicar a marcadas** —
   reparte números libres sin repetir, respetando huecos.
3. **📥 Importar N marcadas**.

Si al importar un lote hubiera números repetidos en la misma categoría se
reparten de nuevo automáticamente antes de escribir nada.

`Esc` cierra los previews (doceacordes, LaTeX y cantoral).

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

## Rendimiento (por qué va rápido y qué no tocar)

La app iba muy lenta y se arreglaron cuatro cosas. Si vuelve a ir lenta,
mirar aquí primero:

| Qué | Antes | Ahora |
| --- | ----- | ----- |
| `/api/catalog` (se recarga tras cada import) | ~16 s | ~80 ms |
| Dashboard con datos al abrir la app | ~16 s | ~0,5 s |
| Preview de una canción de doceacordes | ~2,3 s | ~1,5 s, o instantáneo si ya se pasó el ratón por la fila |
| Importar 6 canciones de golpe | ~14 s | ~3 s |

1. **`text_width_px()` está memoizado** (`scripts/docx2chordpro.py`). Mide el
   ancho del texto carácter a carácter con Pillow para colocar los acordes;
   eran 110.000 llamadas por conversión del docx y se comía 15 de los 16
   segundos. El espacio de claves es diminuto (pares carácter/tamaño), así que
   el `lru_cache` lo resuelve. **No quitarlo.**
2. **`convert_docx_song()` cachea la conversión** por canción, y se invalida
   cuando cambia el mtime del `.docx`.
3. **El índice de doceacordes tiene índice invertido por token**, así que el
   matching difuso sólo puntúa las canciones que comparten alguna palabra en
   vez de recorrer las 1.700.
4. **Las descargas van en paralelo**: el `.cho` y el HTML de una canción a la
   vez, y en un import en lote se calientan todas antes de escribir. Además
   `/api/doce/prefetch` deja en cache la canción cuando pasas el ratón por su
   fila, y al arrancar el servidor se precalientan las cachés caras en un hilo
   aparte.

Los ficheros `.cho` generados son **idénticos** byte a byte a los de antes
(verificado sobre las 225 canciones del docx): todo esto es cacheo y
paralelismo, no se ha cambiado ninguna heurística de acordes.

## Limitaciones conocidas

- 9 canciones del docx (~4%) tienen el cuerpo dentro de un text box de Word
  (drawing element). El parser las marca con warning y no genera acordes;
  hay que crearlas con "Nueva canción a mano".
- El matching difuso de títulos entre repo y docx puede equivocarse con
  variantes (ej. "Hijos" vs "Hijas").
- No hay autenticación. **No exponer fuera de localhost**.
