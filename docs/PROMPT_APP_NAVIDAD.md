# Prompt para la app (repo `mcmapp`): subcategorías, «también en», marcado y Navidad

> Cómo usar este fichero: copia **la Fase 1** entera (desde «Contexto» hasta
> «Cómo darlo por terminado») en una sesión del agente que trabaja en el repo
> `mcmapp`. La **Fase 2** (packs y modo Villancicos Solidarios / fork MCM
> Cantoral) es para más adelante: pégala cuando toque, en otra sesión.
>
> El contrato de datos completo vive en el repo `mcmapp-cantoral`,
> `docs/CAMPOS_CANCIONES.md` (§5.1–§5.3 son lo nuevo). Lo esencial va copiado
> aquí abajo para que el prompt se baste solo.

---

## FASE 1 — para pegar ya

### Contexto

Eres el agente del repo `mcmapp` (app Expo/React Native «MCM App»). El
cantoral se publica desde el repo `mcmapp-cantoral` en Firebase RTDB, nodo
`songs/data` (lo lee la app), y las ediciones hechas desde la app vuelven por
`songs/ediciones/<pushId>` con pares `*Old`/`*New`.

Este año se migra a la app el cantoral de los **Villancicos Solidarios** (unas
90 canciones) en la categoría **Navidad**, y la app tiene que soportar cuatro
cosas nuevas del contrato de datos. Ninguna rompe nada: son campos opcionales y
la app de hoy los ignora. Lo que hay que hacer es **usarlos**.

Antes de tocar nada, lee cómo funciona hoy: la pantalla de una categoría del
cantoral, la búsqueda, favoritos/recientes, la pantalla de etiquetas
(`docs/funcionalidades/ETIQUETAS.md`), la hoja de la canción
(`utils/songSheet.ts`, `utils/songDocument*.ts`,
`docs/funcionalidades/HOJA_CANCION.md`) y el envío de ediciones a
`songs/ediciones`. Sigue los patrones que ya existen (tipos, hooks de Firebase,
estilos, tests) en vez de inventar otros.

### 1. Subcategorías

Una categoría puede partirse en subcategorías. Navidad estrena cuatro:

| slug | título | siglas | emoji |
|------|--------|--------|-------|
| `clasicos` | Villancicos clásicos | VC | ⭐ |
| `actuales` | Villancicos actuales | VA | ✨ |
| `versiones` | Versiones navideñas | VN | 🎤 |
| `otras` | Otras canciones | OC | 🎶 |

**Datos** (`songs/data`):

```jsonc
"navidad": {
  "categoryTitle": "N. Navidad 🎄",
  "subcategories": {                       // OPCIONAL. Mapa por slug, no array.
    "clasicos": { "title": "Villancicos clásicos", "short": "VC", "emoji": "⭐",
                  "order": 1, "description": "Los de toda la vida: tradicionales y populares." },
    "actuales": { "title": "Villancicos actuales", "short": "VA", "emoji": "✨", "order": 2 },
    "versiones":{ "title": "Versiones navideñas",  "short": "VN", "emoji": "🎤", "order": 3 },
    "otras":    { "title": "Otras canciones",      "short": "OC", "emoji": "🎶", "order": 4 }
  },
  "songs": [
    { "title": "19. Hoy ha Nacido", "filename": "19.hoy_ha_nacido.cho",
      "subcategory": "actuales", ... },     // OPCIONAL en cada canción
    ...
  ]
}
```

- En `subcategories`, solo `title` y `order` están garantizados; `short`,
  `emoji` y `description` pueden faltar.
- Una canción puede **no** tener `subcategory`, o tener una que no esté en el
  mapa: no es un error.

**Qué tiene que hacer la app:**

1. **Pantalla de la categoría.** Si la categoría trae `subcategories`, la lista
   se agrupa por subcategoría, en su `order`: cabecera de grupo con emoji +
   título + nº de canciones (cabeceras pegajosas al hacer scroll, como una
   `SectionList`). Dentro de cada grupo, el orden de siempre (por número).
   Las canciones sin subcategoría (o con una no declarada) van a un grupo final
   «Sin clasificar» (o, si la no declarada tiene slug, con el slug capitalizado
   como título). Si la categoría **no** trae `subcategories`, todo queda
   exactamente como hoy.
2. **Filtro rápido** arriba de la lista: chips con las siglas (`VC` `VA` `VN`
   `OC`, con el emoji si no hay siglas) + «Todas». Tocar un chip deja solo ese
   grupo. Se recuerda por categoría mientras dura la sesión.
3. **Insignia fuera de contexto.** Donde una canción aparece fuera de su
   categoría (resultados de búsqueda, pantalla de una etiqueta, favoritos,
   recientes) y tiene subcategoría, una insignia pequeña con las siglas (o el
   emoji) junto al título. Dentro de la propia categoría no hace falta: ya lo
   dice la cabecera.
4. **Hoja de la canción.** En la cabecera, junto a tono/cejilla, la
   subcategoría como badge discreto («⭐ Villancicos clásicos»).
5. **Ediciones desde la app.** Si la app permite editar metadatos, puede
   proponer cambio de subcategoría con `subcategoryOld`/`subcategoryNew`
   (string, slug; `""` = quitarla). El repo ya lo aplica. No es obligatorio
   añadir esa edición ahora; si se añade, un selector con las subcategorías
   declaradas de la categoría de la canción.
6. **Tipos.** Añade `subcategory?: string` a la canción y
   `subcategories?: Record<string, {title: string; short?: string; emoji?: string; description?: string; order: number}>`
   a la categoría. Una función pura `groupBySubcategory(category)` → grupos
   ordenados, con tests (con y sin subcategorías, canción sin subcategoría,
   subcategoría no declarada, orden).

### 2. «También en» (`alsoIn`)

Una canción vive en **una** categoría pero puede verse también en otras, sin
duplicarse en los datos. Ejemplo: «Somos Consolación» es de Himnos y se canta
en los Villancicos Solidarios:

```jsonc
"himnos": { "songs": [
  { "title": "05. Somos Consolación", "filename": "05.somos_consolacion.cho",
    "alsoIn": [ { "category": "navidad", "subcategory": "otras" } ], ... }
]}
```

`alsoIn` es OPCIONAL; `category` es la clave de la categoría (`navidad`,
`himnos`…) y `subcategory` es opcional.

**Qué tiene que hacer la app:**

1. La lista de una categoría = sus canciones **+** las de otras categorías que
   la tienen en `alsoIn` (en el grupo de su `subcategory`, si la traen; si no,
   en «Sin clasificar»). Las prestadas llevan una marca discreta de dónde viven
   («↗ Himnos») y se ordenan detrás de las propias dentro de su grupo, por
   título (su número es de otra categoría y aquí no significa nada: no lo
   enseñes en la lista prestada, o enséñalo con la letra de su categoría).
2. **Una canción es la misma** se vea donde se vea: favoritos, recientes,
   historial, ediciones y cualquier id siguen usando su categoría **de casa**
   + `filename`. La búsqueda no la devuelve dos veces.
3. Al editar una canción prestada desde la app, `songs/ediciones` lleva la
   `category` **de casa** (donde vive el `.cho`), nunca la prestada.
4. Contadores (nº de canciones de la categoría, etiquetas) cuentan las
   prestadas en la categoría donde se ven, pero las etiquetas cuentan cada
   canción una sola vez.
5. Función pura `songsForCategory(data, categoryKey)` (propias + prestadas, con
   el agrupado del punto 1) con tests.

### 3. Marcado en la letra: `<i>`, `<u>`, `<b>` y anotaciones `[*…]`

El cantoral de villancicos usa formato con significado, y en el `.cho` va con el
marcado estándar de **ChordPro 6**:

| En el `.cho` | Significa | Ejemplo |
|---|---|---|
| `<i>…</i>` | 2ª voz, eco, la parte del otro grupo | `<i>Fue sin [Am]querer que te quiero</i>` |
| `<u>…</u>` | altas / bajas (lo explica una nota de la propia canción) | `<u>Venid y adoremos</u>` |
| `<b>…</b>` | énfasis dentro de una línea que no es estribillo | `Tarantán cuando daban <b>las dos</b>` |
| `[*CLAP]` | anotación encima de la letra (palmas, golpes…) | `cambió [*CLAP], Cristo nació` |

Reglas del contrato: solo esas tres etiquetas, sin atributos, minúsculas, y
**nunca cruzan de una línea a otra** (una línea siempre las cierra). Pueden
envolver acordes: `<i>Fue sin [Am]querer</i>`.

Hoy la hoja **escapa** el `<` (se vería «&lt;i&gt;Fue…» literal), así que el
repo **todavía no las manda**: `scripts/chordpro.py` tiene `APP_MARKUP = False`
y `crear_songs_json.py` las quita del `content`. Las anotaciones `[*CLAP]` sí
llegan ya y se pintan, pero con el mismo estilo que un acorde.

**Qué tiene que hacer la app:**

1. En `songSheet`/`songDocument`: reconocer `<i> </i> <u> </u> <b> </b>` en la
   letra **antes** de pasarla a chordsheetjs (que escapa), igual que ya se hace
   con `{arr:}` (marcador privado `@@ARR@@`): sustitúyelas por marcadores de uso
   privado (p.ej. ``…``), y al generar el HTML conviértelas en
   `<em class="v2">`, `<span class="u">`, `<strong>` **por segmento**: la hoja
   parte la línea en segmentos acorde+texto (`.s > .t`), así que cada segmento
   abre y cierra las etiquetas que estén activas en ese punto (nada de HTML mal
   anidado). Cualquier otro `<…>` se sigue escapando como hoy.
2. Estilo: cursiva = cursiva y un color secundario suave (es «la otra voz»);
   subrayado = subrayado; negrita = negrita. Que se lea bien en claro/oscuro y
   en todos los estilos de estribillo.
3. Anotaciones `[*…]`: mismo sitio que un acorde, pero con estilo propio
   (cursiva, color atenuado, sin negrita) y **sin** transportar ni traducir a
   DO-RE-MI. Que se oculten con «ocultar acordes» solo si son acordes; las
   anotaciones mejor que se vean siempre (son indicaciones para cantar).
4. Donde se usa el texto plano de la letra (búsqueda por letra, compartir,
   copiar, detección de estribillos repetidos, cortes de línea largos), quitar
   las etiquetas antes.
5. Tests: línea con `<i>` que abarca varios segmentos y un acorde dentro;
   etiqueta sin cerrar al final de línea (se cierra sola); `<script>` y `<br>`
   se siguen escapando; anotación `[*CLAP]` no se transporta.
6. **Avisar al repo del cantoral**: cuando esto esté publicado en las tiendas,
   en `mcmapp-cantoral` hay que poner `APP_MARKUP = True` en
   `scripts/chordpro.py` (una línea). Déjalo escrito en tu resumen final.

### 4. Duración

Canción con `"duration": "3:30"` (opcional, siempre `m:ss`). Enséñala en la
cabecera de la hoja como badge pequeño («⏱ 3:30») si existe. Tipo:
`duration?: string`. Se usará en los packs de la Fase 2.

### 5. La vista previa del admin usa vuestra hoja

El admin local del cantoral (`mcmapp-cantoral/scripts/admin`) pinta la vista
previa con vuestra hoja empaquetada (`npm run build:sheet-bundle` en
`mcm-app`, que escribe `../mcmapp-cantoral/scripts/admin/static/mcm-sheet.js`
si los dos repos están uno al lado del otro). **Cuando cambies la hoja,
regenera el bundle** y di en el resumen que hay que commitearlo en el otro
repo. El test que compara el bundle con el WebView tiene que seguir pasando.

### Cómo darlo por terminado

- Una categoría sin `subcategories` ni canciones prestadas se ve **idéntica**
  a hoy (compruébalo con los datos reales de `songs/data`).
- Con estos datos de ejemplo se ve bien: Navidad con 4 grupos y chips; una
  canción de Himnos con `alsoIn: [{category: "navidad", subcategory: "otras"}]`
  sale en Navidad → Otras canciones con «↗ Himnos», y en Himnos como siempre;
  la búsqueda la da una vez.
- La hoja pinta `<i>`, `<u>`, `<b>` y `[*CLAP]` como se describe, en claro y
  oscuro, con acordes visibles y ocultos.
- Tests nuevos verdes y los de siempre también. Documentación en
  `docs/funcionalidades/` (un `SUBCATEGORIAS.md` o ampliar el de la categoría)
  con lo que has hecho.
- Resumen final con: qué pantallas cambian, capturas si puedes, y la lista de
  cosas que tocan al repo del cantoral (bundle de la hoja, `APP_MARKUP`).

---

## FASE 2 — más adelante (no pegar todavía)

### Packs de villancicos (playlists)

En los Villancicos Solidarios se canta por **bloques de ~1 hora** («packs»),
siempre con el himno y «Feliz Navidad» al principio y al final, y con tono,
cejilla e instrumentos decididos para ese día. Hoy se preparan en el admin del
cantoral y se guardan en el repo `mcmapp-cantoral`, carpeta `packs/`, un JSON
por pack:

```jsonc
// packs/manana-1.json
{
  "title": "Mañana 1",
  "event": "Villancicos Solidarios 2025 · Edificio Hucha",
  "date": "2025-12-20",
  "targetMinutes": 60,
  "notes": "",
  "items": [
    { "song": "navidad/himno_villancicos_solidarios", "title": "Himno Villancicos Solidarios",
      "key": "Am", "capo": 1, "notes": "🎺" },
    { "type": "break", "title": "Presentación de la hucha", "minutes": 3 },
    { "song": "himnos/somos_consolacion", "title": "Somos Consolación" }
  ]
}
```

`song` es `categoría/slug` (el nombre del fichero sin número ni `.cho`), que no
cambia al renumerar. Cuando se publiquen, irán **resueltos** a Firebase
`songs/packs` con el formato `{data, updatedAt}` de siempre:

```jsonc
"songs/packs/data": {
  "manana-1": {
    "title": "Mañana 1", "event": "…", "date": "2025-12-20", "targetMinutes": 60,
    "totalSeconds": 3540,
    "items": [
      { "category": "navidad", "filename": "00.himno_villancicos_solidarios.cho",
        "title": "Himno Villancicos Solidarios", "key": "Am", "capo": 1, "notes": "🎺",
        "duration": "3:20" },
      { "type": "break", "title": "Presentación de la hucha", "minutes": 3 }
    ]
  }
}
```

Lo que pediría a la app: pantalla «Packs» (lista con título, evento, fecha,
duración total vs objetivo), pantalla de un pack (lista ordenada; tocar abre la
canción con el `key`/`capo` del pack aplicados como transposición temporal y
las `notes` visibles), y **modo concierto**: pasar a la siguiente/anterior
canción del pack con un gesto, sin volver a la lista.

### Modo Villancicos Solidarios / fork «MCM Cantoral»

La idea es poder sacar un fork de la app (MCM Cantoral) o un modo dentro de
ella centrado en el cantoral. Para que el fork sea barato, que el código de la
Fase 1 no dé nada por supuesto:

- Qué categorías se ven y en qué orden debería salir de **una configuración**
  (p.ej. `cantoralConfig = { categories: 'all' | string[], featuredCategory?: 'navidad', packs: boolean, theme }`),
  no de condiciones repartidas por las pantallas. Así, el fork o un «modo
  Navidad» temporal = otra configuración: Navidad primero (con sus
  subcategorías y las canciones prestadas), packs a mano, tema navideño.
- Las subcategorías y `alsoIn` ya hacen el resto: una canción de Himnos que se
  canta en Navidad sale en los dos sitios sin tocar datos.
