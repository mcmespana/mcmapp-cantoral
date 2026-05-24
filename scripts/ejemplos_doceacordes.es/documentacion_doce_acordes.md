Instrucciones para extracción de datos de doceacordes.es
Objetivo
Dado el ID o la URL de una canción, extraer todos sus metadatos (excepto la letra/acordes).
URL de cada canción
https://doceacordes.es/cancion/{ID}

Datos disponibles y cómo extraerlos
Tras cargar la página, ejecutar el siguiente script en el DOM:
javascript// 1. ARTISTA Y TÍTULO (del header de página)
const pageHeader = document.querySelector('.page-header');
const headerLines = pageHeader?.innerText?.trim().split('\n').map(s => s.trim()).filter(Boolean);
const artist = headerLines?.[0];   // ej: "HAKUNA GROUP MUSIC"
const title  = headerLines?.[1];   // ej: "¿Por qué lloras?"

// 2. VIDEO EMBEBIDO (el que se muestra en la página)
const iframeSrc = document.querySelector('iframe[src*="youtube"]')?.src || null;
// Formato: "https://www.youtube.com/embed/VIDEO_ID"
// Para obtener el VIDEO_ID: iframeSrc?.match(/embed\/([a-zA-Z0-9_-]+)/)?.[1]

// 3. LINKS DE YOUTUBE adicionales (con su etiqueta, ej: "Alternativo", "Original"...)
const ytLinks = Array.from(document.querySelectorAll('a[href*="youtube.com"]'))
  .map(a => ({ label: a.textContent.trim(), url: a.href }));

// 4. METADATOS del panel lateral (todos los campos clave-valor)
const ul = document.querySelector('iframe[src*="youtube"]')
             ?.closest('.card')?.querySelector('ul.list-group')
           ?? document.querySelector('.card ul.list-group');

const meta = {};
const fiestas = [];
Array.from(ul?.children || []).forEach(el => {
  if (el.tagName === 'A') return; // son los links de YouTube, ya procesados
  const b = el.querySelector('b');
  const i = el.querySelector('i');
  const badge = el.querySelector('.badge');
  if (b && i) meta[b.textContent.trim()] = i.textContent.trim();
  else if (badge) fiestas.push(badge.textContent.trim());
});
// meta puede contener: "Álbum", "Momento", "Tiempo litúrgico", "Comentario"
// fiestas: array de strings, ej: ["Vigilia Pascual"]

// 5. CEJILLA y RITMO (en el footer de la card)
const footerText = document.querySelector('.card-footer')?.innerText?.trim() || '';
const capo  = footerText.match(/Cejilla:\s*(\d+)/)?.[1] || null;
const ritmo = footerText.match(/Ritmo:\s*([^\n]+)/)?.[1]?.trim() || null;
const parroquia = footerText.match(/Parroquia\s+(.+)/)?.[1]?.split('\n')[0]?.trim() || null;

// RESULTADO FINAL
const result = {
  id:        window.location.pathname.match(/\/cancion\/(\d+)/)?.[1],
  title,
  artist,
  capo,          // número de cejilla, o null si no tiene
  ritmo,         // descripción del ritmo, o null
  parroquia,     // parroquia que la subió
  video_embed:   iframeSrc,   // URL del iframe embebido
  youtube_links: ytLinks,     // links adicionales con etiqueta
  album:         meta['Álbum'] || null,
  momento:       meta['Momento'] || null,
  tiempo_liturgico: meta['Tiempo litúrgico'] || null,
  comentario:    meta['Comentario'] || null,
  fiestas,       // ej: ["Vigilia Pascual"]
  url_chordpro:  `https://doceacordes.es/cancion/${window.location.pathname.match(/\/cancion\/(\d+)/)?.[1]}/chordpro`,
  url_word:      `https://doceacordes.es/cancion/${window.location.pathname.match(/\/cancion\/(\d+)/)?.[1]}/word`,
};

Campos que pueden estar ausentes (son opcionales en la web)
Todos los campos pueden ser null o array vacío si la canción no los tiene. Los más frecuentemente ausentes son capo, ritmo, tiempo_liturgico y fiestas.

Ejemplo de output para canción ID 1699
json{
  "id": "1699",
  "title": "¿Por qué lloras?",
  "artist": "HAKUNA GROUP MUSIC",
  "capo": "2",
  "ritmo": "parones+rasgueo",
  "parroquia": "San Bruno",
  "video_embed": "https://www.youtube.com/embed/kVb4E74Ihcg",
  "youtube_links": [
    { "label": "Alternativo", "url": "https://www.youtube.com/watch?v=CsD5HT5XLYA" },
    { "label": "Alternativo", "url": "https://www.youtube.com/watch?v=-QsgleTDHPs" }
  ],
  "album": "Capricho, 2023",
  "momento": "Post-Comunión/Acción de gracias",
  "tiempo_liturgico": "Semana Santa",
  "comentario": "María Magdalena",
  "fiestas": ["Vigilia Pascual"],
  "url_chordpro": "https://doceacordes.es/cancion/1699/chordpro",
  "url_word": "https://doceacordes.es/cancion/1699/word"
}

Notas importantes

La web no requiere autenticación para leer canciones.
No hay rate limiting aparente, pero se recomienda un delay de ~200ms entre peticiones si se hacen varias seguidas.
El video_embed y los youtube_links son independientes: el embed es el video que aparece reproducible en la página; los links son accesos directos adicionales, y pueden no coincidir (son versiones alternativas).
Los IDs van del 1 al ~1778 pero hay huecos (canciones eliminadas); una petición a un ID inexistente devuelve 404.