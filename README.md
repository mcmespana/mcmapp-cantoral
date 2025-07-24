# conversor-acordes
Conversor de acordes en formato tabulado a formato Chord Pro
## Automatizaci\xC3\xB3n de songs.json

Este repositorio incluye un flujo de trabajo de GitHub Actions que genera
autom\xC3\xA1ticamente la \xC3\xBAltima versi\xC3\xB3n de `songs.json` y la publica en Firebase.
El flujo solo se ejecuta cuando se env\xC3\xADan cambios a la carpeta `songs` en la rama `main`. Cuando esto ocurre se realizan las siguientes acciones:

1. Se ejecuta `scripts/crear_songs_json.py` para crear un nuevo archivo
   `songs-vX.json` en la carpeta `songs`.
2. Si se ha generado un nuevo archivo, se confirma y sube el cambio al repositorio.
3. El archivo resultante se env\xC3\xADa a la base de datos de Firebase y se
   actualiza el campo `songs/updatedAt` con la marca de tiempo actual.

Para que la publicaci\xC3\xB3n en Firebase funcione es necesario definir dos
**Secrets** en el repositorio de GitHub:

- `FIREBASE_URL`: URL base de la Realtime Database (por ejemplo
  `https://tu-proyecto.firebaseio.com`).
- `FIREBASE_TOKEN`: token con permisos de escritura en la base de datos.

Una vez configurados, cada cambio en la carpeta `songs` que se env\xC3\xADe a `main`
generar\xC3\xA1 la nueva versi\xC3\xB3n de `songs.json`, la subir\xC3\xA1 al repositorio
y actualizar\xC3\xA1 Firebase de forma autom\xC3\xA1tica, pero los commits autom\xC3\xA1ticos
que solo contengan `songs-v*.json` no volver\xC3\xA1n a lanzar el flujo.
