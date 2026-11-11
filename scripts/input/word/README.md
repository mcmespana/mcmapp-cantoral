# Word pendiente de importar — «Letras con acordes guitarra»

`Letras con acordes guitarra.docx`: 8 canciones de autoras de la familia
Consolación, con letra y acordes de guitarra. Son canciones del **cantoral
normal** (no van a una sección aparte como los Villancicos Solidarios): cuando
se importen, cada una irá a su categoría de `songs/` como un `.cho` más.

**Estado: sin importar.** Nada lee este archivo automáticamente (el admin solo
busca `.tex` en `scripts/input/*`), así que no aparece en ninguna pestaña.

| # | Canción | Autoría | En el cantoral |
|---|---------|---------|----------------|
| 1 | La fuerza de un sueño | Belén Raigal | No |
| 2 | La cesta verde | Marisa Arrufat | No |
| 3 | Haciendo el bien | Paula Marán | No |
| 4 | 70 veces 7 | Belén Raigal | No |
| 5 | A tu modo | Letra: María Teresa Collado · Música: Alejandro Balfagó | No |
| 6 | Sin palabras | Marisa Arrufat | No |
| 7 | El amor no tiene fronteras | Inma Vírseda | **Sí**: `songs/I. Comunión/36. El amor no tiene fronteras.cho` (pendiente de comparar con la versión del Word) |
| 8 | La fuerza del Evangelio | Paula Marán | No |

## Notas para cuando se importen

- Acordes en notación española, con los **menores en minúscula**: `rem` = `Dm`,
  `fam` = `Fm`, `sol#m` = `G#m`, `do#m` = `C#m`, `FA#` = `F#`…
- Los acordes van en la línea de encima, alineados con espacios (formato
  «tab»): sirve `scripts/tab2chordpro.py` o el «✨ Añadir canción» del admin.
- Los estribillos están en MAYÚSCULAS → `{soc}`/`{eoc}` (o `{chorus}` en las
  repeticiones) y la letra en minúscula normal.
- Los títulos llevan numeración con emoji («1️.») que hay que quitar.
- Una vez importadas, mover este Word a `scripts/input/processed/`.
