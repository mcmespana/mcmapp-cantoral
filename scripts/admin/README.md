# Cantoral Admin

Mini app local (Flask + Alpine.js, sin build) para gestionar el cantoral.

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

Filtros: por categoría, por TO DO, por "solo manuales", buscador por título/autor.

### Editor de canción
Click en cualquier título → abre el editor con 3 pestañas:

- **🎨 Visual** — render con acordes encima de cada letra. Arrastra los acordes
  con el ratón para moverlos. Por defecto hace _snap_ al inicio de palabra más
  cercano; mantén `Shift` al soltar para colocar carácter a carácter (pixel
  perfect). Doble-click sobre un acorde para editarlo, `Supr` para borrarlo,
  click derecho para borrar. Botón "+ Añadir acorde" → click en una letra para
  insertar.
- **📝 Raw** — el ChordPro crudo en un textarea. Para casos donde quieras
  reorganizar líneas, mover bloques enteros, etc.
- **👁 Preview** — render limpio (sin botones), como se verá en la app móvil.

Panel lateral: title / artist / key / capo editables siempre visibles.
Cualquier cambio se aplica al .cho al pulsar `💾 Guardar`. Se hace backup
automático en `songs-backup-edits/<timestamp>/`.

Si la canción se importó del cantoral lleva el comentario
`{comment: TO DO: PENDIENTE REVISIÓN ACORDES}` y la badge 📝. Cuando termines
de revisarla, pulsa `✓ Revisada` y la marca desaparece.

### Importar del cantoral (📥)
Lista las canciones del `.docx` que aún no están en el repo. Checkboxes para
seleccionar, "Importar X seleccionadas" hace conversión + guarda con
`{comment: TO DO: ...}` al principio. Las recién importadas aparecen marcadas
con 📝 en el catálogo.

Click en cualquier título → preview de la conversión _sin_ guardar todavía.

### Reordenar (🔀)
Elige categoría, arrastra filas, "Aplicar nuevo orden" renombra los archivos
`01.xxx.cho`, `02.yyy.cho`… con backup previo de la carpeta entera.

### Regenerar songs.json
Botón en el dashboard. Ejecuta `crear_songs_json.py` y muestra la salida.

## TO DO marker

Detectado por la regex `\bTO\s+DO\b` (con espacio entre TO y DO, para no
confundir con el español "todo"). Cualquier `{comment: ...TO DO...}` cuenta.

## Backups

Cada edición / borrado / reordenación deja una copia en
`songs-backup-edits/<timestamp>/`. La carpeta crece — borra contenido antiguo
de vez en cuando.

## Limitaciones conocidas

- 9 canciones del docx tienen el cuerpo dentro de un text-box de Word
  (drawing element). El parser las marca con warning y no genera acordes;
  hay que hacerlas a mano usando el editor raw.
- El matching difuso de títulos entre repo y docx puede equivocarse con
  variantes (ej. "Hijos" vs "Hijas"). Si una canción aparece como _missing_
  pero tú crees que ya está, comprueba los títulos en ambos sitios.
- No hay autenticación. **No exponer fuera de localhost**.
