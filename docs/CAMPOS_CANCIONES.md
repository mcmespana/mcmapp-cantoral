# Campos de una canción — ChordPro · JSON · Firebase

Documento de referencia para sincronizar la información de las canciones entre
este repositorio (fuente: ficheros `.cho`) y la **app del cantoral**.

Pensado para que un agente de IA del repo de la app sepa exactamente:

1. Qué campos lleva hoy una canción.
2. Cómo se escriben en el ChordPro (`.cho`).
3. Cómo viajan en el JSON que consume la app (`songs/data`).
4. Cómo vuelven las ediciones hechas desde la app (`songs/ediciones`).

> Convención de idioma: las **directivas ChordPro** están en español (`{ritmo:}`,
> `{tiempo:}`, `{fuente:}`, `{comentario:}`), pero las **claves JSON** están en
> inglés (`rhythm`, `liturgicalTime`, `source`, `comment`). No confundir.

---

## 1. El flujo de datos (de un vistazo)

```
                    (admin local, Flask)              (app móvil del cantoral)
                            │                                   │
                            ▼ escribe directo                   ▼ escribe ediciones
   ┌───────────────────────────────────┐          ┌──────────────────────────────┐
   │   songs/<Categoría>/NN.titulo.cho  │          │  Firebase: songs/ediciones/   │
   │            (FUENTE DE VERDAD)       │          │     <pushId> {…New / …Old}    │
   └───────────────────────────────────┘          └──────────────────────────────┘
            │  push a main (songs/**)                          │
            ▼                                                   │ cron cada 2 días
   generate_and_upload.yml                          sincroniza-cambios-firebase.yml
   crear_songs_json.py → songs-vX.json                aplica al .cho y borra el nodo
   update_firebase.py  → Firebase songs/data                   │
            │                                                   ▼
            └──────────────►  Firebase  ◄──────────  (vuelve al .cho de arriba)
                          songs/data  (lo que lee la app)
```

**Rutas en Firebase RTDB:**

| Ruta | Quién escribe | Qué contiene |
|------|---------------|--------------|
| `songs/data` | CI (`update_firebase.py`) | El JSON completo del cantoral. **Es lo que lee la app.** |
| `songs/updatedAt` | CI | Timestamp Unix de la última publicación. |
| `songs/ediciones/<pushId>` | **La app móvil** | Ediciones pendientes de sincronizar al repo. |

La **fuente de verdad** son los `.cho`. La app **lee** de `songs/data` y
**propone cambios** escribiendo en `songs/ediciones`. El repo aplica esas
ediciones a los `.cho` y regenera `songs/data`, cerrando el ciclo.

---

## 2. Tabla maestra de campos

Para cada campo: cómo se escribe en el `.cho`, su clave en el JSON (`songs/data`)
y su clave en `songs/ediciones`.

| Campo | Directiva ChordPro | Clave JSON (`songs/data`) | Clave en `ediciones` | Tipo | Notas |
|-------|--------------------|---------------------------|----------------------|------|-------|
| Título | `{title: ...}` | `title` | `titleNew` / `titleOld` | string | En JSON va prefijado con el código del fichero, p.ej. `"01. Ven a Celebrar"`. |
| Autor / artista | `{artist: ...}` (o `{author: ...}`) | `author` | `authorNew` / `authorOld` | string | `{artist:}` tiene prioridad sobre `{author:}`. |
| Tonalidad | `{key: ...}` | `key` | `keyNew` / `keyOld` | string | Ej. `G`, `Em`, `F#m`, `Dm`. |
| Cejilla | `{capo: ...}` | `capo` | `capoNew` / `capoOld` | int | Entero (0 si no hay). |
| Info | — | `info` | `infoNew` / `infoOld` | string | Campo libre; hoy se emite vacío en el JSON. |
| Contenido | (cuerpo del `.cho`) | `content` | `contentNew` / `contentOld` | string | ChordPro completo. Ver §4. |
| Ritmo | `{ritmo: ...}` | `rhythm` | `rhythmNew` / `rhythmOld` | string | Ej. `4x4`, `parón + 4x4`. |
| Álbum | `{album: ...}` | `album` | `albumNew` / `albumOld` | string | Ej. `¡Alégrate!, 2004`. |
| Tiempo litúrgico | `{tiempo: ...}` | `liturgicalTime` | `liturgicalTimeNew` / `liturgicalTimeOld` | string | Ej. `Adviento`, `Entrada`. |
| Fuente | `{fuente: ...}` | `source` | `sourceNew` / `sourceOld` | string | Atribución de origen. |
| Vídeo embebido | `{video: ...}` | `videoEmbed` | `videoEmbedNew` / `videoEmbedOld` | string (url) | URL de embed (p.ej. `youtube.com/embed/...`). |
| Enlaces YouTube | `{youtube: label \| url}` | `youtubeLinks` | `youtubeLinksNew` / `youtubeLinksOld` | array de `{label,url}` | Repetible. Ver §3. |
| Enlaces de audio | `{audio: label \| url}` | `audioLinks` | `audioLinksNew` / `audioLinksOld` | array de `{label,url}` | Repetible. Ver §3. |
| Comentario (meta) | `{comentario: ...}` | `comment` | `commentNew` / `commentOld` | string | OJO: solo `{comentario:}` (español) se extrae a metadato. |

### Identificación / estructura

| Campo | Clave JSON | Clave en `ediciones` | Notas |
|-------|-----------|----------------------|-------|
| Fichero | `filename` | `filename` | Nombre del `.cho`, p.ej. `01.ven_a_celebrar.cho`. |
| Categoría | (clave del objeto padre) | `category` | Ver §5. |

> **Multimedia sí se sincroniza.** Desde la ampliación del
> `scripts/sincronizaCambiosDeFirebase.py`, el repo aplica también los campos
> multimedia (`rhythm`, `album`, `liturgicalTime`, `source`, `videoEmbed`,
> `youtubeLinks`, `audioLinks`, `comment`) que la app escriba en `ediciones`.
> Reglas de aplicación (importante para la app):
>
> - El **cuerpo** (`contentNew`) viaja **sin** las directivas multimedia (igual
>   que en `songs/data`). El script las reinyecta en la cabecera del `.cho`.
> - Para cada campo multimedia: si la edición trae `<campo>New`, ese valor manda
>   (un string vacío o un array vacío **borra** la directiva); si **no** lo trae,
>   se **conserva** lo que ya hubiera en el `.cho`. Así, editar solo la letra no
>   pierde los enlaces, y editar solo un enlace no toca la letra.
> - `youtubeLinksNew` / `audioLinksNew` son arrays de `{label, url}` (ver §3).

---

## 3. Convención `label | url` (youtube / audio)

Los enlaces se escriben en el `.cho` con una barra vertical separando una
etiqueta opcional de la URL:

```chordpro
{youtube: Versión oficial | https://www.youtube.com/watch?v=yffsxTH2DiE}
{youtube: https://www.youtube.com/watch?v=yffsxTH2DiE}      ← sin etiqueta
{audio: Pista guía | https://example.com/cancion.mp3}
```

- Se parte por el **primer** `|`.
- Si no hay `|`: `label = ""` y `url` = todo el valor.
- En el JSON se convierten en objetos:

```json
"youtubeLinks": [
  { "label": "Versión oficial", "url": "https://www.youtube.com/watch?v=yffsxTH2DiE" },
  { "label": "", "url": "https://www.youtube.com/watch?v=otroId" }
],
"audioLinks": [
  { "label": "Pista guía", "url": "https://example.com/cancion.mp3" }
]
```

Tanto `{youtube:}` como `{audio:}` son **repetibles** (varias líneas → varios
elementos del array).

`{video:}` es distinto: una sola URL de embed que va al campo `videoEmbed`
(string, no array).

---

## 4. El cuerpo `content` (ChordPro)

`content` contiene el ChordPro completo de la canción. Reglas que la app debe
conocer al renderizar:

### 4.1 Acordes inline
Entre corchetes, justo antes de la sílaba: `[G]`, `[D]`, `[Em]`, `[C#m]`.
La app los muestra **sobre** la letra y **sin** corchetes.

```chordpro
EL [G]SEÑOR ES MI [D]PASTOR NADA ME [Em]FALTA
```

### 4.2 Estribillos: `{soc}` … `{eoc}`
Marcadores estándar de inicio/fin de estribillo (*start/end of chorus*). Todo lo
que quede entre ellos se renderiza como estribillo (resaltado / sangrado).

```chordpro
{soc}
[G]Gloria a Dios en el cielo
{eoc}
```

### 4.3 Directiva de arreglo: `{arr: ...}`  ← campo nuevo
Línea **inline** dentro del contenido (no es un metadato de cabecera) que anota
un arreglo o indicación de interpretación sobre ese punto de la canción
(intro, repeticiones, solo, indicación de instrumento, etc.).

```chordpro
{soc}
[G]Cristo está [D]aquí
{eoc}
{arr: Intro: lam · SOL · DO · SOL  (x2)}
[Em]Estrofa...
```

- Texto libre tras `arr:`.
- La inserta el editor visual del admin ("✍ Añadir arreglo").
- **Permanece dentro de `content`** (no se extrae a una clave JSON aparte), así
  que la app debe reconocer las líneas `{arr: ...}` y darles un estilo propio
  (distinto de la letra y del comentario).

### 4.4 Comentarios
- `{comment: ...}` — comentario/indicación visible. **Se queda en `content`.**
  Se usa también para marcadores de revisión: `{comment: TO DO: PENDIENTE REVISIÓN ACORDES}`.
- `{c: ...}` — etiqueta corta de sección (`{c: Estrofa 1}`, `{c: Puente}`).
- `{comentario: ...}` (español) — **se extrae** al campo meta `comment` y se
  **quita** de `content`. (Es la única forma que el generador trata como metadato.)

### 4.5 Qué se queda y qué se quita de `content`
Al generar el JSON (`crear_songs_json.py`), estas directivas **se eliminan** de
`content` porque pasan a ser campos propios:

`{ritmo:}` · `{album:}` · `{tiempo:}` · `{fuente:}` · `{video:}` ·
`{youtube:}` · `{audio:}` · `{comentario:}`

El resto **permanece** en `content`: `{title:}`, `{artist:}`/`{author:}`,
`{key:}`, `{capo:}`, `{soc}`, `{eoc}`, `{arr:}`, `{comment:}`, `{c:}` y los
acordes `[X]`.

---

## 5. Categorías

`songs/data` es un objeto cuyas claves son categorías. Cada categoría tiene
`categoryTitle` y un array `songs`. El mapeo categoría → carpeta del repo va por
la **letra inicial** del `categoryTitle` (ver `songs/indice.json`):

| Carpeta | categoryTitle (ejemplo) |
|---------|--------------------------|
| `A. Entrada` | `A. Entrada` |
| `B. Gloria` | `B. Gloria` |
| `C. Salmos` | `C. Salmos` |
| `E. Ofertorio` | `E. Ofertorio` |
| … | … |

En `songs/ediciones`, la app indica la `category` (la clave, p.ej. `ofertorio`)
y el `filename`; el sincronizador resuelve la carpeta a partir de la letra.

---

## 6. Ejemplos completos

### 6.1 `.cho` con campos nuevos

```chordpro
{title: Ven a Celebrar}
{artist: Alborada}
{key: G}
{capo: 2}
{ritmo: 4x4}
{tiempo: Entrada}
{album: ¡Alégrate!, 2004}
{fuente: doceacordes.es}
{youtube: Versión oficial | https://www.youtube.com/watch?v=yffsxTH2DiE}
{youtube: Alternativo | https://www.youtube.com/watch?v=otroId}
{audio: Pista guía | https://example.com/guia.mp3}

{soc}
[G]Ven a cele[D]brar...
{eoc}
{arr: Intro: SOL · RE · DO  (x2)}
[Em]Estrofa primera...
```

### 6.2 Mismo objeto en `songs/data`

```json
{
  "title": "01. Ven a Celebrar",
  "filename": "01.ven_a_celebrar.cho",
  "author": "Alborada",
  "key": "G",
  "capo": 2,
  "info": "",
  "rhythm": "4x4",
  "liturgicalTime": "Entrada",
  "album": "¡Alégrate!, 2004",
  "source": "doceacordes.es",
  "youtubeLinks": [
    { "label": "Versión oficial", "url": "https://www.youtube.com/watch?v=yffsxTH2DiE" },
    { "label": "Alternativo", "url": "https://www.youtube.com/watch?v=otroId" }
  ],
  "audioLinks": [
    { "label": "Pista guía", "url": "https://example.com/guia.mp3" }
  ],
  "content": "{title: Ven a Celebrar}\n{artist: Alborada}\n{key: G}\n{capo: 2}\n\n{soc}\n[G]Ven a cele[D]brar...\n{eoc}\n{arr: Intro: SOL · RE · DO  (x2)}\n[Em]Estrofa primera...\n"
}
```

> Nota: los campos opcionales (`rhythm`, `album`, etc.) **solo aparecen si tienen
> valor** — si están vacíos, la clave no se incluye en el JSON. La app debe
> tratarlos como opcionales. Los multimedia ya **no** van dentro de `content`
> (se han extraído), pero `{arr:}` y `{comment:}` **sí** siguen ahí.

### 6.3 Edición propuesta desde la app (`songs/ediciones/<pushId>`)

```json
{
  "filename": "01.ven_a_celebrar.cho",
  "category": "entrada",
  "titleOld": "Ven a Celebrar",
  "titleNew": "Ven a Celebrar",
  "authorOld": "Alborada",
  "authorNew": "Alborada",
  "keyOld": "G",
  "keyNew": "A",
  "capoOld": 2,
  "capoNew": 0,
  "infoOld": "",
  "infoNew": "",
  "contentOld": "{title: Ven a Celebrar}\n...",
  "contentNew": "{title: Ven a Celebrar}\n...(con acordes corregidos, SIN multimedia)...",

  "rhythmOld": "4x4",
  "rhythmNew": "parón + 4x4",
  "youtubeLinksOld": [{ "label": "Oficial", "url": "https://youtu.be/abc" }],
  "youtubeLinksNew": [
    { "label": "Oficial", "url": "https://youtu.be/abc" },
    { "label": "Acústico", "url": "https://youtu.be/def" }
  ]
}
```

> Solo hace falta enviar los pares `*Old`/`*New` de los campos que cambian.
> Los que no se incluyen se conservan tal cual en el `.cho`.

Reglas del sincronizador:

- Si `contentNew` ≠ `contentOld` → reescribe el cuerpo del `.cho` con
  `contentNew` (que **no** incluye multimedia).
- Reinyecta las directivas multimedia en la cabecera: para cada campo usa
  `*New` si la edición lo trae (vacío = borrar), o lo que ya había en el `.cho`
  si no lo trae.
- Revisa los tags `title/artist/key/capo/info`: si `*New` ≠ `*Old`,
  actualiza/inserta la directiva correspondiente.
- Tras aplicar (y solo si el push al repo tiene éxito), borra el nodo
  `songs/ediciones/<pushId>`.

---

## 7. Resumen para el agente de la app

- **Leer** siempre de `songs/data` (no de los `.cho`).
- Campos garantizados en cada canción: `title`, `filename`, `author`, `key`,
  `capo`, `info`, `content`.
- Campos opcionales (pueden faltar): `rhythm`, `album`, `liturgicalTime`,
  `source`, `videoEmbed`, `youtubeLinks`, `audioLinks`, `comment`.
- `youtubeLinks` / `audioLinks` son arrays de `{label, url}` (label puede ser `""`).
- Al renderizar `content`: acordes `[X]` sobre la letra; estribillos entre
  `{soc}`/`{eoc}`; líneas `{arr: ...}` como anotación de arreglo; `{comment:}` y
  `{c:}` como notas.
- **Proponer cambios** escribiendo en `songs/ediciones/<pushId>` con pares
  `*Old`/`*New` + `filename` + `category`. El repo aplica
  `title/author/key/capo/info/content` **y** los multimedia (`rhythmNew`,
  `albumNew`, `liturgicalTimeNew`, `sourceNew`, `videoEmbedNew`,
  `youtubeLinksNew`, `audioLinksNew`, `commentNew`).
- El `contentNew` debe ir **sin** directivas multimedia (el repo las reinyecta);
  los multimedia se envían como sus campos estructurados. Solo hace falta incluir
  los campos que cambian; los demás se conservan.
```
