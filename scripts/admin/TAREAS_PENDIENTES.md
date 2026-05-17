# Mejoras pendientes del admin

Lista viva — añadir/quitar según se haga.

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
- **Undo/Redo** local en el editor visual (stack de estados).
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
- **Acción masiva**: seleccionar varias canciones del catálogo y
  - mover de categoría
  - aplicar/quitar TO DO en bloque
  - exportar a un zip

## Importar del cantoral

- **Preview comparativo**: para canciones que ya están en repo, mostrar
  diff entre la versión actual y la del cantoral para detectar
  actualizaciones del docx que conviene incorporar.

## Otros

- **Test suite mínima** (pytest) para las funciones clave del parser:
  `translate_one_chord`, `parse_chord_line`, snap-to-word, snap-to-syllable.
- **Tema oscuro completo**: revisar contraste en el preview render.
