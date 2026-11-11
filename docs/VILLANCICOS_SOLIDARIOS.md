# 🎄 Villancicos Solidarios — migración, subcategorías y packs

Guía de cómo entra en el cantoral todo lo de los Villancicos Solidarios y de
cómo se preparan los bloques («packs») del evento. El contrato de datos está en
`docs/CAMPOS_CANCIONES.md` §5; lo que tiene que hacer la app, en
`docs/PROMPT_APP_NAVIDAD.md`.

## 1. El modelo en dos frases

- Todo lo de Navidad vive en la categoría **N. Navidad**, partida en
  **subcategorías** (`{subcategoria: …}` en el `.cho`, catálogo en
  `songs/indice.json`):

  | slug | título | siglas | para qué |
  |------|--------|--------|----------|
  | `clasicos` | Villancicos clásicos | VC ⭐ | Tradicionales y populares de toda la vida. |
  | `actuales` | Villancicos actuales | VA ✨ | Villancicos nuevos, de grupos y cantautores de ahora. |
  | `versiones` | Versiones navideñas | VN 🎤 | Canciones de Navidad de la radio y adaptaciones de canciones conocidas. |
  | `otras` | Otras canciones | OC 🎶 | Las que se cantan en el evento sin ser de Navidad. |

  Títulos, siglas, emoji y orden se cambian en `indice.json` sin tocar ningún `.cho`.
- Una canción que ya está en el cantoral normal **no se copia**: se marca con
  `{tambien_en: navidad/otras}` y sale también en Navidad (y al revés: una de
  Navidad puede salir también en Himnos con `{tambien_en: himnos}`). Así nunca
  hay dos versiones que se desincronizan.

Todo se hace desde el admin: **🎄 Villancicos** en el menú.

## 2. Las tres fuentes y cómo se migra cada una

### 2.1 Word «Canciones nuevas» (las 19–66) → 📄 Importar del Word

`scripts/villancicos/Cantoral Villancicos Solidarios - Canciones Nuevas.docx`
(es el Google Doc exportado; **⟳ Traer la última versión** lo vuelve a bajar
pegando su enlace). El importador es `scripts/villancicos_docx.py` y está hecho
para las manías de ESE documento:

| En el Word | En el `.cho` |
|---|---|
| `19 - Hoy ha Nacido C/0` (estilo título) | `{title: Hoy ha Nacido}`, número de fichero 19, `{capo:}` si no es 0. `C/ 2 - 4` → cejilla 2 y un aviso. |
| Subtítulo gris bajo el título | `{artist:}` (las bromas tipo «Suuuuu» no, se avisan) |
| Acordes en un párrafo **a la izquierda** con espacios y letra **centrada** | Se miden las dos líneas en píxeles (Carlito = Calibri, con su negrita) cada una con su alineación, y cada acorde va a su sílaba. Comprobado contra las posiciones reales del PDF. |
| Dos columnas (tabla o sección) | En orden. Si una canción sigue arriba de la columna derecha, se pega a la suya y se avisa. |
| **Negrita** en toda la línea | Estribillo: `{soc}` … `{eoc}`, y de MAYÚSCULAS a normal (Dios, Señor, Belén… con mayúscula). |
| *Cursiva* | `<i>…</i>`: 2ª voz, eco, la parte del otro grupo. |
| <u>Subrayado</u> | `<u>…</u>`: altas / bajas. |
| Negrita en parte de una línea | `<b>…</b>` (énfasis, la respuesta del grupo…). |
| Nota pequeña / a la derecha: «**Estrofa 1**: Se añade bombo batería» | `{c: Estrofa 1}` + `{arr: Se añade bombo batería}` |
| «Toda la canción: sim SOL RE LA», «INTRO → RE MI fa#m (x2)», «Estrofa: …» | `{c: Toda la canción}` + `[Bm] [G] [D] [A]` |
| «Nota C: Todo lo que esté en cursiva tiene 2ª voz» | `{c: Nota C: …}` |
| `[CLAP]`, `[CLAP CLAP]` dentro de la letra | `[*CLAP]`: anotación encima de la letra (no es un acorde: no se transporta). Si una estrofa entera venía en un renglón, se parte tras cada `[CLAP]`. |
| `(CAMPANA)` dentro de la letra | `[*campana]` |
| `[Golpes + riff 🎸]`, `(1parte: suave)`, `🎺🎺🎺` | `{arr: …}` |
| `ESTRIBILLO` suelto / «… ESTRIBILLO» al final | `{chorus}` |
| `la-`, `si-7` · `Sol+`, `LA+` · `SOL +7` · `SIB` · `FA(rem)` · `RE/FA#` | Am, Bm7 · G, A (aquí «+» es mayor) · G G7 · Bb · F (Dm) · D/F# |

Cada canción se crea con su `{comment: TO DO: PENDIENTE REVISIÓN ACORDES}`, su
`{fuente: Cantoral Villancicos Solidarios · Canciones nuevas (nº 19)}` (así se
sabe que ya está aunque se le cambie el título) y la pestaña **📄 Original**
del editor enseña la canción tal y como está en el Word.

**Qué mirar al revisar cada una** (lo que no puede saber una máquina):

1. Los avisos ⚠ que salen arriba (cejillas dobles, acordes raros, trozos que
   venían de la otra columna).
2. Que cada acorde caiga en su sílaba: el Word no siempre estaba bien alineado.
3. Estribillos: la negrita del Word a veces es énfasis, no estribillo
   (p. ej. en *Oh Happy Day* es la respuesta del coro).
4. Las cursivas: ¿2ª voz, eco o simplemente un pre-estribillo? Si es un
   pre-estribillo, mejor `{c: Pre-estribillo}` que cursiva.
5. Notas de broma o de ensayo («Repetimos la primera estrofa porque…»): fuera
   o a `{comentario:}`.
6. La subcategoría.

**Las que ya están en el cantoral normal** (salen como «↪ Ya en Comunión»…):
si es la misma canción, **↪ Tráela a Navidad** (no se duplica). Si la del Word
es otra versión (ej. *Hallelujah* navideño, que no es el de Aleluya), créala
igualmente.

`python scripts/villancicos_docx.py list|show 19|extract --all` hace lo mismo
desde la terminal (a `scripts/staging_villancicos/`, fuera de git).

### 2.2 Cantoral de 2008 (solo PDF, las 1–18 y más) → ✨ Añadir canción

`scripts/villancicos/Cantoral Villancicos Solidarios 2008 - Actualizado.pdf`:
escaneado, con acordes a mano encima de algunas, corchetes en el margen y
notación antigua (`la-`, `Sol+`, `c-3`). Se lee con Claude desde
**✨ Añadir canción → 📷 Foto o PDF** (ver §2.4 del README del admin y la
sección 5 de abajo).

### 2.3 Canciones que ya están en el cantoral normal

Pestaña **🎶 Canciones → ➕ Traer del cantoral normal**: buscas, eliges
subcategoría y **↪ Traer**. Se puede quitar igual («Quitar de Navidad»). Desde
el editor de cualquier canción, pestaña **📋 Datos extra → 🗂 Dónde sale**, se
hace lo mismo para cualquier categoría.

Del cantoral de 2008, ya están en el normal: *Somos Consolación*, *Gratis*,
*Alma misionera*, *Surgirá un mundo nuevo*… Esas se traen, no se importan.

### 2.4 Numeración

El número del fichero es el del cantoral de villancicos, el que la gente conoce
(«la 19»): las nuevas traen el suyo (19–66), las de 2008 van del 1 al 18 (el
importador no da esos números a otras) y el himno y *Feliz Navidad* pueden ir
en el 0. Se cambia con 🔀 Reordenar como en cualquier categoría.

## 3. Packs (playlists)

Los Villancicos Solidarios se cantan en **bloques de ~1 hora** (24 canciones,
con el himno y *Feliz Navidad* al principio y al final). Cada bloque es un pack:
`packs/<nombre>.json` en el repo (fuera de `songs/`, para no disparar el CI).

Pestaña **🎼 Packs** del admin:

- Lista de packs con su duración frente al objetivo (verde / naranja si se pasa).
- Editor: título, evento, fecha, objetivo en minutos y duración por defecto
  (2:30 si no se dice: caben ~24 por hora). Canciones con **la hora a la que
  empieza cada una**, tono y cejilla **de ese día** (no cambian la canción),
  duración (si la canción no tiene `{duracion:}`) y notas (🎺🎻 instrumentos…).
- Ordenar arrastrando (⠿) o con ▲▼; **⏸ Pausa** para presentaciones de la hucha;
  **⭐ Himno + Feliz Navidad** pone los cuatro de los extremos.
- Exportar: **📋 WhatsApp** (texto al portapapeles), **🖨 Lista** (con horas),
  **🖨 Cancionero** (cada canción con acordes, **ya en el tono del pack**,
  pintada con la hoja de la app, una por página) y **⬇ .md**.
- Las canciones se enlazan por `categoría/slug` (el fichero sin número: no se
  rompe al renumerar). Lo que aún no está en Navidad se queda «🔗 buscar» con el
  título del listado y **se enlaza solo, por el título, en cuanto se importa**
  (solo con canciones de Navidad o traídas a Navidad: la *Hallelujah* de Aleluya
  no vale por la navideña; se sugiere pero no se enlaza).

Ya están cargados los del **Edificio Hucha 2025** sacados de
`scripts/villancicos/Listado canciones Edificio Hucha 2025.docx`: Repertorio
(con tono, página del cantoral en papel e instrumentos), Mañana 1–2, Tarde 1–4 y
cuatro packs antiguos. Para el año que viene, con un listado igual:

```bash
python scripts/packs.py importar-listado "listado.docx" --evento "Villancicos Solidarios 2026 · …" --prefijo "2026"
```

`python scripts/packs.py list` y `python scripts/packs.py export <pack> [--md]`
funcionan sin el admin. Tests: `python scripts/test_packs.py`.

Publicarlos en la app (Firebase `songs/packs`) es la Fase 2 de
`docs/PROMPT_APP_NAVIDAD.md`: el formato resuelto ya está definido allí.

## 4. Formato con significado en el `.cho`

| Marca | Significa | En la app |
|---|---|---|
| `<i>…</i>` | 2ª voz / eco | Cuando la app lo pinte (`APP_MARKUP`, abajo). |
| `<u>…</u>` | altas / bajas | Ídem. |
| `<b>…</b>` | énfasis dentro de una línea | Ídem. |
| `[*CLAP]` | anotación encima de la letra | Ya se ve (como un acorde). |
| `{arr: …}` | indicación de arreglo (instrumentos, dinámica) | Ya se ve, a la derecha, y se puede ocultar. |
| `{c: Estrofa 1}` / `{c: Nota C: …}` | etiqueta de sección / nota | Ya se ve. |

Las etiquetas de marcado no cruzan nunca de una línea a otra. Mientras la app no
las pinte, `scripts/chordpro.py` tiene `APP_MARKUP = False` y
`crear_songs_json.py` las quita del JSON (los `.cho` las guardan). Cuando la app
esté actualizada: `APP_MARKUP = True` y aparecen solas.

## 5. Lo que queda para el fork «MCM Cantoral»

Todo lo de aquí está pensado para que un fork de la app centrado en el cantoral
(o un «modo Navidad» dentro de MCM App) sea solo configuración: Navidad con sus
subcategorías y sus canciones prestadas, y los packs. Ver la Fase 2 de
`docs/PROMPT_APP_NAVIDAD.md`.
