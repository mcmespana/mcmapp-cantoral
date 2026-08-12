# Mejoras pendientes del admin

Lista viva — añadir/quitar según se haga.

## Pendiente de la ronda de rendimiento / UX de imports

Cosas detectadas al arreglar la lentitud (ver sección "Rendimiento" del README)
que **no** se hicieron en esa iteración pero merecen la pena:

### Rendimiento

- **`/api/doce/list` devuelve 355 KB** con las 1.683 canciones (título, autor,
  subtítulo, url…). Se podría paginar en servidor o recortar campos; el
  subtítulo largo es la mayor parte del peso.
- **`list_repo_songs()` relee los 120 `.cho` en cada llamada** (~10 ms hoy,
  pero crece con el cantoral). Cachear por mtime de carpeta, como se hace ya
  con el `.docx` y con los `.tex`.
- **Sin `ETag`/`Cache-Control` en los endpoints de lectura.** Con un ETag por
  mtime, un `/api/catalog` sin cambios sería un 304 en vez de 143 KB.
- **Reusar la conexión HTTP con doceacordes.** Cada descarga abre una conexión
  nueva (`urllib`). Con `requests.Session` o un `HTTPSConnection` reutilizado se
  ahorra el handshake TLS en los imports en lote.
- **El prefetch al pasar el ratón sólo calienta esa canción.** Se podría
  precalentar también las 2-3 filas siguientes, con cuidado de no martillear
  doceacordes.

### UX

- **La selección de doceacordes no se limpia al cambiar de pestaña**: si marcas
  3 canciones y te vas al cantoral, al volver siguen marcadas y la barra dice
  "Importar 3 marcadas". A veces es lo que quieres; conviene al menos avisarlo.
- **Feedback de progreso real en el import en lote.** Ahora es un solo POST, así
  que el contador salta de 0 a N de golpe. Con SSE o un endpoint de estado se
  podría ver "3/10 descargadas".
- **Deshacer un import.** Se crea el `.cho` y ya está; un "✕ deshacer" en la
  lista de resultados que borre el archivo recién creado sería barato y quita
  miedo a importar en lote.
- **Emparejado inverso**: desde una canción del repo, poder buscarla en
  doceacordes para comparar acordes y actualizarla (hoy sólo se importa lo que
  no existe). Enlaza con el "preview comparativo" de más abajo.
- **Filtrar el catálogo de doceacordes por lo que falta en el cantoral**, no
  sólo por "está / no está en repo".

## Pendiente de la ronda de editor visual / raw / números

Detectado al hacer el selector de números, las operaciones de línea y el raw
coloreado. No hecho todavía:

### Editor visual

- **Pegar acordes desde el portapapeles del sistema** (Ctrl+V) en el visual, no
  sólo desde el modal de «Pegar texto».
- **Deshacer con granularidad de acorde.** Un arrastre de acorde es un paso de
  undo, lo cual está bien, pero arrastrar el mismo acorde tres veces seguidas
  deja tres pasos; se podrían agrupar por acorde y tiempo, como se hace ya con
  las ráfagas de tecleo en los metadatos.
- **Mover el bloque marcado con arrastre a otra canción** / entre pestañas. Hoy
  el portapapeles de líneas vive sólo dentro de la canción abierta.
- **Autoscroll al arrastrar** cerca del borde del documento: en canciones largas
  hay que soltar, hacer scroll y volver a agarrar.

### Raw

- **Directivas en letra más pequeña.** Se pidió y no se puede con este montaje:
  el color va en un `<pre>` detrás del `<textarea>`, y un `font-size` distinto
  descuadraría el cursor (el textarea no puede estilar partes de su texto). Para
  tenerlo habría que cambiar el textarea por un `contenteditable`, lo que obliga
  a rehacer el manejo del caret, el pegado y el undo del navegador. Valorar si
  merece la pena.
- **Resaltar la línea del cursor** en la capa de resaltado. Los números de línea
  ya están; esto es el complemento natural y encaja en la misma rejilla.
- **Ir a la línea N** (y saltar desde el aviso de «corchetes que no parecen un
  acorde» a la línea que lo tiene).

### Números

- **La rejilla llega hasta 100 fijo** (o hasta el mayor ocupado). Si alguna
  categoría pasara de ahí habría que subir el `upto`; el endpoint ya lo acepta
  como parámetro.
- **Ver los reservados también en la vista de reordenar**, para saber qué huecos
  conviene dejar libres al recolocar una categoría.
- **`docx_pending_by_section()` recalcula el emparejado repo↔docx en cada
  llamada.** Está cacheado por debajo (conversiones + docx), así que sale a unos
  pocos ms, pero es el mismo trabajo que hace `/api/catalog`: se podría compartir
  un único resultado memoizado por mtime.

## Importadores adicionales para "Nueva canción a mano"

El modal de nueva canción tiene los modos `blank` y `chordpro` funcionando.
Los siguientes están como placeholder (`disabled`):

### Modo "Ultimate Guitar / formato tabulado monoespaciado"
Texto pegado de UG, e-Chords, La Cuerda… donde los acordes están en líneas
sobre la letra, alineados por posición de columna con fuente monoespaciada.

Aprovechar el detector de `tab2chordpro.py` clásico, pero invocándolo desde el
backend (sin prompts interactivos): aceptar el texto, ejecutar el conversor en
memoria, devolver el .cho generado y abrirlo en el editor visual con TO DO.

Punto de partida: copiar la lógica de `convert_lines` + `is_chord_line` +
`inject` de `scripts/tab2chordpro.py` y exponerla como `POST /api/song/from-tabs`.

### Modo "Texto con acordes en línea de encima (estilo Word)"
Similar al anterior pero con espacios variables / tabs. Reusar el mismo
parser que el modo Ultimate Guitar — la diferencia visual es solo cómo
suele venir el texto. En realidad ambos modos pueden ser el mismo endpoint
con la misma lógica de detección.

## Mejoras del parser docx2chordpro.py

- **Soporte de text boxes**: las 9 canciones que viven dentro de un
  `<w:drawing>` quedan sin acordes. Se podría recorrer también el contenido
  de `<wsp:txbx><w:txbxContent>` para extraerlas. Estructura: cada txbx
  contiene `<w:p>` con runs y tabs igual que un párrafo normal.
- **Tabla de mapeo acordes manual**: añadir un `scripts/chord_aliases.json`
  con casos especiales del cantoral (acordes raros que el script no traduce
  bien). Cargar en `translate_one_chord` antes del regex.
- **Mejor detección de "música:"**: extraer la fila de "Música:" o "Letra:"
  del docx cuando esté como párrafo aparte tras el título, para rellenar
  `{artist}` automáticamente.

## Editor visual

- **Render con la fuente real del cantoral (Calibri)**: cargar Calibri
  via @font-face o web font equivalente (Carlito es métricamente compatible
  y libre). Mejoraría la fidelidad visual a Word.
- **Atajo `+ acorde` directo con tecla**: hold de una tecla (`A`?) + click
  para añadir sin tener que activar el modo en la toolbar.
- **Indicador de palabra/sílaba** durante el drag: mostrar visualmente
  dónde caerá el acorde antes de soltar (overlay sobre la letra target).
- **Multiselección de acordes**: poder mover varios a la vez.
- **Mapeo de acordes entre estrofas más inteligente**: cuando el número de
  palabras difiere entre origen y destino, usar similaridad léxica
  (Levenshtein) para alinear mejor.

## Catálogo

- **Vista compacta por categoría**: poder ver una categoría como tabla
  estilo "índice" (número · título · key · capo · pendiente).
- **Exportar a un zip** las canciones seleccionadas del catálogo (mover de
  categoría y el TO DO en bloque ya están).

## Importar del cantoral

- **Preview comparativo**: para canciones que ya están en repo, mostrar
  diff entre la versión actual y la del cantoral para detectar
  actualizaciones del docx que conviene incorporar.

## Otros

- **Test suite mínima** (pytest) para las funciones clave del parser:
  `translate_one_chord`, `parse_chord_line`, snap-to-word, snap-to-syllable.
- **Tema oscuro completo**: revisar contraste en el preview render.
