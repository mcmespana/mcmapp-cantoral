// Cantoral Admin - Alpine.js single-page app
// Phase 3a/3b: catalog + raw editor + import. Visual drag&drop comes in 3c.

// ─────────── YouTube: embed por dentro, link normal por fuera ───────────
// Espejo de scripts/chordpro.py (to_youtube_embed / to_youtube_watch). Si se
// cambia el criterio en un lado hay que cambiarlo en el otro.
const YT_ID_RE = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i;
const YT_START_RE = /[?&](?:start|t)=(\d+h)?(\d+m)?(\d+)s?(?:&|$)/i;

function youtubeId(url) {
  const m = YT_ID_RE.exec(String(url || ''));
  return m ? m[1] : '';
}
function youtubeStartSeconds(url) {
  const m = YT_START_RE.exec(String(url || ''));
  if (!m) return 0;
  let total = parseInt(m[3] || '0', 10);
  if (m[2]) total += parseInt(m[2], 10) * 60;
  if (m[1]) total += parseInt(m[1], 10) * 3600;
  return total;
}
// Lo que no es de YouTube (Vimeo, un mp3, Drive…) se devuelve intacto.
function toYoutubeEmbed(url) {
  const raw = String(url || '').trim();
  const id = youtubeId(raw);
  if (!id) return raw;
  const s = youtubeStartSeconds(raw);
  return 'https://www.youtube.com/embed/' + id + (s ? '?start=' + s : '');
}
function toYoutubeWatch(url) {
  const raw = String(url || '').trim();
  const id = youtubeId(raw);
  if (!id) return raw;
  const s = youtubeStartSeconds(raw);
  return 'https://www.youtube.com/watch?v=' + id + (s ? '&t=' + s : '');
}

// ─────────── Etiquetas: slug y picker reutilizable ───────────
// Espejo de `slugify_tag` en scripts/chordpro.py. Si cambia el criterio en un
// lado hay que cambiarlo en el otro (igual que con los helpers de YouTube).
function slugifyTag(raw) {
  return String(raw || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
function prettyTagLabel(slug) {
  const w = String(slug || '').replace(/-/g, ' ').trim();
  return w ? w.charAt(0).toUpperCase() + w.slice(1) : '';
}

/**
 * Picker de etiquetas: chips + input con autocompletado. Se usa en el editor de
 * una canción, en la barra de acciones masivas y al importar.
 *
 * No guarda la lista: la lee y la escribe con los callbacks que le pasa quien
 * lo monta (`get`/`set`), así el estado sigue viviendo donde tenga sentido.
 * `all` devuelve el catálogo global para autocompletar — que es lo único que
 * frena de verdad la degeneración del vocabulario (viejunas/viejuna/antiguas).
 */
function tagPicker(opts) {
  return {
    q: '',
    open: false,
    hi: 0,
    tpGet: opts.get,
    tpSet: opts.set,
    tpAll: opts.all || (() => []),
    allowCreate: opts.allowCreate !== false,
    get tags() { return this.tpGet() || []; },
    get matches() {
      const mine = new Set(this.tags);
      const q = slugifyTag(this.q);
      let list = (this.tpAll() || []).filter((t) => !mine.has(t.slug));
      if (q) {
        list = list.filter((t) => t.slug.includes(q)
          || slugifyTag(t.label).includes(q)
          || (t.alias || []).some((a) => a.includes(q)));
      }
      return list.slice(0, 8);
    },
    // Solo se ofrece crear si de verdad no existe: si ya existe, el
    // autocompletado la propone y no se duplica el vocabulario.
    get canCreate() {
      const s = slugifyTag(this.q);
      if (!s || !this.allowCreate) return false;
      if (this.tags.includes(s)) return false;
      return !(this.tpAll() || []).some((t) => t.slug === s);
    },
    get rowCount() { return this.matches.length + (this.canCreate ? 1 : 0); },
    add(slug) {
      const s = slugifyTag(slug);
      if (!s || this.tags.includes(s)) { this.q = ''; return; }
      this.tpSet([...this.tags, s]);
      this.q = '';
      this.hi = 0;
      this.open = false;
    },
    remove(slug) { this.tpSet(this.tags.filter((t) => t !== slug)); },
    onFocus() { this.open = true; this.hi = 0; },
    onInput() { this.open = true; this.hi = 0; },
    pickHighlighted() {
      const m = this.matches;
      if (this.hi < m.length) { this.add(m[this.hi].slug); return; }
      if (this.canCreate) this.add(this.q);
    },
    onKey(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); this.open = true; this.hi = Math.min(this.hi + 1, Math.max(this.rowCount - 1, 0)); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); this.hi = Math.max(this.hi - 1, 0); return; }
      if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
        if (!this.q.trim() && e.key !== 'Enter') return;
        if (!this.q.trim()) return;
        e.preventDefault();
        this.pickHighlighted();
        return;
      }
      if (e.key === 'Escape') { this.open = false; return; }
      // Retroceso con el input vacío quita la última: lo que uno espera.
      if (e.key === 'Backspace' && !this.q && this.tags.length) {
        this.remove(this.tags[this.tags.length - 1]);
      }
    },
  };
}

// Memo del filtro de doceacordes. Vive fuera del objeto Alpine a propósito: si
// fuese estado reactivo, escribirlo desde filteredDoce() (que se llama durante
// el render) dispararía otro render y entraríamos en bucle.
let _doceFilterMemo = null;
// Ids ya enviados a /api/doce/prefetch en esta sesión: evita repetir la
// petición cada vez que el ratón vuelve a pasar por la misma fila.
const _docePrefetched = new Set();

// Tope del historial de deshacer. Guardamos el .cho entero por paso, así que
// 60 pasos de una canción normal son unos pocos cientos de KB.
const UNDO_LIMIT = 60;

function app() {
  return {
    // ─────────── State ───────────
    view: 'dashboard',
    theme: localStorage.theme || 'light',
    loading: false,
    error: null,
    data: null,
    building: false,
    buildResult: '',

    // Catalog filters
    categoryFilter: '',
    search: '',
    statusFilter: '',       // '' | 'revisar' | 'revisar_acordes' | 'any' | 'none'
    mediaFilter: '',        // '' | 'no_youtube' | 'no_audio' | 'no_media' | 'any_media'
    tagFilter: '',          // '' | '__none__' | '__any__' | <slug>
    onlyInRepoFilter: false,
    selectedCatalogPaths: new Set(),
    bulkMoveCategory: '',         // categoría destino para mover en bloque
    bulkMoving: false,

    // Quick add link modal
    quickLink: { open: false, path: '', songTitle: '', type: '', label: '', url: '',
                 existing: [], saving: false },
    // ── Etiquetas ──
    // Catálogo global (declaradas + descubiertas en los .cho, con su recuento).
    // Se carga una vez y se refresca solo cuando algo lo cambia.
    allTags: [],
    tagsLoading: false,
    tagSearch: '',
    tagOnlyUndeclared: false,
    tagEdit: null,            // slug en edición en la pestaña 🏷
    tagForm: { label: '', emoji: '', destacada: false, orden: '', alias: [] },
    tagSaving: false,
    tagSongs: [],             // canciones de la etiqueta seleccionada
    tagMerge: { into: '', mode: 'alias' },
    bulkTagsAdd: [],          // etiquetas a poner en bloque desde el catálogo
    bulkTagsRemove: [],
    bulkTagging: false,
    importCommonTags: [],     // etiquetas a aplicar a todo lo que se importe
    importTagsById: {},       // docx_id → etiquetas elegidas para esa canción
    importSuggestions: {},    // docx_id → sugerencias del backend

    // Editor multimedia tab
    mediaForm: { rhythm: '', album: '', liturgicalTime: '', source: '', videoEmbed: '',
                 comment: '', youtubeLinks: [], audioLinks: [], tags: [] },
    mediaOriginal: '',
    mediaDirty: false,
    mediaSaving: false,

    // Import view (docx)
    importSearch: '',
    importSectionFilter: '',
    selectedImports: new Set(),
    importing: false,
    importResults: [],
    docxPreview: null,
    importIgnored: [],
    showIgnored: false,

    // Import view (LaTeX)
    latexItems: [],
    latexLoading: false,
    latexSearch: '',
    latexFolderFilter: '',
    latexMatchFilter: '',
    selectedLatex: new Set(),
    latexImportMode: {},        // { latex_id: 'overwrite' | 'new' }
    latexCategoryOverride: {},  // { latex_id: 'A' | '' }
    importingLatex: false,
    latexResults: [],
    latexPreview: null,

    // Doceacordes
    doceItems: [],
    doceLoading: false,
    doceSearch: '',
    doceMatchFilter: '',
    docePage: 0,
    docePageSize: 50,
    doceCategorySel: {},      // { doce_id: 'A' }
    doceNumberSel: {},        // { doce_id: 12 }
    doceSuggestedNumber: {},  // { doce_id: 7 }
    docePositionHint: {},     // { doce_id: 22 } proveniente de cantoral DOCX
    doceCantoralKey: {},      // { doce_id: 'D' } tono que tenía en el cantoral DOCX
    doceResults: [],
    doceImporting: false,
    doceIncludeMeta: true,
    docePreview: null,
    docePreviewCategory: '',
    docePreviewReloading: false,
    doceKeyConflict: null,    // { cantoralKey, doceKey } cuando los tonos difieren
    doceKeyResolved: false,   // true cuando el usuario eligió un tono
    doceCandidatesPopover: null,  // {missingId, anchor, candidates, sectionLetter}
    selectedDoce: new Set(),      // ids marcados para importar en lote
    doceBulkCategory: '',         // categoría a aplicar a toda la selección
    doceBatchProgress: null,      // {done, total} mientras importa en lote
    // Canción del cantoral que estamos emparejando a mano en doceacordes:
    // {title, sectionLetter, positionHint, key}
    doceManualSearchFor: null,
    moveModal: null,              // {path, title, fromLetter, targetLetter, number, suggested, saving}

    // Reorder
    reorderCategory: '',
    reorderSlots: [],              // [{number, filename, title, gap: bool}]
    reorderOriginal: '',
    reorderDragIdx: null,

    // Editor
    editor: {
      path: null,
      filename: null,
      content: '',
      originalContent: '',
      dirty: false,
      tab: 'raw',
      meta: { title: '', artist: '', key: '', capo: 0, has_todo: false, has_chord_review: false },
      parsed: [],
    },
    visualAddMode: false,
    arrMode: false,
    // Densidad del documento visual. Los acordes se posicionan midiendo los
    // caracteres ya renderizados, así que cambiar tamaños es seguro siempre que
    // se vuelva a llamar a layoutChords() después.
    visualDense: localStorage.visualDense === '1',
    visualSelectedChord: null,
    visualSelectedLines: new Set(),
    visualLastClickedLine: null,
    visualChordClipboard: null,   // [{lyric, chords}]  patrón copiado
    visualLineClipboard: null,    // bloque de líneas completas copiado (letra + acordes)
    pasteLines: { open: false, text: '', asChorus: false },  // modal de pegar texto
    lineDrag: null,               // {moving:[idx], over, startY, moved} al arrastrar líneas
    undoStack: [],                // contenidos anteriores del .cho
    redoStack: [],
    clipboardInfo: '',            // texto persistente cuando hay acordes copiados
    showHelp: false,
    // Cola de revisión: tras importar varias, abre el editor en secuencia
    editorQueue: [],            // [{path, source, label}]
    editorQueueIdx: 0,
    newSong: { open: false, category: '', title: '', artist: '', key: '', capo: 0,
               number: null, mode: 'blank', content: '', creating: false },
    // Selector visual de número de canción.
    // {category, categoryTitle, numbers, suggested, selected, target, loading}
    numberPicker: null,
    saveIndicator: { text: 'Sin cambios', cls: 'saved' },
    lastSaveAt: null,

    // Backups
    backups: { sessions: [], total_size_bytes: 0, loading: false, keepLast: 5 },

    // Peticiones de la gente (solicitudes de canciones + fallitos desde Firebase)
    peticiones: {
      loading: false, refreshing: false, committing: false, loaded: false,
      updatedAt: null,
      solicitudes: [], fallitos: [],
      counts: { solicitudes_total: 0, solicitudes_pendientes: 0,
                fallitos_total: 0, fallitos_pendientes: 0 },
      message: '', error: null,
    },

    // Estado de git (indicador en la barra lateral)
    git: { branch: '', ahead: 0, behind: 0, dirty: false, changedCount: 0,
           changedFiles: [], hasUpstream: true, loading: false, error: null },
    gitModal: null,  // { message, saving, result }

    // ─────────── Lifecycle ───────────
    async boot() {
      this.$watch('editor.dirty', (v) => {
        if (v) this.setSaveIndicator('dirty', '● Sin guardar — pulsa 💾');
      });
      // Atajos globales del editor: Ctrl/Cmd+S guardar, Ctrl/Cmd+Z deshacer,
      // Ctrl/Cmd+Shift+Z o Ctrl+Y rehacer.
      window.addEventListener('keydown', (e) => {
        if (!this.editor.path) return;
        if (!(e.ctrlKey || e.metaKey)) return;
        const k = e.key.toLowerCase();
        if (k === 's') {
          e.preventDefault();
          this.saveSong();
          return;
        }
        // Dentro de un campo de texto manda el undo del navegador: si lo
        // secuestrásemos, no se podría deshacer lo que se está escribiendo.
        const el = e.target;
        const tag = (el && el.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea' || (el && el.isContentEditable)) return;
        if (k === 'z') {
          e.preventDefault();
          if (e.shiftKey) this.redoEdit(); else this.undoEdit();
        } else if (k === 'y') {
          e.preventDefault();
          this.redoEdit();
        }
      });
      await this.loadCatalog();
      // El catálogo de etiquetas se carga a la vez: lo usan el autocompletado
      // del editor, la barra de acciones masivas y las sugerencias de import.
      this.loadTags();
      // Estado de git: al arrancar (con fetch) y luego cada 90s.
      this.loadGitStatus(true);
      setInterval(() => this.loadGitStatus(true), 90000);
    },

    // ─────────── Git: estado + commit/push rápido ───────────
    async loadGitStatus(fetch_ = false) {
      this.git.loading = true;
      try {
        const r = await fetch('/api/git/status' + (fetch_ ? '?fetch=1' : ''));
        const j = await r.json();
        if (j.ok) {
          this.git = {
            ...this.git,
            branch: j.branch, ahead: j.ahead, behind: j.behind,
            dirty: j.dirty, changedCount: j.changed_count,
            changedFiles: j.changed_files || [], hasUpstream: j.has_upstream,
            error: null,
          };
        } else {
          this.git.error = j.error || 'error';
        }
      } catch (e) {
        this.git.error = e.message;
      } finally {
        this.git.loading = false;
      }
    },
    // ¿Hay algo que avisar? (cambios sin guardar, commits sin subir, o rama desfasada)
    gitNeedsAttention() {
      return this.git.dirty || this.git.ahead > 0 || this.git.behind > 0;
    },
    gitStatusLabel() {
      const g = this.git;
      if (g.error) return '⚠ Guardado en la nube no disponible';
      if (g.behind > 0 && (g.dirty || g.ahead > 0))
        return '⚠ Hay novedades en la nube y tú tienes cambios sin guardar';
      if (g.behind > 0) return '🔄 Hay novedades en la nube sin descargar';
      if (g.dirty || g.ahead > 0) {
        const n = g.dirty ? g.changedCount : g.ahead;
        return `📤 Tienes ${n} cambio${n === 1 ? '' : 's'} sin guardar en la nube`;
      }
      return '✓ Todo guardado en la nube';
    },
    openGitCommit() {
      this.gitModal = { message: '', saving: false, result: null };
    },
    async doGitCommit() {
      const m = this.gitModal;
      if (!m || !m.message.trim()) { alert('Escribe qué cambios has hecho'); return; }
      m.saving = true;
      m.result = null;
      try {
        const r = await fetch('/api/git/commit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: m.message.trim() }),
        });
        const j = await r.json();
        if (!j.ok) throw new Error(j.error || 'Error en commit/push');
        m.result = 'ok';
        await this.loadGitStatus(true);
        // Cerrar tras un momento para que se vea el ✓
        setTimeout(() => { if (this.gitModal && this.gitModal.result === 'ok') this.gitModal = null; }, 1200);
      } catch (e) {
        m.result = 'error';
        alert('No se pudo: ' + e.message);
      } finally {
        m.saving = false;
      }
    },

    // `quiet`: recarga sin encender el spinner, para reconciliar en segundo plano
    // después de haber parcheado el catálogo a mano.
    async loadCatalog(quiet = false) {
      if (!quiet) this.loading = true;
      this.error = null;
      try {
        const r = await fetch('/api/catalog');
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this.data = await r.json();
      } catch (e) {
        if (!quiet) this.error = 'No pude cargar el catálogo: ' + e.message;
      } finally {
        if (!quiet) this.loading = false;
      }
    },
    // Tras importar, mete las canciones nuevas en el catálogo que ya está en
    // pantalla y sigue. Antes se esperaba al /api/catalog completo (que recalcula
    // el emparejado de TODO el repo) sólo para añadir una fila, y hasta que no
    // volvía no se abría el editor. Los contadores que dependen de estas listas
    // se recalculan aquí; del resto se encarga la reconciliación de after.
    async patchCatalogWith(paths) {
      const list = (paths || []).filter(Boolean);
      if (!list.length || !this.data) return;
      try {
        const r = await fetch('/api/catalog/rows?paths=' + encodeURIComponent(list.join('|')));
        if (!r.ok) return;
        const { rows } = await r.json();
        if (!rows || !rows.length) return;
        const byPath = new Map(this.data.repo_songs.map(s => [s.path, s]));
        rows.forEach(row => byPath.set(row.path, row));
        const merged = [...byPath.values()];
        // Las que acaban de entrar ya no "faltan del cantoral".
        const docxIds = new Set(rows.map(x => x.docx_id).filter(v => v != null));
        const missing = (this.data.missing_from_repo || [])
          .filter(m => !docxIds.has(m.docx_id));
        this.data = {
          ...this.data,
          repo_songs: merged,
          missing_from_repo: missing,
          stats: {
            ...this.data.stats,
            repo_total: merged.length,
            missing_from_repo: missing.length,
            todo_count: merged.filter(s => s.has_todo).length,
            chord_review_count: merged.filter(s => s.has_chord_review).length,
            only_in_repo: merged.filter(s => !s.in_docx).length,
          },
        };
      } catch (e) { /* si falla, la recarga de fondo lo arregla */ }
    },
    // Parcheo inmediato + reconciliación completa en segundo plano (sin await:
    // el editor se abre ya, y los contadores exactos llegan un instante después).
    async refreshCatalogAfterImport(paths) {
      await this.patchCatalogWith(paths);
      this.loadCatalog(true);
    },

    // ─────────── Helpers ───────────
    countByCat(letter) {
      if (!this.data) return 0;
      return this.data.repo_songs.filter(r => r.category_letter === letter).length;
    },
    categoryName(letter) {
      const c = this.data && this.data.categories.find(c => c.letter === letter);
      return c ? c.title : letter;
    },
    normalizeSearch(s) {
      return (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    },

    // ─────────── Catalog filtering ───────────
    filteredRepoSongs() {
      if (!this.data) return [];
      let list = this.data.repo_songs;
      if (this.categoryFilter) list = list.filter(r => r.category_letter === this.categoryFilter);
      if (this.statusFilter === 'revisar')         list = list.filter(r => r.has_todo);
      else if (this.statusFilter === 'revisar_acordes') list = list.filter(r => r.has_chord_review);
      else if (this.statusFilter === 'any')         list = list.filter(r => r.has_todo || r.has_chord_review);
      else if (this.statusFilter === 'none')        list = list.filter(r => !r.has_todo && !r.has_chord_review);
      if (this.onlyInRepoFilter) list = list.filter(r => !r.in_docx);
      if (this.mediaFilter === 'no_youtube') {
        list = list.filter(r => (r.youtube_count || 0) === 0 && !r.has_video);
      } else if (this.mediaFilter === 'no_audio') {
        list = list.filter(r => (r.audio_count || 0) === 0);
      } else if (this.mediaFilter === 'no_media') {
        list = list.filter(r => (r.youtube_count || 0) === 0 && !r.has_video && (r.audio_count || 0) === 0);
      } else if (this.mediaFilter === 'any_media') {
        list = list.filter(r => (r.youtube_count || 0) > 0 || r.has_video || (r.audio_count || 0) > 0);
      }
      if (this.tagFilter === '__none__') {
        list = list.filter(r => !(r.tags || []).length);
      } else if (this.tagFilter === '__any__') {
        list = list.filter(r => (r.tags || []).length > 0);
      } else if (this.tagFilter) {
        list = list.filter(r => (r.tags || []).includes(this.tagFilter));
      }
      if (this.search) {
        const q = this.normalizeSearch(this.search);
        // El buscador también mira las etiquetas: escribir "ramos" saca las
        // etiquetadas aunque no lleven la palabra en el título (igual que en
        // la app).
        list = list.filter(r =>
          this.normalizeSearch(r.title).includes(q) ||
          this.normalizeSearch(r.artist).includes(q) ||
          (r.tags || []).some(t => this.normalizeSearch(this.tagLabelOf(t)).includes(q)
                                || t.includes(q))
        );
      }
      return list;
    },

    // ─────────── Import view ───────────
    filteredMissing() {
      if (!this.data) return [];
      let list = this.data.missing_from_repo;
      if (this.importSectionFilter) list = list.filter(m => m.section_letter === this.importSectionFilter);
      if (this.importSearch) {
        const q = this.normalizeSearch(this.importSearch);
        list = list.filter(m => this.normalizeSearch(m.title).includes(q));
      }
      return list;
    },
    toggleImport(id) {
      if (this.selectedImports.has(id)) this.selectedImports.delete(id);
      else this.selectedImports.add(id);
      // Force Alpine refresh
      this.selectedImports = new Set(this.selectedImports);
    },
    selectAllImport() {
      const ids = this.filteredMissing().map(m => m.docx_id);
      this.selectedImports = new Set([...this.selectedImports, ...ids]);
    },
    // Importar una sola del cantoral, sin pasar por la selección. Es el gesto
    // más habitual ("esta, tal y como viene") y antes obligaba a marcar el
    // checkbox y subir a la barra de acciones.
    async importOneDocx(docxId) {
      this.selectedImports = new Set([docxId]);
      await this.doImport();
    },
    // Para una canción del cantoral que el matching difuso no ha emparejado:
    // abrir doceacordes buscando su título a mano, conservando la sección y la
    // posición del cantoral como sugerencia.
    async searchDoceFor(missing) {
      this.view = 'doce';
      await this.loadDoce();
      this.doceSearch = missing.title;
      this.doceMatchFilter = '';
      this.docePage = 0;
      this.doceManualSearchFor = {
        title: missing.title,
        sectionLetter: missing.section_letter,
        positionHint: missing.position_in_section,
        key: missing.key,
      };
      this.prefetchDoceVisible();
    },
    // Aplica a una canción de doceacordes los datos del cantoral que traíamos
    // pendientes (sección, posición, tono) al emparejarla a mano.
    adoptManualSearchTarget(doceId) {
      const t = this.doceManualSearchFor;
      if (!t) return;
      // Se consume: sólo debe aplicarse a la canción que el usuario elija.
      this.doceManualSearchFor = null;
      if (t.positionHint) {
        this.docePositionHint = { ...this.docePositionHint, [doceId]: t.positionHint };
      }
      if (t.key) {
        this.doceCantoralKey = { ...this.doceCantoralKey, [doceId]: t.key };
      }
      if (t.sectionLetter && !this.doceCategorySel[doceId]) {
        this.doceCategorySel = { ...this.doceCategorySel, [doceId]: t.sectionLetter };
        return this.onDoceCategoryChange(doceId);
      }
    },
    async doImport() {
      if (this.selectedImports.size === 0) return;
      this.importing = true;
      this.importResults = [];
      try {
        const r = await fetch('/api/docx/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ids: [...this.selectedImports],
            // Las de la barra van a todas; las de cada fila, solo a la suya.
            tags: this.importCommonTags,
            tags_by_id: Object.fromEntries(
              [...this.selectedImports].map(id => [String(id), this.tagsForImport(id)])
                .filter(([, tags]) => tags.length > 0)),
          }),
        });
        const json = await r.json();
        this.importResults = json.results || [];
        this.selectedImports = new Set();
        this.importTagsById = {};
        await this.loadTags();
        const paths = this.importResults.filter(r => r.ok && r.path).map(r => r.path);
        await this.refreshCatalogAfterImport(paths);
        // Abrir editor de las importadas con éxito, en cola
        this.enqueueAndOpen(paths, 'del cantoral');
      } catch (e) {
        alert('Error importando: ' + e.message);
      } finally {
        this.importing = false;
      }
    },
    async importOne(id) {
      this.selectedImports = new Set([id]);
      await this.doImport();
      this.docxPreview = null;
    },
    async previewDocx(id) {
      try {
        const r = await fetch('/api/docx/preview?id=' + id);
        this.docxPreview = await r.json();
        this.docxPreview.id = id;
      } catch (e) {
        alert('No pude generar el preview: ' + e.message);
      }
    },
    async loadIgnored() {
      try {
        const r = await fetch('/api/docx/ignored');
        const d = await r.json();
        this.importIgnored = d.ignored || [];
      } catch (_) {
        this.importIgnored = [];
      }
    },
    async archiveSong(docx_id, title) {
      if (!confirm(`¿Archivar "${title}"?\nDesaparecerá de la lista de importar. Podrás restaurarla desde la sección "Archivadas".`)) return;
      try {
        const r = await fetch('/api/docx/ignore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ docx_id }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        await Promise.all([this.loadCatalog(), this.loadIgnored()]);
      } catch (e) {
        alert('Error: ' + e.message);
      }
    },
    async restoreSong(title_raw, title) {
      if (!confirm(`¿Restaurar "${title}"?\nVolverá a aparecer en la lista de importar.`)) return;
      try {
        const r = await fetch('/api/docx/ignore/' + encodeURIComponent(title_raw), { method: 'DELETE' });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        await Promise.all([this.loadCatalog(), this.loadIgnored()]);
      } catch (e) {
        alert('Error: ' + e.message);
      }
    },

    // ─────────── Import view (LaTeX) ───────────
    async loadLatex(force = false) {
      this.latexLoading = true;
      try {
        const r = await fetch('/api/latex/list' + (force ? '?force=1' : ''));
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const d = await r.json();
        this.latexItems = d.items || [];
        // Inicializar modo por defecto: si hay match, overwrite; si no, new
        for (const it of this.latexItems) {
          if (this.latexImportMode[it.id] == null) {
            this.latexImportMode[it.id] = it.repo_match ? 'overwrite' : 'new';
          }
          if (this.latexCategoryOverride[it.id] == null) {
            this.latexCategoryOverride[it.id] = '';
          }
        }
      } catch (e) {
        alert('No pude cargar los .tex: ' + e.message);
      } finally {
        this.latexLoading = false;
      }
    },
    async rescanLatex() {
      await fetch('/api/latex/rescan', { method: 'POST' });
      await this.loadLatex(true);
    },
    latexFolders() {
      const s = new Set(this.latexItems.map(l => l.latex_folder));
      return [...s].sort();
    },
    filteredLatex() {
      let list = this.latexItems;
      if (this.latexFolderFilter) list = list.filter(l => l.latex_folder === this.latexFolderFilter);
      if (this.latexMatchFilter === 'new') list = list.filter(l => !l.repo_match);
      else if (this.latexMatchFilter === 'match') list = list.filter(l => !!l.repo_match);
      else if (this.latexMatchFilter === 'warn') list = list.filter(l => l.unknown_chords.length > 0);
      if (this.latexSearch) {
        const q = this.normalizeSearch(this.latexSearch);
        list = list.filter(l => this.normalizeSearch(l.title).includes(q) || this.normalizeSearch(l.filename).includes(q));
      }
      return list;
    },
    filterLatexById(id) {
      this.latexSearch = '';
      this.latexFolderFilter = '';
      this.latexMatchFilter = '';
      // Pequeño truco para destacar visualmente
      this.$nextTick(() => {
        const row = document.querySelector(`[data-latex-id="${id}"]`);
        if (row) row.scrollIntoView({ block: 'center' });
      });
    },
    toggleLatex(id) {
      if (this.selectedLatex.has(id)) this.selectedLatex.delete(id);
      else this.selectedLatex.add(id);
      this.selectedLatex = new Set(this.selectedLatex);
    },
    selectAllLatex() {
      const ids = this.filteredLatex().map(l => l.id);
      this.selectedLatex = new Set([...this.selectedLatex, ...ids]);
    },
    setLatexMode(id, mode) {
      this.latexImportMode = { ...this.latexImportMode, [id]: mode };
    },
    async previewLatex(id) {
      try {
        const r = await fetch('/api/latex/preview?id=' + encodeURIComponent(id));
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this.latexPreview = await r.json();
      } catch (e) {
        alert('Error preview: ' + e.message);
      }
    },
    async importOneLatex(id) {
      this.selectedLatex = new Set([id]);
      await this.doImportLatex();
      this.latexPreview = null;
    },
    async doImportLatex() {
      if (this.selectedLatex.size === 0) return;
      this.importingLatex = true;
      this.latexResults = [];
      const items = [];
      for (const id of this.selectedLatex) {
        const it = this.latexItems.find(l => l.id === id);
        if (!it) continue;
        const mode = this.latexImportMode[id] || (it.repo_match ? 'overwrite' : 'new');
        if (mode === 'overwrite' && it.repo_match) {
          items.push({ id, mode: 'overwrite', repo_path: it.repo_match.path });
        } else {
          const cat = this.latexCategoryOverride[id] || it.target_letter;
          if (!cat) {
            this.latexResults.push({ id, ok: false, error: 'No tiene categoría destino — selecciónala' });
            continue;
          }
          items.push({ id, mode: 'new', category_letter: cat, slug: it.suggested_slug });
        }
      }
      if (items.length === 0) { this.importingLatex = false; return; }
      try {
        const r = await fetch('/api/latex/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, move_to_processed: true }),
        });
        const json = await r.json();
        const newResults = json.results || [];
        this.latexResults = [...this.latexResults, ...newResults];
        this.selectedLatex = new Set();
        const paths = newResults.filter(r => r.ok && r.path).map(r => r.path);
        await this.refreshCatalogAfterImport(paths);
        this.loadLatex(true);
        this.enqueueAndOpen(paths, 'de LaTeX');
      } catch (e) {
        alert('Error importando LaTeX: ' + e.message);
      } finally {
        this.importingLatex = false;
      }
    },
    // ─────────── Import view (doceacordes.es) ───────────
    async loadDoce(force = false) {
      if (this.doceItems.length > 0 && !force) return;
      this.doceLoading = true;
      try {
        const r = await fetch('/api/doce/list');
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const d = await r.json();
        // Precalculamos la clave de búsqueda: son ~1700 canciones y el filtro
        // se reevalúa en cada tecla, normalizar ahí dentro costaba una barbaridad.
        this.doceItems = (d.items || []).map(it => ({
          ...it,
          _search: this.normalizeSearch(it.title + ' ' + (it.artist || '')),
        }));
        _doceFilterMemo = null;
      } catch (e) {
        alert('No pude cargar el índice de doceacordes: ' + e.message);
      } finally {
        this.doceLoading = false;
      }
    },
    // Alpine reevalúa este método varias veces por render (x-for, contador,
    // paginación…). Con 1700 canciones eso se notaba al teclear, así que
    // memoizamos por (búsqueda, filtro, lista cargada).
    filteredDoce() {
      const key = this.doceMatchFilter + '\n' + this.doceSearch + '\n' + this.doceItems.length;
      if (_doceFilterMemo && _doceFilterMemo.key === key) return _doceFilterMemo.list;

      let list = this.doceItems;
      if (this.doceMatchFilter === 'new') list = list.filter(d => !d.in_repo);
      else if (this.doceMatchFilter === 'match') list = list.filter(d => d.in_repo);
      if (this.doceSearch) {
        const q = this.normalizeSearch(this.doceSearch);
        list = list.filter(d => d._search.includes(q) || d.id.includes(q));
      }
      _doceFilterMemo = { key, list };
      return list;
    },
    filteredDocePaged() {
      const list = this.filteredDoce();
      const start = this.docePage * this.docePageSize;
      return list.slice(start, start + this.docePageSize);
    },
    // Pide al backend que deje en cache el .cho + HTML de unas canciones. Sin
    // esto, abrir un preview son dos descargas a doceacordes (~1,5 s); con la
    // cache caliente es instantáneo.
    prefetchDoce(ids) {
      const pending = (Array.isArray(ids) ? ids : [ids])
        .filter(id => id && !_docePrefetched.has(id));
      if (!pending.length) return;
      pending.forEach(id => _docePrefetched.add(id));
      fetch('/api/doce/prefetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: pending }),
      }).catch(() => pending.forEach(id => _docePrefetched.delete(id)));
    },
    // Calienta sólo la cabecera de la página visible: prefetchear las 50 filas
    // sería un centenar de peticiones a doceacordes por cada paginada.
    prefetchDoceVisible() {
      this.prefetchDoce(this.filteredDocePaged().slice(0, 6).map(d => d.id));
    },
    // ─────────── Selector visual de número ───────────
    // `target` dice a dónde va el número elegido: {kind:'doce', id} | {kind:'new'}
    // | {kind:'move'}.
    async openNumberPicker(category, target, current) {
      if (!category) {
        alert('Elige primero la categoría destino: los números ocupados dependen de ella.');
        return;
      }
      this.numberPicker = {
        category, target, categoryTitle: '', numbers: [],
        suggested: null, selected: current || null, loading: true,
      };
      try {
        const r = await fetch('/api/category/number-map?category=' + encodeURIComponent(category));
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const d = await r.json();
        this.numberPicker = {
          ...this.numberPicker,
          categoryTitle: d.category_title,
          numbers: d.numbers,
          suggested: d.suggested,
          // Por defecto el primer hueco libre, saltándose los del docx pendientes.
          selected: current || d.suggested,
          loading: false,
        };
      } catch (e) {
        alert('No pude leer los números de la categoría: ' + e.message);
        this.numberPicker = null;
      }
    },
    pickNumber(entry) {
      // Los ocupados no se pueden elegir (el backend rechazaría el archivo).
      // Los reservados por el docx sí: es una decisión consciente del usuario.
      if (!this.numberPicker || entry.state === 'used') return;
      this.numberPicker = { ...this.numberPicker, selected: entry.number };
    },
    numberPickerCounts() {
      const p = this.numberPicker;
      if (!p || !p.numbers.length) return '';
      const n = s => p.numbers.filter(e => e.state === s).length;
      return `${n('used')} ocupados · ${n('reserved')} reservados por el cantoral · ${n('free')} libres`;
    },
    applyNumberPicker() {
      const p = this.numberPicker;
      if (!p || !p.selected) return;
      const t = p.target || {};
      if (t.kind === 'doce') {
        this.doceNumberSel = { ...this.doceNumberSel, [t.id]: p.selected };
      } else if (t.kind === 'new') {
        this.newSong.number = p.selected;
      } else if (t.kind === 'move' && this.moveModal) {
        this.moveModal.number = p.selected;
      }
      this.numberPicker = null;
    },
    async onDoceCategoryChange(doceId) {
      const cat = this.doceCategorySel[doceId];
      if (!cat) return;
      try {
        const hint = this.docePositionHint[doceId];
        const url = '/api/doce/suggest-number?category=' + cat +
                    (hint ? '&position_hint=' + hint : '');
        const r = await fetch(url);
        if (r.ok) {
          const j = await r.json();
          this.doceSuggestedNumber = { ...this.doceSuggestedNumber, [doceId]: j.next_number };
          // Si el usuario NO había puesto número, o si tenemos un hint específico, usarlo
          if (!this.doceNumberSel[doceId] || hint) {
            this.doceNumberSel = { ...this.doceNumberSel, [doceId]: j.next_number };
          }
        }
      } catch (e) { /* silencio */ }
    },
    async previewDoce(doceId, force = false) {
      // Si venimos de "buscar en doceacordes" para una del cantoral, la primera
      // que abrimos hereda su sección/posición/tono.
      await this.adoptManualSearchTarget(doceId);
      try {
        const cat = this.doceCategorySel[doceId] || '';
        const hint = this.docePositionHint[doceId];
        const url = '/api/doce/preview?id=' + encodeURIComponent(doceId) +
                    (cat ? '&category=' + cat : '') +
                    (this.doceIncludeMeta ? '' : '&meta=0') +
                    (force ? '&force=1' : '') +
                    (hint ? '&position_hint=' + hint : '');
        const r = await fetch(url);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        this.docePreview = j;
        this.docePreviewCategory = cat;
        if (j.suggested_number && !this.doceNumberSel[doceId]) {
          this.doceNumberSel = { ...this.doceNumberSel, [doceId]: j.suggested_number };
        }
        this.detectKeyConflict(doceId);
      } catch (e) {
        alert('Error preview: ' + e.message);
      }
    },
    // Compara el tono que la canción tenía en el cantoral DOCX con el tono que
    // trae la versión de doceacordes. Si difieren, exige resolución antes de importar.
    detectKeyConflict(doceId) {
      this.doceKeyConflict = null;
      this.doceKeyResolved = false;
      const cantoralKey = (this.doceCantoralKey[doceId] || '').trim();
      const doceKey = (this.docePreview && this.docePreview.meta && this.docePreview.meta.key || '').trim();
      if (!cantoralKey || !doceKey) return;
      if (normalizeKey(cantoralKey) === normalizeKey(doceKey)) return;
      this.doceKeyConflict = { cantoralKey, doceKey };
    },
    // El usuario elige con qué tono se queda. Si elige el del cantoral, transponemos
    // el contenido de doceacordes a ese tono; si elige el de doce, no tocamos nada.
    resolveKeyConflict(chosenKey) {
      if (!this.docePreview || !this.doceKeyConflict) return;
      const doceKey = this.doceKeyConflict.doceKey;
      if (normalizeKey(chosenKey) !== normalizeKey(doceKey)) {
        const transposed = transposeChoToKey(this.docePreview.content, doceKey, chosenKey);
        if (transposed == null) {
          alert('No pude transponer de "' + doceKey + '" a "' + chosenKey + '".');
          return;
        }
        this.docePreview.content = transposed;
        this.docePreview.meta = { ...this.docePreview.meta, key: chosenKey };
      }
      this.doceKeyResolved = true;
    },
    async reloadDocePreview() {
      if (!this.docePreview) return;
      this.docePreviewReloading = true;
      try {
        await this.previewDoce(this.docePreview.id, true);
      } finally {
        this.docePreviewReloading = false;
      }
    },
    hasExtras(extras) {
      if (!extras) return false;
      return !!(extras.rhythm || extras.album || extras.liturgicalTime || extras.source ||
                extras.comment || extras.videoEmbed ||
                (extras.youtubeLinks && extras.youtubeLinks.length) ||
                (extras.audioLinks && extras.audioLinks.length));
    },
    async importFromPreview() {
      if (!this.docePreview) return;
      if (this.doceKeyConflict && !this.doceKeyResolved) {
        alert('Resuelve primero el conflicto de tono: elige con qué tono quieres importar.');
        return;
      }
      const id = this.docePreview.id;
      this.doceCategorySel = { ...this.doceCategorySel, [id]: this.docePreviewCategory };
      // Si se resolvió el conflicto transponiendo, mandamos el contenido editado.
      const overrideContent = this.doceKeyResolved ? this.docePreview.content : undefined;
      await this.importOneDoce(id, overrideContent);
      this.docePreview = null;
      this.doceKeyConflict = null;
      this.doceKeyResolved = false;
    },
    doceImportItem(doceId, overrideContent) {
      return {
        doce_id: doceId,
        category_letter: this.doceCategorySel[doceId],
        number: this.doceNumberSel[doceId] || undefined,
        position_hint: this.docePositionHint[doceId] || undefined,
        include_meta: this.doceIncludeMeta,
        content: overrideContent || undefined,
      };
    },
    async importOneDoce(doceId, overrideContent) {
      await this.adoptManualSearchTarget(doceId);
      if (!this.doceCategorySel[doceId]) { alert('Elige categoría'); return; }
      await this.runDoceImport([this.doceImportItem(doceId, overrideContent)]);
    },
    // ─────────── Import en lote (varias canciones marcadas) ───────────
    toggleDoce(id) {
      const s = new Set(this.selectedDoce);
      s.has(id) ? s.delete(id) : s.add(id);
      this.selectedDoce = s;
    },
    selectAllDoceVisible() {
      const s = new Set(this.selectedDoce);
      this.filteredDocePaged().forEach(d => s.add(d.id));
      this.selectedDoce = s;
      this.prefetchDoce([...s].slice(0, 40));
    },
    // Cuántas de las marcadas les falta categoría: sin ella no se pueden importar.
    doceSelectedWithoutCategory() {
      return [...this.selectedDoce].filter(id => !this.doceCategorySel[id]);
    },
    // Aplica una categoría de golpe a todas las marcadas y reparte números.
    async applyDoceBulkCategory() {
      const cat = this.doceBulkCategory;
      if (!cat) return;
      const ids = [...this.selectedDoce];
      const sel = { ...this.doceCategorySel };
      ids.forEach(id => { sel[id] = cat; });
      this.doceCategorySel = sel;
      // Un solo request para todas: si pidiéramos el número una a una, todas
      // recibirían el mismo primer hueco libre y al importar el lote chocarían.
      try {
        const r = await fetch('/api/doce/suggest-numbers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: cat,
            items: ids.map(id => ({ doce_id: id, position_hint: this.docePositionHint[id] })),
          }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const { numbers } = await r.json();
        this.doceSuggestedNumber = { ...this.doceSuggestedNumber, ...numbers };
        this.doceNumberSel = { ...this.doceNumberSel, ...numbers };
      } catch (e) {
        alert('No pude repartir los números: ' + e.message);
      }
    },
    async importSelectedDoce() {
      const ids = [...this.selectedDoce];
      if (!ids.length) return;
      const sinCat = this.doceSelectedWithoutCategory();
      if (sinCat.length) {
        alert(`${sinCat.length} de las ${ids.length} canciones marcadas no tienen categoría.\n` +
              'Elige una arriba y pulsa "Aplicar a marcadas", o quítalas de la selección.');
        return;
      }
      // Dos canciones con el mismo nº en la misma categoría se pisarían (la
      // segunda fallaría con "ya existe"). Puede pasar si se han ido eligiendo
      // categorías fila a fila, porque cada una vio el mismo hueco libre.
      await this.fixDoceNumberClashes(ids);
      if (!confirm(`¿Importar ${ids.length} canciones de doceacordes?`)) return;
      await this.runDoceImport(ids.map(id => this.doceImportItem(id)));
      this.selectedDoce = new Set();
    },
    // Reparte de nuevo los números de las categorías donde haya repetidos.
    async fixDoceNumberClashes(ids) {
      const byCat = {};
      for (const id of ids) {
        const cat = this.doceCategorySel[id];
        if (cat) (byCat[cat] = byCat[cat] || []).push(id);
      }
      for (const [cat, catIds] of Object.entries(byCat)) {
        const nums = catIds.map(id => this.doceNumberSel[id]).filter(Boolean);
        if (new Set(nums).size === nums.length) continue;  // sin repetidos
        this.doceBulkCategory = cat;
        const prevSelection = this.selectedDoce;
        this.selectedDoce = new Set(catIds);
        await this.applyDoceBulkCategory();
        this.selectedDoce = prevSelection;
      }
    },
    // Punto único de importación: una o muchas. El backend ya acepta la lista
    // entera, así que es un solo POST.
    async runDoceImport(items) {
      if (!items.length) return;
      this.doceImporting = true;
      this.doceBatchProgress = items.length > 1 ? { done: 0, total: items.length } : null;
      try {
        const r = await fetch('/api/doce/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const json = await r.json();
        const newResults = json.results || [];
        this.doceResults = [...newResults, ...this.doceResults].slice(0, 30);
        if (this.doceBatchProgress) this.doceBatchProgress.done = newResults.length;
        const paths = newResults.filter(x => x.ok && x.path).map(x => x.path);
        // Parchea el catálogo con las nuevas y recarga en segundo plano, así el
        // editor se abre al momento en vez de esperar al catálogo completo.
        await this.refreshCatalogAfterImport(paths);
        this.loadDoce(true);
        this.enqueueAndOpen(paths, 'de doceacordes');
      } catch (e) {
        alert('Error importando: ' + e.message);
      } finally {
        this.doceImporting = false;
        this.doceBatchProgress = null;
      }
    },
    onDoceBadgeClick(missing, event) {
      // Si solo hay 1 candidato → ir directo al import
      if (!missing.doce_candidates || missing.doce_candidates.length <= 1) {
        this.doceCandidatesPopover = null;
        this.goImportFromDoce(missing);
        return;
      }
      // Toggle popover
      if (this.doceCandidatesPopover && this.doceCandidatesPopover.missingId === missing.docx_id) {
        this.doceCandidatesPopover = null;
      } else {
        this.doceCandidatesPopover = { missingId: missing.docx_id };
      }
    },
    async pickDoceCandidate(missing, candidate) {
      this.doceCandidatesPopover = null;
      this.view = 'doce';
      await this.loadDoce();
      this.doceSearch = candidate.title;
      this.docePage = 0;
      // Guardar la posición que esta canción tiene en el cantoral DOCX para
      // que el número de archivo coincida (si está libre).
      if (missing.position_in_section) {
        this.docePositionHint = { ...this.docePositionHint, [candidate.id]: missing.position_in_section };
      }
      if (missing.key) {
        this.doceCantoralKey = { ...this.doceCantoralKey, [candidate.id]: missing.key };
      }
      if (missing.section_letter && !this.doceCategorySel[candidate.id]) {
        this.doceCategorySel = { ...this.doceCategorySel, [candidate.id]: missing.section_letter };
        await this.onDoceCategoryChange(candidate.id);
      }
      await this.previewDoce(candidate.id);
      if (missing.section_letter) this.docePreviewCategory = missing.section_letter;
    },
    async goImportFromDoce(missing) {
      // Llamado desde la vista "Importar del cantoral" al click en badge 🎸
      // missing: {doce_candidates, title, section_letter, ...}
      this.view = 'doce';
      await this.loadDoce();
      // Si hay un único candidato muy fiable, lo preselecciono con la sección sugerida
      const cands = missing.doce_candidates || [];
      if (cands.length === 0) return;
      // Filtrar la tabla a esos candidatos
      this.doceSearch = cands[0].title;
      this.docePage = 0;
      // Sugerir categoría del docx + posición del cantoral
      for (const c of cands) {
        if (missing.position_in_section) {
          this.docePositionHint = { ...this.docePositionHint, [c.id]: missing.position_in_section };
        }
        if (missing.key) {
          this.doceCantoralKey = { ...this.doceCantoralKey, [c.id]: missing.key };
        }
        if (missing.section_letter && !this.doceCategorySel[c.id]) {
          this.doceCategorySel = { ...this.doceCategorySel, [c.id]: missing.section_letter };
          await this.onDoceCategoryChange(c.id);
        }
      }
      // Si sólo hay uno, abrir preview directamente
      if (cands.length === 1) {
        await this.previewDoce(cands[0].id);
        if (missing.section_letter) this.docePreviewCategory = missing.section_letter;
      }
    },

    // ─────────── Multimedia / quick add ───────────
    mediaYoutubeTooltip(r) {
      const n = (r.youtube_count || 0) + (r.has_video ? 1 : 0);
      if (n === 0) return 'Sin YouTube ni vídeo — click para añadir';
      return `${n} link${n > 1 ? 's' : ''} de YouTube/vídeo · click para añadir más`;
    },
    mediaAudioTooltip(r) {
      const n = r.audio_count || 0;
      if (n === 0) return 'Sin audio interno — click para añadir';
      return `${n} audio${n > 1 ? 's' : ''} interno${n > 1 ? 's' : ''} · click para añadir más`;
    },
    async openQuickAddLink(repoSong, type) {
      // Carga el .cho actual para listar los links existentes
      let existing = [];
      try {
        const r = await fetch('/api/song?path=' + encodeURIComponent(repoSong.path));
        if (r.ok) {
          const j = await r.json();
          existing = type === 'youtube'
            ? (j.meta.youtubeLinks || [])
            : (j.meta.audioLinks || []);
        }
      } catch (_) { /* silence */ }
      this.quickLink = {
        open: true, path: repoSong.path, songTitle: repoSong.title,
        type, label: '', url: '', existing, saving: false,
      };
    },
    async removeQuickLink(idx) {
      // Borra un link existente (reescribe meta entera sin él)
      if (!confirm('¿Borrar este link?')) return;
      try {
        const r = await fetch('/api/song?path=' + encodeURIComponent(this.quickLink.path));
        const j = await r.json();
        const key = this.quickLink.type === 'youtube' ? 'youtubeLinks' : 'audioLinks';
        const list = (j.meta[key] || []).slice();
        list.splice(idx, 1);
        const meta = { ...j.meta, [key]: list };
        const r2 = await fetch('/api/song/meta?path=' + encodeURIComponent(this.quickLink.path), {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(meta),
        });
        if (!r2.ok) throw new Error('HTTP ' + r2.status);
        this.quickLink.existing = list;
        await this.loadCatalog();
      } catch (e) {
        alert('Error: ' + e.message);
      }
    },
    async saveQuickAddLink() {
      if (!this.quickLink.url) return;
      this.quickLink.saving = true;
      try {
        const r = await fetch('/api/song/meta/quick-add', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: this.quickLink.path,
            type: this.quickLink.type,
            label: this.quickLink.label,
            url: this.quickLink.url,
          }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        // Actualizar lista existente + refrescar catálogo
        const key = this.quickLink.type === 'youtube' ? 'youtubeLinks' : 'audioLinks';
        this.quickLink.existing = j.meta[key] || [];
        this.quickLink.label = '';
        this.quickLink.url = '';
        await this.loadCatalog();
      } catch (e) {
        alert('Error: ' + e.message);
      } finally {
        this.quickLink.saving = false;
      }
    },
    async openMultimediaTab(path) {
      this.quickLink.open = false;
      await this.openEditor(path);
      this.setEditorTab('media');
    },

    // Tab Multimedia del editor
    // Envoltorio para las plantillas: enseña/abre cualquier URL de YouTube en
    // su forma normal, aunque por dentro esté guardada como embed.
    ytWatch(url) { return toYoutubeWatch(url); },
    loadMediaForm() {
      const m = this.editor.meta || {};
      // En el .cho los vídeos de YouTube viven en formato embed (es lo que
      // reproduce la app), pero al editar se muestran como link normal: es lo
      // que uno reconoce, copia y pega. Al guardar se vuelven a embed.
      this.mediaForm = {
        rhythm: m.rhythm || '',
        album: m.album || '',
        liturgicalTime: m.liturgicalTime || '',
        source: m.source || '',
        videoEmbed: toYoutubeWatch(m.videoEmbed || ''),
        comment: m.comment || '',
        youtubeLinks: (m.youtubeLinks || []).map(l => ({ ...l, url: toYoutubeWatch(l.url) })),
        audioLinks: (m.audioLinks || []).map(l => ({ ...l })),
        tags: [...(m.tags || [])],
      };
      this.mediaOriginal = JSON.stringify(this.mediaForm);
      this.mediaDirty = false;
    },
    resetMediaMeta() { this.loadMediaForm(); },
    addMediaLink(key) {
      this.mediaForm[key] = [...this.mediaForm[key], { label: '', url: '' }];
      this.mediaDirty = true;
    },
    removeMediaLink(key, idx) {
      const arr = this.mediaForm[key].slice();
      arr.splice(idx, 1);
      this.mediaForm[key] = arr;
      this.mediaDirty = true;
    },
    moveMediaLink(key, idx, delta) {
      const arr = this.mediaForm[key].slice();
      const j = idx + delta;
      if (j < 0 || j >= arr.length) return;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      this.mediaForm[key] = arr;
      this.mediaDirty = true;
    },
    async saveMediaMeta() {
      if (!this.editor.path) return;
      // Bug 1: si hay cambios sin guardar en el cuerpo (visual/raw), avisar
      if (this.editor.dirty) {
        const choice = confirm(
          'Tienes cambios en el cuerpo de la canción SIN GUARDAR.\n\n' +
          'Si continúas guardando solo los metadatos, los cambios del cuerpo se perderán ' +
          '(se recargará desde disco).\n\n' +
          'Pulsa Aceptar para PRIMERO guardar el cuerpo y LUEGO los metadatos.\n' +
          'Pulsa Cancelar para abortar (vuelve al editor y guarda manualmente).'
        );
        if (!choice) return;
        // Guardar cuerpo primero
        await this.saveSong();
        if (this.editor.dirty) return; // saveSong falló
      }
      this.mediaSaving = true;
      try {
        // Limpiar links vacíos
        const payload = { ...this.mediaForm,
          youtubeLinks: this.mediaForm.youtubeLinks.filter(l => l.url && l.url.trim()),
          audioLinks: this.mediaForm.audioLinks.filter(l => l.url && l.url.trim()),
        };
        const r = await fetch('/api/song/meta?path=' + encodeURIComponent(this.editor.path), {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        // Refrescar editor content (el cuerpo del .cho cambió por las directives)
        const r2 = await fetch('/api/song?path=' + encodeURIComponent(this.editor.path));
        const sj = await r2.json();
        this.editor.content = sj.content;
        this.editor.originalContent = sj.content;
        this.editor.meta = sj.meta;
        this.loadMediaForm();
        await this.loadCatalog();
        await this.loadTags();
      } catch (e) {
        alert('Error guardando metadatos: ' + e.message);
      } finally {
        this.mediaSaving = false;
      }
    },

    async openSongFromPath(path) {
      // Reusa la apertura del editor por path
      try {
        const r = await fetch('/api/song?path=' + encodeURIComponent(path));
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const json = await r.json();
        this.editor = {
          path: json.path, filename: json.filename, content: json.content,
          originalContent: json.content, dirty: false, tab: 'visual',
          meta: { ...json.meta }, parsed: [],
        };
        this.editor.parsed = parseCho(this.editor.content);
        this.markChorusFlags();
        this.setSaveIndicator('saved', '✓ Cargada');
        this.$nextTick(() => this.layoutChords());
      } catch (e) {
        alert('No pude abrir: ' + e.message);
      }
    },

    // ─────────── Reorder ───────────
    async loadReorder() {
      if (!this.reorderCategory) {
        this.reorderSlots = [];
        this.reorderOriginal = '';
        return;
      }
      try {
        const r = await fetch('/api/category/slots?category=' + this.reorderCategory);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        // Enriquecer con título buscando en repo_songs
        const byFn = {};
        for (const rs of this.data.repo_songs) byFn[rs.filename] = rs;
        this.reorderSlots = j.slots.map(s => {
          const info = s.filename ? byFn[s.filename] : null;
          return {
            number: s.number,
            filename: s.filename,
            title: info ? info.title : null,
            originalNumber: info ? info.number : null,
            gap: !s.filename,
          };
        });
        this.reorderOriginal = JSON.stringify(this.reorderSlots.map(s => s.filename));
      } catch (e) {
        alert('No pude cargar slots: ' + e.message);
      }
    },
    get reorderModified() {
      return JSON.stringify((this.reorderSlots || []).map(s => s.filename)) !== this.reorderOriginal;
    },
    onReorderDrop(targetIdx) {
      if (this.reorderDragIdx == null || this.reorderDragIdx === targetIdx) return;
      const arr = this.reorderSlots;
      const [moved] = arr.splice(this.reorderDragIdx, 1);
      arr.splice(targetIdx, 0, moved);
      this.reorderSlots = [...arr];
      this.reorderDragIdx = null;
    },
    insertGapAt(idx) {
      const arr = [...this.reorderSlots];
      arr.splice(idx, 0, { number: null, filename: null, title: null, gap: true });
      this.reorderSlots = arr;
    },
    removeGapAt(idx) {
      if (!this.reorderSlots[idx]?.gap) return;
      const arr = [...this.reorderSlots];
      arr.splice(idx, 1);
      this.reorderSlots = arr;
    },
    compactGaps() {
      if (!confirm('¿Compactar todos los huecos? Renumera consecutivo 01, 02, 03…')) return;
      this.reorderSlots = this.reorderSlots.filter(s => !s.gap);
    },
    async applyReorder() {
      if (!this.reorderCategory || !this.reorderModified) return;
      try {
        const r = await fetch('/api/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: this.reorderCategory,
            order: this.reorderSlots.map(s => s.filename),  // null = hueco
          }),
        });
        if (!r.ok) {
          const t = await r.text();
          throw new Error('HTTP ' + r.status + ': ' + t);
        }
        await this.loadCatalog();
        await this.loadReorder();
        alert('Orden aplicado.');
      } catch (e) {
        alert('Error reordenando: ' + e.message);
      }
    },

    // ─────────── Editor ───────────
    async openEditor(path) {
      try {
        const r = await fetch('/api/song?path=' + encodeURIComponent(path));
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const json = await r.json();
        this.editor = {
          path: json.path,
          filename: json.filename,
          content: json.content,
          originalContent: json.content,
          dirty: false,
          tab: 'visual',  // por defecto abrimos en visual
          meta: { ...json.meta },
          parsed: [],
        };
        this.visualSelectedLines = new Set();
        this.visualSelectedChord = null;
        this.resetUndo();
        this.setSaveIndicator('saved', '✓ Cargada');
        // Pre-parsear porque visual es el tab por defecto
        this.editor.parsed = parseCho(this.editor.content);
        this.markChorusFlags();
        this.$nextTick(() => this.layoutChords());
      } catch (e) {
        alert('Error abriendo: ' + e.message);
      }
    },
    closeEditor() {
      if (this.editor.dirty && !confirm('Hay cambios sin guardar. ¿Descartar?')) return;
      this.editor = {
        path: null, filename: null, content: '', originalContent: '',
        dirty: false, tab: 'visual',
        meta: { title: '', artist: '', key: '', capo: 0, has_todo: false, has_chord_review: false },
        parsed: [],
      };
      this.visualSelectedLines = new Set();
      this.visualSelectedChord = null;
      this.resetUndo();
      this.setSaveIndicator('saved', 'Sin cambios');
      // Si hay cola pendiente, avanzar a la siguiente
      this.advanceEditorQueue();
    },
    // ─────────── Cola de revisión post-import ───────────
    enqueueAndOpen(paths, label = 'importadas') {
      const list = (paths || []).filter(Boolean);
      if (!list.length) return;
      this.editorQueue = list.map(p => ({ path: p, label }));
      this.editorQueueIdx = 0;
      this.openEditor(list[0]);
    },
    advanceEditorQueue() {
      if (!this.editorQueue.length) return;
      this.editorQueueIdx++;
      if (this.editorQueueIdx >= this.editorQueue.length) {
        this.editorQueue = [];
        this.editorQueueIdx = 0;
        return;
      }
      const next = this.editorQueue[this.editorQueueIdx];
      // pequeño delay para que Alpine cierre el modal antes de reabrirlo
      setTimeout(() => this.openEditor(next.path), 50);
    },
    skipEditorQueue() {
      if (this.editor.dirty && !confirm('Hay cambios sin guardar. ¿Saltar igualmente?')) return;
      // Cierra sin pasar por confirm interno de closeEditor
      this.editor.dirty = false;
      this.closeEditor();
    },
    cancelEditorQueue() {
      this.editorQueue = [];
      this.editorQueueIdx = 0;
    },
    editorQueueProgress() {
      if (!this.editorQueue.length) return '';
      return `${this.editorQueueIdx + 1} / ${this.editorQueue.length}`;
    },
    setEditorTab(t) {
      // Warn si dejamos un tab de meta (media/extra) con cambios sin guardar y vamos a otro tab no-meta
      const fromMeta = (this.editor.tab === 'media' || this.editor.tab === 'extra');
      const toMeta = (t === 'media' || t === 'extra');
      if (fromMeta && !toMeta && this.mediaDirty) {
        if (!confirm('Hay metadatos sin guardar. ¿Descartar cambios?')) return;
        this.loadMediaForm();
      }
      if (this.editor.tab === 'visual' && t !== 'visual') {
        this.editor.content = serializeCho(this.editor.parsed);
        this.refreshMetaFromRaw();
      }
      // Al salir del Raw dejamos UN paso de undo con lo que había al entrar. Lo
      // que se teclea dentro del textarea lo deshace el navegador (Ctrl+Z nativo);
      // apilar cada pulsación aquí llenaría el historial de ruido.
      if (this.editor.tab === 'raw' && t !== 'raw') {
        this.recordUndo(this._rawEnterContent);
        this._rawEnterContent = null;
      }
      this.editor.tab = t;
      if (toMeta && !fromMeta) {
        this.loadMediaForm();
      }
      if (t === 'raw') this._rawEnterContent = this.editor.content;
      if (t === 'visual') {
        this.editor.parsed = parseCho(this.editor.content);
        this.markChorusFlags();
        this.$nextTick(() => this.layoutChords());
      }
    },

    // ─────────── Editor visual ───────────
    layoutChords() {
      const root = document.querySelector('.visual-doc');
      if (!root) return;
      const lines = root.querySelectorAll('.ed-line');
      lines.forEach((lineEl) => {
        const idx = parseInt(lineEl.dataset.lineIdx, 10);
        const ln = this.editor.parsed[idx];
        if (!ln || ln.type !== 'lyric') return;
        const layer = lineEl.querySelector('.ed-chords-layer');
        if (!layer) return;
        layer.innerHTML = '';

        const lyricRow = lineEl.querySelector('.ed-lyric-row');
        const lyricRect = lyricRow.getBoundingClientRect();
        const chars = lyricRow.querySelectorAll('.ed-char');

        // 1) Marcar caracteres que son inicio de sílaba (para hover).
        const sylSet = new Set(syllableStartsInLine(ln.lyric));
        const wordSet = new Set(wordStarts(ln.lyric));
        chars.forEach((c, i) => {
          c.classList.toggle('ed-syllable-start', sylSet.has(i));
          c.classList.toggle('ed-word-start', wordSet.has(i));
        });

        // 2) Agrupar acordes por posición para apilarlos visualmente sin solaparse.
        const groups = new Map();
        ln.chords.forEach((ch, chordIdx) => {
          const p = Math.max(0, Math.min(ch.pos, ln.lyric.length));
          if (!groups.has(p)) groups.set(p, []);
          groups.get(p).push({ ch, chordIdx });
        });

        groups.forEach((arr, pos) => {
          const target = chars[Math.min(pos, chars.length - 1)] || chars[chars.length - 1];
          if (!target) return;
          const baseLeft = target.getBoundingClientRect().left - lyricRect.left;
          let cumX = baseLeft;
          arr.forEach(({ ch, chordIdx }) => {
            const el = document.createElement('span');
            el.className = 'ed-chord';
            el.dataset.lineIdx = idx;
            el.dataset.chordIdx = chordIdx;
            el.style.left = cumX + 'px';
            el.textContent = ch.text;
            if (this.visualSelectedChord &&
                this.visualSelectedChord.lineIdx === idx &&
                this.visualSelectedChord.chordIdx === chordIdx) {
              el.classList.add('selected');
            }
            this.attachChordEvents(el);
            layer.appendChild(el);
            // Avanzar para el siguiente acorde del mismo grupo (+gap pequeño)
            const w = el.offsetWidth;
            cumX += w + 3;
          });
        });
      });
    },

    // Resalta la ancla de snap (carácter target) mientras se arrastra un acorde.
    highlightSnapTarget(lineIdx, charIdx) {
      // Limpia resaltados previos en toda la canción
      document.querySelectorAll('.ed-char.snap-hover').forEach(c => c.classList.remove('snap-hover'));
      if (lineIdx == null || charIdx == null) return;
      const lineEl = document.querySelector(`.ed-line[data-line-idx="${lineIdx}"]`);
      if (!lineEl) return;
      const chars = lineEl.querySelectorAll('.ed-char');
      const ch = chars[Math.min(charIdx, chars.length - 1)];
      if (ch) ch.classList.add('snap-hover');
    },
    clearSnapHighlight() {
      document.querySelectorAll('.ed-char.snap-hover').forEach(c => c.classList.remove('snap-hover'));
    },

    attachChordEvents(el) {
      const self = this;
      let dragState = null;

      el.addEventListener('mousedown', (ev) => {
        if (ev.button !== 0) return;
        ev.preventDefault();
        ev.stopPropagation();
        const lineIdx = parseInt(el.dataset.lineIdx, 10);
        const chordIdx = parseInt(el.dataset.chordIdx, 10);
        self.visualSelectedChord = { lineIdx, chordIdx };
        // Refresh selection visuals
        document.querySelectorAll('.ed-chord.selected').forEach(n => n.classList.remove('selected'));
        el.classList.add('selected');
        // Focus root for keyboard
        const root = document.querySelector('.visual-doc');
        if (root) root.focus();

        const startX = ev.clientX;
        const startLeft = parseFloat(el.style.left) || 0;
        dragState = { startX, startLeft, lineIdx, chordIdx, moved: false };

        // Helper para calcular dónde caería el acorde con los modificadores actuales
        function computeSnapIdx(eventLikeEv) {
          const lineEl = document.querySelector(`.ed-line[data-line-idx="${dragState.lineIdx}"]`);
          const lyricRow = lineEl && lineEl.querySelector('.ed-lyric-row');
          if (!lyricRow) return null;
          const chars = lyricRow.querySelectorAll('.ed-char');
          let bestIdx = 0, bestDist = Infinity;
          const x = eventLikeEv.clientX;
          chars.forEach((c, i) => {
            const r = c.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const d = Math.abs(cx - x);
            if (d < bestDist) { bestDist = d; bestIdx = i; }
          });
          const ln = self.editor.parsed[dragState.lineIdx];
          if (eventLikeEv.altKey) {
            return bestIdx;  // sin snap — libre
          } else if (eventLikeEv.shiftKey) {
            return snapToWordStart(bestIdx, ln.lyric);  // shift → palabra
          } else {
            return snapToSyllable(bestIdx, ln.lyric);   // por defecto → sílaba
          }
        }

        function onMove(e) {
          if (!dragState) return;
          const dx = e.clientX - dragState.startX;
          if (Math.abs(dx) > 3) dragState.moved = true;
          el.style.left = (dragState.startLeft + dx) + 'px';
          el.classList.add('dragging');
          // Indicador en vivo: resaltar la letra a la que se va a anclar
          if (dragState.moved) {
            const snapIdx = computeSnapIdx(e);
            self.highlightSnapTarget(dragState.lineIdx, snapIdx);
            // Etiqueta del modo activo
            el.dataset.snapMode = e.altKey ? 'free' : (e.shiftKey ? 'word' : 'syl');
          }
        }
        function onUp(e) {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          el.classList.remove('dragging');
          el.removeAttribute('data-snap-mode');
          self.clearSnapHighlight();
          if (!dragState || !dragState.moved) {
            dragState = null;
            return;
          }
          const bestIdx = computeSnapIdx(e);
          if (bestIdx == null) { dragState = null; return; }
          const ln = self.editor.parsed[dragState.lineIdx];
          ln.chords[dragState.chordIdx].pos = bestIdx;
          self.commitParsed();
          self.layoutChords();
          dragState = null;
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });

      el.addEventListener('dblclick', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const lineIdx = parseInt(el.dataset.lineIdx, 10);
        const chordIdx = parseInt(el.dataset.chordIdx, 10);
        const cur = self.editor.parsed[lineIdx].chords[chordIdx].text;
        const next = prompt('Acorde:', cur);
        if (next != null) {
          const v = next.trim();
          if (v === '') {
            self.editor.parsed[lineIdx].chords.splice(chordIdx, 1);
          } else {
            self.editor.parsed[lineIdx].chords[chordIdx].text = v;
          }
          self.commitParsed();
          self.layoutChords();
        }
      });

      el.addEventListener('contextmenu', (ev) => {
        ev.preventDefault();
        const lineIdx = parseInt(el.dataset.lineIdx, 10);
        const chordIdx = parseInt(el.dataset.chordIdx, 10);
        if (confirm('¿Borrar este acorde?')) {
          self.editor.parsed[lineIdx].chords.splice(chordIdx, 1);
          self.commitParsed();
          self.layoutChords();
        }
      });
    },

    onVisualClick(ev) {
      // Add chord on click when add mode is on
      if (!this.visualAddMode) {
        // Click outside chord → deselect
        if (!ev.target.classList.contains('ed-chord')) {
          this.visualSelectedChord = null;
          document.querySelectorAll('.ed-chord.selected').forEach(n => n.classList.remove('selected'));
        }
        return;
      }
      const charEl = ev.target.closest('.ed-char');
      if (!charEl) return;
      const lineEl = charEl.closest('.ed-line');
      const lineIdx = parseInt(lineEl.dataset.lineIdx, 10);
      const charIdx = parseInt(charEl.dataset.idx, 10);
      const text = prompt('Acorde nuevo:', 'C');
      if (!text || !text.trim()) return;
      this.editor.parsed[lineIdx].chords.push({ text: text.trim(), pos: charIdx });
      this.editor.parsed[lineIdx].chords.sort((a, b) => a.pos - b.pos);
      this.commitParsed();
      this.visualAddMode = false;
      this.$nextTick(() => this.layoutChords());
    },

    deleteSelectedChord() {
      if (!this.visualSelectedChord) return;
      const { lineIdx, chordIdx } = this.visualSelectedChord;
      this.editor.parsed[lineIdx].chords.splice(chordIdx, 1);
      this.commitParsed();
      this.visualSelectedChord = null;
      this.layoutChords();
    },

    // ─────────── Helpers de actualización ───────────
    // ─────────── Undo / Redo ───────────
    // El historial guarda CONTENIDOS (el .cho serializado), no diffs: es lo más
    // simple de razonar y una canción son unos pocos KB. El enganche está en
    // commitParsed(), por donde pasan TODAS las mutaciones del visual (mover un
    // acorde, editar letra, borrar líneas, transponer…), así que no hay que
    // acordarse de apilar nada en cada operación nueva.
    resetUndo() {
      this.undoStack = [];
      this.redoStack = [];
      this._lastUndoKey = null;
      this._lastUndoAt = 0;
    },
    // `coalesceKey` agrupa ráfagas del mismo tipo (escribir en el campo Título
    // no debe dejar 20 pasos de undo, sino uno).
    recordUndo(prevContent, coalesceKey) {
      if (typeof prevContent !== 'string') return;
      const now = performance.now();
      if (coalesceKey && this._lastUndoKey === coalesceKey && now - this._lastUndoAt < 900) {
        this._lastUndoAt = now;
        return;
      }
      if (this.undoStack[this.undoStack.length - 1] !== prevContent) {
        this.undoStack.push(prevContent);
        if (this.undoStack.length > UNDO_LIMIT) this.undoStack.shift();
        // Al editar tras deshacer se abre rama nueva: el redo deja de valer.
        this.redoStack = [];
      }
      this._lastUndoKey = coalesceKey || null;
      this._lastUndoAt = now;
    },
    applyEditorContent(content) {
      this.editor.content = content;
      this.editor.parsed = parseCho(content);
      this.markChorusFlags();
      this.editor.dirty = true;
      this.refreshMetaFromRaw();
      // La selección apuntaba a índices del estado anterior: ya no valen.
      this.clearLineSelection();
      this.visualSelectedChord = null;
      this._lastUndoKey = null;
      this.$nextTick(() => this.layoutChords());
    },
    undoEdit() {
      if (!this.undoStack.length) return;
      const prev = this.undoStack.pop();
      this.redoStack.push(this.editor.content);
      this.applyEditorContent(prev);
      this.announce(`↶ Deshecho · quedan ${this.undoStack.length} pasos atrás`);
    },
    redoEdit() {
      if (!this.redoStack.length) return;
      const next = this.redoStack.pop();
      this.undoStack.push(this.editor.content);
      this.applyEditorContent(next);
      this.announce(`↷ Rehecho · quedan ${this.redoStack.length} pasos adelante`);
    },

    commitParsed() {
      const next = serializeCho(this.editor.parsed);
      if (next !== this.editor.content) {
        this.recordUndo(this.editor.content);
        this.editor.content = next;
      }
      this.editor.dirty = true;
      this.refreshMetaFromRaw();
    },

    lineCssClass(ln, idx) {
      const cls = ['ed-line', 'ed-' + ln.type];
      if (this.visualSelectedLines.has(idx)) cls.push('selected');
      if (ln._inChorus) cls.push('in-chorus');
      const drag = this.lineDragClass(idx);
      if (drag) cls.push(drag);
      return cls.join(' ');
    },

    // ─────────── Selección de líneas (gutter) ───────────
    toggleLineSelection(idx, ev) {
      // Trabajamos sobre una COPIA y la reasignamos al final → reactividad fiable.
      const next = new Set(this.visualSelectedLines);
      if (ev && ev.shiftKey && this.visualLastClickedLine != null) {
        const lo = Math.min(this.visualLastClickedLine, idx);
        const hi = Math.max(this.visualLastClickedLine, idx);
        for (let i = lo; i <= hi; i++) next.add(i);
      } else {
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        this.visualLastClickedLine = idx;
      }
      this.visualSelectedLines = next;
      // Refresh DOM por si el class binding tarda en re-evaluarse
      this.$nextTick(() => {
        document.querySelectorAll('.ed-line').forEach(el => {
          const i = parseInt(el.dataset.lineIdx, 10);
          if (this.visualSelectedLines.has(i)) el.classList.add('selected');
          else el.classList.remove('selected');
        });
      });
    },
    clearLineSelection() {
      this.visualSelectedLines = new Set();
      this.visualLastClickedLine = null;
    },
    // OJO: esto COLAPSA la selección a min..max. Sólo debe usarse donde el
    // rango contiguo es lo correcto por definición (envolver en {soc}/{eoc}) o
    // como simple ancla de inserción. Para operar sobre las líneas marcadas usa
    // `selectedIdxAsc()`, que respeta el conjunto exacto.
    selectedLineRange() {
      const arr = this.selectedIdxAsc();
      if (arr.length === 0) return null;
      return { start: arr[0], end: arr[arr.length - 1] };
    },
    selectedIdxAsc() {
      return [...this.visualSelectedLines].sort((a, b) => a - b);
    },
    selectionIsContiguous() {
      const a = this.selectedIdxAsc();
      return a.length > 0 && a[a.length - 1] - a[0] === a.length - 1;
    },
    // Ancla para insertar "debajo de la selección": la última línea marcada.
    insertAnchor() {
      const a = this.selectedIdxAsc();
      return a.length ? a[a.length - 1] + 1 : this.editor.parsed.length;
    },

    toggleVisualDense() {
      this.visualDense = !this.visualDense;
      localStorage.visualDense = this.visualDense ? '1' : '0';
      // Imprescindible: las posiciones de los acordes se miden del DOM.
      this.$nextTick(() => this.layoutChords());
    },

    // Mensaje concreto en el indicador de guardado. Va en $nextTick porque el
    // $watch de editor.dirty escribe '● Sin guardar' de forma asíncrona y, si lo
    // pusiéramos de inmediato, ese watcher lo pisaría.
    announce(msg) {
      this.$nextTick(() => this.setSaveIndicator('dirty', msg));
    },

    // Teclado del documento visual. Todo en un sitio para que Supr/Retroceso
    // puedan decidir entre borrar líneas o borrar el acorde seleccionado.
    onVisualKeydown(ev) {
      const mod = ev.ctrlKey || ev.metaKey;
      const k = ev.key;
      if (k === 'Delete' || k === 'Backspace') {
        ev.preventDefault();
        if (this.visualSelectedLines.size > 0) this.deleteSelectedLines();
        else this.deleteSelectedChord();
        return;
      }
      if (mod && (k === 'd' || k === 'D')) {
        ev.preventDefault();
        this.duplicateSelectedLines();
        return;
      }
      if (mod && k === 'Enter') {
        ev.preventDefault();
        this.insertBlankLine();
        return;
      }
      if (ev.altKey && (k === 'ArrowUp' || k === 'ArrowDown')) {
        ev.preventDefault();
        this.moveSelectedLines(k === 'ArrowUp' ? -1 : 1);
        return;
      }
      if (k === 'Escape') {
        this.clearLineSelection();
        return;
      }
      if (k === 'a' && this.arrMode && !mod && !ev.altKey) {
        ev.preventDefault();
        this.insertArrLine();
      }
    },

    // ─────────── Operaciones sobre líneas seleccionadas ───────────
    // Reaplica marcas + layout tras cualquier cambio estructural. Todas las
    // operaciones de abajo terminan aquí para no repetir el mismo trío.
    afterLineEdit(newSelection) {
      this.editor.parsed = [...this.editor.parsed];
      this.commitParsed();
      this.markChorusFlags();
      this.visualSelectedLines = newSelection || new Set();
      this.visualLastClickedLine = null;
      this.$nextTick(() => this.layoutChords());
    },
    // Índices seleccionados, de mayor a menor: así se pueden ir borrando sin
    // que los splice() desplacen los que quedan por procesar.
    selectedIdxDesc() {
      return [...this.visualSelectedLines].sort((a, b) => b - a);
    },
    deleteSelectedLines() {
      const idx = this.selectedIdxDesc();
      if (!idx.length) return;
      const n = idx.length;
      // Sólo preguntamos cuando el borrado es grande: para 1-2 líneas estorba.
      if (n > 2 && !confirm(`¿Borrar ${n} líneas?`)) return;
      for (const i of idx) this.editor.parsed.splice(i, 1);
      this.afterLineEdit();
      this.announce(`🗑 ${n} línea(s) borrada(s) · pulsa 💾 para guardar`);
    },
    // Duplica la selección (letra + acordes) justo debajo. Para repetir un
    // estribillo o una estrofa sin pasar por el raw.
    duplicateSelectedLines() {
      const idx = this.selectedIdxAsc();
      if (!idx.length) return;
      // Copia sólo las líneas marcadas (en orden) y las suelta tras la última.
      const clone = JSON.parse(JSON.stringify(idx.map(i => this.editor.parsed[i])));
      clone.forEach(ln => { delete ln._editing; });
      const at = idx[idx.length - 1] + 1;
      this.editor.parsed.splice(at, 0, ...clone);
      // Deja seleccionada la copia, que es lo que se va a retocar.
      const sel = new Set();
      for (let i = 0; i < clone.length; i++) sel.add(at + i);
      this.afterLineEdit(sel);
      this.announce(`⧉ ${clone.length} línea(s) duplicadas debajo · pulsa 💾`);
    },
    // Copia la selección entera (letra + acordes) al portapapeles interno.
    // Distinto de copyChordPattern(), que copia sólo el patrón de acordes para
    // aplicarlo a OTRA letra.
    copySelectedLines() {
      const idx = this.selectedIdxAsc();
      if (!idx.length) {
        alert('Marca primero las líneas con el círculo ○ del margen izquierdo.');
        return;
      }
      const block = JSON.parse(JSON.stringify(idx.map(i => this.editor.parsed[i])));
      block.forEach(ln => { delete ln._editing; });
      this.visualLineClipboard = block;
      const lyrics = block.filter(l => l.type === 'lyric').length;
      this.clipboardInfo = `⧉ ${block.length} línea(s) copiadas (${lyrics} con letra y acordes)`;
    },
    // Pega el bloque copiado: debajo de la selección, o al final si no hay.
    pasteLinesBelow() {
      const block = this.visualLineClipboard;
      if (!block || !block.length) {
        alert('No has copiado líneas todavía. Marca unas líneas y pulsa "⧉ Copiar líneas".');
        return;
      }
      const clone = JSON.parse(JSON.stringify(block));
      const at = this.insertAnchor();
      this.editor.parsed.splice(at, 0, ...clone);
      const sel = new Set();
      for (let i = 0; i < clone.length; i++) sel.add(at + i);
      this.afterLineEdit(sel);
      this.announce(`⧉ ${clone.length} línea(s) pegadas · pulsa 💾`);
    },
    cancelLineClipboard() {
      this.visualLineClipboard = null;
      this.clipboardInfo = '';
    },
    // Línea en blanco debajo de la selección (o al final). Para separar bloques
    // sin tener que bajar al raw.
    insertBlankLine() {
      this.editor.parsed.splice(this.insertAnchor(), 0, { type: 'blank', raw: '' });
      this.afterLineEdit();
    },
    // Línea de letra nueva y vacía, lista para escribir con el editor de letra.
    insertLyricLine() {
      const at = this.insertAnchor();
      this.editor.parsed.splice(at, 0, { type: 'lyric', lyric: '', chords: [], raw: '' });
      this.afterLineEdit();
      this.$nextTick(() => this.startLyricEdit(at));
    },
    // Mueve cada línea marcada un puesto, procesando en el orden que evita
    // que se pisen entre ellas. Así funciona igual con selección salteada.
    // ─────────── Arrastrar líneas para reordenar ───────────
    // El asa es el gutter (○). Se arrastra la línea, o todo el bloque marcado si
    // la línea que agarras forma parte de la selección.
    startLineDrag(idx, ev) {
      if (ev.button !== 0) return;
      const moving = this.visualSelectedLines.has(idx)
        ? this.selectedIdxAsc()
        : [idx];
      this.lineDrag = { moving, over: idx, startY: ev.clientY, moved: false };

      const onMove = (e) => {
        if (!this.lineDrag) return;
        if (!this.lineDrag.moved && Math.abs(e.clientY - this.lineDrag.startY) < 4) return;
        this.lineDrag.moved = true;
        const target = this.lineIdxAtPoint(e.clientY);
        if (target != null && target !== this.lineDrag.over) {
          this.lineDrag = { ...this.lineDrag, over: target };
        }
      };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        const d = this.lineDrag;
        this.lineDrag = null;
        if (d && d.moved) this.dropLines(d.moving, d.over);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    // Índice de la línea que está bajo esa coordenada vertical.
    lineIdxAtPoint(clientY) {
      const els = document.querySelectorAll('.visual-doc .ed-line');
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (clientY >= r.top && clientY <= r.bottom) {
          const i = parseInt(el.dataset.lineIdx, 10);
          return Number.isNaN(i) ? null : i;
        }
      }
      return null;
    },
    // Reinserta el bloque arrastrado justo DEBAJO de la línea destino.
    dropLines(moving, target) {
      if (!moving || !moving.length || target == null) return;
      if (moving.includes(target)) return;   // soltar dentro de sí mismo: nada
      const arr = this.editor.parsed;
      const block = moving.map(i => arr[i]);
      // Cuántas de las que se mueven estaban por encima del destino: al sacarlas
      // el índice del destino baja justo esa cantidad.
      const removedBefore = moving.filter(i => i < target).length;
      const kept = arr.filter((_, i) => !moving.includes(i));
      const at = target - removedBefore + 1;
      kept.splice(at, 0, ...block);
      this.editor.parsed = kept;
      const sel = new Set();
      for (let i = 0; i < block.length; i++) sel.add(at + i);
      this.afterLineEdit(sel);
      this.announce(`↕ ${block.length} línea(s) movidas · pulsa 💾`);
    },
    lineDragClass(idx) {
      const d = this.lineDrag;
      if (!d || !d.moved) return '';
      if (d.moving.includes(idx)) return 'dragging-line';
      if (d.over === idx) return 'drop-target';
      return '';
    },

    // ─────────── Pegar un bloque de texto como líneas de letra ───────────
    openPasteLines() {
      this.pasteLines = { open: true, text: '', asChorus: false };
    },
    // Cada línea del texto pegado se convierte en una línea del documento. Si
    // trae [acordes] se parsean también, así que vale para pegar ChordPro suelto.
    applyPasteLines() {
      const raw = (this.pasteLines.text || '').replace(/\r\n?/g, '\n');
      if (!raw.trim()) { this.pasteLines.open = false; return; }
      const lines = raw.split('\n').map(t => {
        if (t.trim() === '') return { type: 'blank', raw: '' };
        const { lyric, chords } = parseChordLineToModel(t);
        return { type: 'lyric', lyric, chords, raw: t };
      });
      const block = this.pasteLines.asChorus
        ? [{ type: 'soc', raw: '{soc}' }, ...lines, { type: 'eoc', raw: '{eoc}' }]
        : lines;
      const at = this.insertAnchor();
      this.editor.parsed.splice(at, 0, ...block);
      const sel = new Set();
      for (let i = 0; i < block.length; i++) sel.add(at + i);
      this.afterLineEdit(sel);
      this.pasteLines = { open: false, text: '', asChorus: false };
      this.announce(`📋 ${lines.length} línea(s) pegadas como letra · pulsa 💾`);
    },
    moveSelectedLines(dir) {
      const arr = this.editor.parsed;
      const idx = this.selectedIdxAsc();
      if (!idx.length) return;
      if (dir < 0 && idx[0] === 0) return;
      if (dir > 0 && idx[idx.length - 1] === arr.length - 1) return;
      // Subiendo se recorre de arriba abajo y bajando al revés: así cada
      // intercambio ocurre sobre un hueco ya libre y vale igual para bloques
      // contiguos que para líneas salteadas.
      const order = dir < 0 ? idx : [...idx].reverse();
      for (const i of order) {
        const j = i + dir;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      this.afterLineEdit(new Set(idx.map(i => i + dir)));
    },

    // ─────────── Estribillo: marcar / desmarcar / insertar ───────────
    markSelectionAsChorus() {
      const r = this.selectedLineRange();
      if (!r) return;
      // Un estribillo es un bloque entre {soc} y {eoc}: no puede tener agujeros.
      // Si la selección está salteada avisamos de que se marcará todo el tramo.
      if (!this.selectionIsContiguous() &&
          !confirm('Has marcado líneas salteadas. El estribillo tiene que ser un bloque ' +
                   `seguido, así que se marcará todo el tramo de la ${r.start + 1} a la ${r.end + 1}.\n\n¿Sigo?`)) {
        return;
      }
      // Insertar {eoc} después de r.end y {soc} antes de r.start
      // Pero antes: eliminar cualquier {soc}/{eoc} dentro del rango
      const newParsed = [...this.editor.parsed];
      // Filtramos dentro: marcar los soc/eoc dentro del rango para borrar luego
      const toRemove = new Set();
      for (let i = r.start; i <= r.end; i++) {
        if (newParsed[i] && (newParsed[i].type === 'soc' || newParsed[i].type === 'eoc')) {
          toRemove.add(i);
        }
      }
      const filtered = newParsed.filter((_, i) => !toRemove.has(i));
      // Recalcular el rango (los índices después de quitar pueden haber cambiado)
      // Simplificación: contamos cuántos toRemove están antes de r.start / r.end
      const removedBeforeStart = [...toRemove].filter(i => i < r.start).length;
      const removedInRange = toRemove.size - removedBeforeStart;
      const newStart = r.start - removedBeforeStart;
      const newEnd = r.end - removedBeforeStart - removedInRange;
      // Insertar {eoc} después de newEnd, luego {soc} antes de newStart
      filtered.splice(newEnd + 1, 0, { type: 'eoc', raw: '{eoc}' });
      filtered.splice(newStart, 0, { type: 'soc', raw: '{soc}' });
      this.editor.parsed = filtered;
      this.clearLineSelection();
      this.commitParsed();
      this.markChorusFlags();
      this.$nextTick(() => this.layoutChords());
    },
    unmarkSelectionChorus() {
      const r = this.selectedLineRange();
      if (!r) return;
      // Quitar todos los {soc}/{eoc} dentro del rango y los inmediatamente antes/después
      const toRemove = new Set();
      for (let i = Math.max(0, r.start - 2); i <= Math.min(this.editor.parsed.length - 1, r.end + 2); i++) {
        const ln = this.editor.parsed[i];
        if (ln && (ln.type === 'soc' || ln.type === 'eoc')) toRemove.add(i);
      }
      this.editor.parsed = this.editor.parsed.filter((_, i) => !toRemove.has(i));
      this.clearLineSelection();
      this.commitParsed();
      this.markChorusFlags();
      this.$nextTick(() => this.layoutChords());
    },
    removeChorusMarkerAt(idx) {
      this.editor.parsed.splice(idx, 1);
      this.commitParsed();
      this.markChorusFlags();
      this.$nextTick(() => this.layoutChords());
    },
    // Crea una línea de arreglo vacía en `at` y la deja en edición inline.
    _spawnArrLine(at) {
      const line = { type: 'arr', raw: '{arr: }', text: '', _editing: true };
      const pos = Math.max(0, Math.min(at, this.editor.parsed.length));
      this.editor.parsed.splice(pos, 0, line);
      this.commitParsed();
      this.$nextTick(() => this.layoutChords());
    },
    // Toolbar / atajo "a": inserta al inicio de la selección (o al final).
    insertArrLine() {
      const r = this.selectedLineRange();
      this._spawnArrLine(r ? r.start : this.editor.parsed.length);
    },
    // Botón al vuelo: inserta un arreglo JUSTO ENCIMA de la línea `idx`.
    insertArrAbove(idx) {
      this._spawnArrLine(idx);
    },
    startArrEdit(idx) {
      const ln = this.editor.parsed[idx];
      if (!ln || ln.type !== 'arr') return;
      ln._editing = true;
    },
    // Confirma la edición inline; si queda vacío, elimina la línea.
    commitArrEdit(idx) {
      const ln = this.editor.parsed[idx];
      if (!ln || ln.type !== 'arr') return;
      const t = (ln.text || '').trim();
      if (!t) {
        this.editor.parsed.splice(idx, 1);
      } else {
        ln.text = t;
        ln.raw = '{arr: ' + t + '}';
        ln._editing = false;
      }
      this.commitParsed();
      this.$nextTick(() => this.layoutChords());
    },
    // ─────────── Comentarios ({comment:} / {c:}) ───────────
    startCommentEdit(idx) {
      const ln = this.editor.parsed[idx];
      if (!ln || ln.type !== 'comment') return;
      ln._editing = true;
    },
    // Confirma la edición inline del comentario; si queda vacío, elimina la línea.
    commitCommentEdit(idx) {
      const ln = this.editor.parsed[idx];
      if (!ln || ln.type !== 'comment') return;
      const t = (ln.text || '').trim();
      if (!t) {
        this.editor.parsed.splice(idx, 1);
      } else {
        const tag = ln.tag === 'c' ? 'c' : 'comment';
        ln.text = t;
        ln.raw = '{' + tag + ': ' + t + '}';
        ln._editing = false;
      }
      this.commitParsed();
      this.$nextTick(() => this.layoutChords());
    },
    deleteCommentLine(idx) {
      this.editor.parsed.splice(idx, 1);
      this.commitParsed();
      this.markChorusFlags();
      this.$nextTick(() => this.layoutChords());
    },
    // Inserta un comentario nuevo al inicio de la selección (o al final) y lo abre para editar.
    addComment() {
      const r = this.selectedLineRange();
      const pos = r ? r.start : this.editor.parsed.length;
      const line = { type: 'comment', tag: 'comment', text: '', raw: '{comment: }', _editing: true };
      this.editor.parsed.splice(pos, 0, line);
      this.commitParsed();
      this.$nextTick(() => this.layoutChords());
    },
    // Mueve cualquier línea arriba (-1) o abajo (+1). Usado por los arreglos.
    moveLine(idx, dir) {
      const arr = this.editor.parsed;
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      this.commitParsed();
      this.markChorusFlags();
      this.$nextTick(() => this.layoutChords());
    },
    // Borra una línea arr y refresca el layout (evita que los acordes adyacentes desaparezcan).
    deleteArrLine(idx) {
      this.editor.parsed.splice(idx, 1);
      this.commitParsed();
      this.markChorusFlags();
      this.$nextTick(() => this.layoutChords());
    },
    markChorusFlags() {
      // Anota _inChorus en líneas que estén entre {soc}/{eoc}
      let inside = false;
      for (const ln of this.editor.parsed) {
        if (ln.type === 'soc') { inside = true; ln._inChorus = false; continue; }
        if (ln.type === 'eoc') { inside = false; ln._inChorus = false; continue; }
        ln._inChorus = inside;
      }
    },

    // Devuelve [{startIdx, endIdx, lines}] de cada bloque de estribillo (entre soc/eoc).
    getChorusBlocks() {
      const blocks = [];
      let curStart = -1;
      this.editor.parsed.forEach((ln, i) => {
        if (ln.type === 'soc') { curStart = i; }
        else if (ln.type === 'eoc' && curStart >= 0) {
          const inner = this.editor.parsed.slice(curStart + 1, i);
          blocks.push({ startIdx: curStart, endIdx: i, lines: inner });
          curStart = -1;
        }
      });
      return blocks;
    },
    insertChorusHere() {
      const blocks = this.getChorusBlocks();
      if (blocks.length === 0) return;
      let chosen = 0;
      if (blocks.length > 1) {
        const opts = blocks.map((b, i) => {
          const preview = b.lines
            .filter(l => l.type === 'lyric')
            .map(l => l.lyric)
            .join(' / ')
            .slice(0, 60);
          return `${i + 1}. ${preview}`;
        }).join('\n');
        const r = prompt(`Hay ${blocks.length} estribillos. ¿Cuál insertar? (1-${blocks.length})\n\n${opts}`, '1');
        if (!r) return;
        const n = parseInt(r, 10);
        if (isNaN(n) || n < 1 || n > blocks.length) return;
        chosen = n - 1;
      }
      const block = blocks[chosen];
      // Clonar las líneas (deep clone para no afectar al original)
      const clone = JSON.parse(JSON.stringify(this.editor.parsed.slice(block.startIdx, block.endIdx + 1)));
      // Insertar después de la última línea seleccionada (o al final del doc si no hay)
      const r = this.selectedLineRange();
      const insertAt = r ? r.end + 1 : this.editor.parsed.length;
      // Añadir línea blanca de separación antes y después
      const toInsert = [{ type: 'blank', raw: '' }, ...clone, { type: 'blank', raw: '' }];
      this.editor.parsed.splice(insertAt, 0, ...toInsert);
      // No dejamos seleccionado el bloque pegado: si tocas cualquier otro botón
      // de "Líneas" justo después (borrar, mover...) actuaría sobre el
      // estribillo sin querer, y para seguir trabajando había que acordarse de
      // deseleccionar primero. En su lugar avisamos de DÓNDE ha caído con el
      // mensaje y con un parpadeo breve sobre esas líneas (ver flashLines).
      this.afterLineEdit();
      this.flashLines(insertAt, insertAt + toInsert.length - 1);
      this.announce(r
        ? '🔁 Estribillo insertado debajo de la selección · pulsa 💾'
        : '🔁 Estribillo insertado al final (no había selección) · pulsa 💾');
    },
    // Parpadeo breve (clase CSS pura, ver .flash-inserted) sobre las líneas
    // [from..to] para señalar "esto se acaba de insertar aquí" sin tocar
    // visualSelectedLines. Se hace directo en el DOM porque es puramente
    // decorativo y no necesita sobrevivir a un re-render de Alpine.
    flashLines(from, to) {
      this.$nextTick(() => {
        const els = [];
        for (let i = from; i <= to; i++) {
          const el = document.querySelector(`.ed-line[data-line-idx="${i}"]`);
          if (el) { el.classList.add('flash-inserted'); els.push(el); }
        }
        if (els[0]) els[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
        setTimeout(() => els.forEach(el => el.classList.remove('flash-inserted')), 1400);
      });
    },

    // ─────────── Copiar / pegar patrón de acordes ───────────
    copyChordPattern() {
      const r = this.selectedLineRange();
      if (!r) {
        alert('Primero selecciona las líneas que tienen los acordes que quieres copiar.\n\n→ Haz click en el círculo ○ del margen IZQUIERDO de cada línea (se pondrá azul ◉).\n→ Luego pulsa "📋 Copiar acordes".');
        return;
      }
      const pattern = [];
      for (let i = r.start; i <= r.end; i++) {
        const ln = this.editor.parsed[i];
        if (ln && ln.type === 'lyric') {
          pattern.push({
            lyric: ln.lyric,
            chords: JSON.parse(JSON.stringify(ln.chords)),
          });
        }
      }
      if (pattern.length === 0) { alert('No hay líneas de letra en la selección.'); return; }
      this.visualChordClipboard = pattern;
      const total = pattern.reduce((acc, p) => acc + p.chords.length, 0);
      this.clipboardInfo = `📋 ${total} acordes copiados de ${pattern.length} línea(s)`;
      // Limpiar selección para que el usuario seleccione el destino sin mezclar origen
      this.clearLineSelection();
    },
    cancelChordClipboard() {
      this.visualChordClipboard = null;
      this.clipboardInfo = '';
    },
    pasteChordPattern() {
      if (!this.visualChordClipboard) {
        alert('No tienes acordes copiados todavía. Primero pulsa "📋 Copiar acordes" sobre una estrofa que tenga los acordes que quieras reutilizar.');
        return;
      }
      const r = this.selectedLineRange();
      if (!r) {
        alert('Selecciona las líneas DESTINO donde quieres pegar los acordes.\n\n→ Haz click en el círculo ○ del margen izquierdo de cada línea (se pondrá azul ◉).\n→ Luego pulsa "📥 Pegar acordes".');
        return;
      }
      // Recoger las líneas de letra de la selección
      const targets = [];
      for (let i = r.start; i <= r.end; i++) {
        const ln = this.editor.parsed[i];
        if (ln && ln.type === 'lyric') targets.push(ln);
      }
      if (targets.length === 0) { alert('No hay líneas de letra en la selección.'); return; }
      // Mapear: línea N del clipboard → línea N del target (si existe)
      let totalPasted = 0;
      for (let n = 0; n < targets.length; n++) {
        const src = this.visualChordClipboard[Math.min(n, this.visualChordClipboard.length - 1)];
        const newChords = mapChordsByWord(src, targets[n].lyric);
        targets[n].chords = newChords;
        totalPasted += newChords.length;
      }
      // Forzar que Alpine detecte el cambio reasignando el array
      this.editor.parsed = [...this.editor.parsed];
      this.commitParsed();
      this.$nextTick(() => {
        this.layoutChords();
        this.setSaveIndicator('saved', `✓ ${totalPasted} acordes pegados en ${targets.length} línea(s)`);
        setTimeout(() => { if (this.editor.dirty) this.setSaveIndicator('dirty', '● Sin guardar'); }, 2500);
      });
      // Mantenemos el clipboard por si quiere pegar en otra estrofa más
    },

    // Mensaje de ayuda contextual sobre el flujo copiar/pegar
    copyPasteHint() {
      const hasSel = this.visualSelectedLines.size > 0;
      const hasClip = !!this.visualChordClipboard;
      if (hasClip && hasSel) return '③ Pulsa 📥 Pegar acordes para aplicarlos a las líneas seleccionadas.';
      if (hasClip && !hasSel) return '② Acordes copiados ✓ — ahora marca las líneas DESTINO con el círculo ○ del margen izquierdo y pulsa 📥 Pegar.';
      if (!hasClip && hasSel) return '② Pulsa 📋 Copiar acordes para guardar el patrón, luego marca el destino.';
      return '① Para copiar acordes entre estrofas: marca las líneas ORIGEN haciendo click en el círculo ○ del margen izquierdo, luego pulsa 📋 Copiar.';
    },

    // ─────────── Transposición de tono ───────────
    transposeSong(semis) {
      if (!semis || !this.editor.parsed) return;
      const target = computeTransposedKey(this.editor.meta.key, semis);
      const useFlats = target ? target.useFlats : (semis < 0);
      let count = 0;
      for (const ln of this.editor.parsed) {
        if (ln.type === 'lyric' && ln.chords) {
          ln.chords = ln.chords.map(c => {
            const nt = transposeChordText(c.text, semis, useFlats);
            if (nt !== c.text) count++;
            return { ...c, text: nt };
          });
        }
      }
      if (target && this.editor.meta.key) {
        this.editor.meta.key = target.key;
        this.updateMetaInRaw('key', target.key);
      }
      this.editor.parsed = [...this.editor.parsed];
      this.commitParsed();
      this.$nextTick(() => this.layoutChords());
      const dir = semis > 0 ? `+${semis}` : `${semis}`;
      this.setSaveIndicator('dirty', `🎵 ${count} acordes transpuestos (${dir} semitono${Math.abs(semis) === 1 ? '' : 's'})${target ? ' → ' + target.key : ''} · pulsa 💾 para guardar`);
    },
    transposeSongToKey(targetKey) {
      if (!targetKey) return;
      const curKey = this.editor.meta.key || '';
      if (!curKey) {
        alert('Esta canción no tiene tono indicado en los metadatos. Escribe primero el tono actual (ej. "D") en el campo "Tono (key)" y luego usa "Llevar a".');
        return;
      }
      const curM = curKey.match(/^([A-G])([#b]?)/);
      const tgtM = targetKey.match(/^([A-G])([#b]?)/);
      if (!curM || !tgtM) { alert('No reconozco el tono "' + curKey + '" → "' + targetKey + '".'); return; }
      const curIdx = NOTE_INDEX[curM[1] + curM[2]];
      const tgtIdx = NOTE_INDEX[tgtM[1] + tgtM[2]];
      if (curIdx == null || tgtIdx == null) { alert('Tono no reconocido.'); return; }
      let semis = tgtIdx - curIdx;
      // dirección más corta
      if (semis > 6) semis -= 12;
      if (semis < -6) semis += 12;
      if (semis === 0) {
        this.setSaveIndicator('saved', 'La canción ya está en ' + targetKey);
        return;
      }
      this.transposeSong(semis);
    },
    commonKeyOptions() {
      return ['C','C#','Db','D','Eb','E','F','F#','Gb','G','Ab','A','Bb','B',
              'Cm','C#m','Dm','Ebm','Em','Fm','F#m','Gm','G#m','Am','Bbm','Bm'];
    },

    // ─────────── Editar texto de la letra ───────────
    // ─────────── Edición de letra en línea ───────────
    // Antes esto era un prompt() del navegador: te tapaba la canción y no dejaba
    // ver los acordes mientras escribías. Ahora es un input colocado en el sitio
    // de la letra, con la misma fuente, y los acordes siguen encima a la vista.
    startLyricEdit(idx) {
      const ln = this.editor.parsed[idx];
      if (!ln || ln.type !== 'lyric') return;
      // Sólo una línea en edición a la vez.
      this.editor.parsed.forEach((l, i) => {
        if (l._editing && i !== idx && l.type === 'lyric') this.commitLyricEdit(i);
      });
      ln._draft = ln.lyric;
      ln._editing = true;
      this.editor.parsed = [...this.editor.parsed];
    },
    cancelLyricEdit(idx) {
      const ln = this.editor.parsed[idx];
      if (!ln) return;
      ln._editing = false;
      delete ln._draft;
      this.editor.parsed = [...this.editor.parsed];
      this.$nextTick(() => this.layoutChords());
    },
    // `advance`: con Tab salta a editar la siguiente línea de letra, para poder
    // repasar una estrofa entera sin volver a coger el ratón.
    commitLyricEdit(idx, advance) {
      const ln = this.editor.parsed[idx];
      if (!ln || ln.type !== 'lyric' || !ln._editing) return;
      const draft = ln._draft != null ? ln._draft : ln.lyric;
      ln._editing = false;
      delete ln._draft;
      // Si escribes corchetes se toman como acordes de verdad. Si no lo hiciéramos
      // se guardarían como texto literal en el .cho y al recargar se volverían
      // acordes de todas formas, pero pegados donde no toca.
      const parsed = parseChordLineToModel(draft);
      const typedChords = parsed.chords.length > 0;
      const nextLyric = typedChords ? parsed.lyric : draft;
      if (nextLyric !== ln.lyric || typedChords) {
        ln.chords = typedChords
          ? parsed.chords
          : remapChordsToNewLyric(ln.chords, ln.lyric, nextLyric);
        ln.lyric = nextLyric;
        this.editor.parsed = [...this.editor.parsed];
        this.commitParsed();
      } else {
        this.editor.parsed = [...this.editor.parsed];
      }
      this.$nextTick(() => this.layoutChords());
      if (advance) {
        const nextIdx = this.editor.parsed.findIndex((l, i) => i > idx && l.type === 'lyric');
        if (nextIdx >= 0) this.$nextTick(() => this.startLyricEdit(nextIdx));
      }
    },

    // ─────────── Resaltado del editor raw ───────────
    // Devuelve HTML con las directivas, comentarios, marcas de estribillo y
    // acordes envueltos en <span>. Se pinta en la capa de debajo del textarea.
    // OJO: sólo se cambian colores/peso, nunca el tamaño de letra ni el
    // espaciado — el textarea de encima no puede estilar partes de su texto, así
    // que cualquier cambio de métrica descuadraría el cursor de la letra.
    // Cada línea se emite como DOS celdas de una rejilla: número + contenido.
    // Así el número queda pegado arriba de su línea aunque ésta ocupe varias
    // visuales al hacer wrap — con una columna aparte se descuadraría.
    highlightCho(text) {
      const lines = String(text == null ? '' : text).split('\n');
      let out = '';
      for (let i = 0; i < lines.length; i++) {
        out += '<span class="raw-num">' + (i + 1) + '</span>';
        // Espacio de ancho cero en las vacías: sin contenido la celda mediría 0
        // de alto y dejaría de cuadrar con la línea del textarea.
        out += '<span class="raw-code">' + (this.highlightChoLine(lines[i]) || '&#8203;') + '</span>';
      }
      return out;
    },
    highlightChoLine(line) {
      const esc = (s) => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      const re = /\{[^}\n]*\}|\[[^\]\n]*\]/g;
      let out = '';
      let last = 0;
      let m;
      while ((m = re.exec(line)) !== null) {
        out += esc(line.slice(last, m.index));
        const tok = m[0];
        if (tok[0] === '[') {
          // Los que no parecen un acorde se marcan: chivato barato de erratas.
          const cls = isKnownChord(tok.slice(1, -1)) ? 'hl-chord' : 'hl-chord hl-chord-bad';
          const title = cls.endsWith('bad') ? ' title="No parece un acorde"' : '';
          out += '<span class="' + cls + '"' + title + '>' + esc(tok) + '</span>';
        } else {
          const inner = tok.slice(1, -1).trim().toLowerCase();
          let cls = 'hl-directive';
          if (/^(c|comment)\s*:/.test(inner)) cls = 'hl-comment';
          else if (/^(soc|eoc|start_of_chorus|end_of_chorus)$/.test(inner)) cls = 'hl-chorus';
          else if (/^arr\s*:/.test(inner)) cls = 'hl-arr';
          out += '<span class="' + cls + '">' + esc(tok) + '</span>';
        }
        last = m.index + tok.length;
      }
      out += esc(line.slice(last));
      return out;
    },
    // Cuántos [corchetes] del contenido actual no parecen un acorde.
    unknownChordCount() {
      const toks = String(this.editor.content || '').match(/\[[^\]\n]*\]/g) || [];
      return toks.filter(t => !isKnownChord(t.slice(1, -1))).length;
    },

    refreshMetaFromRaw() {
      const c = this.editor.content;
      const get = (k) => {
        const m = c.match(new RegExp('\\{\\s*' + k + '\\s*:\\s*(.*?)\\s*\\}', 'i'));
        return m ? m[1] : '';
      };
      this.editor.meta.title = get('title');
      this.editor.meta.artist = get('artist') || get('author');
      this.editor.meta.key = get('key');
      const capoStr = get('capo');
      this.editor.meta.capo = /^\d+$/.test(capoStr) ? parseInt(capoStr, 10) : 0;
      this.editor.meta.has_todo = /\bTO\s+DO\b/i.test(c);
      this.editor.meta.has_chord_review = /♩\s*REVISAR\s*ACORDES/i.test(c);
    },
    updateMetaInRaw(key, value) {
      // Updates the {key: value} line in the raw content. If absent, inserts after title.
      const c = this.editor.content;
      const re = new RegExp('\\{\\s*' + key + '\\s*:\\s*[^}]*\\}', 'i');
      const replacement = `{${key}: ${value}}`;
      let next;
      if (re.test(c)) {
        next = c.replace(re, replacement);
      } else {
        // insert after first non-comment header line, or at top
        const lines = c.split('\n');
        let insertAt = 0;
        for (let i = 0; i < lines.length; i++) {
          if (/^\{(title|comment|artist|author|key|capo)/i.test(lines[i])) insertAt = i + 1;
          else if (lines[i].trim() === '' && insertAt > 0) break;
        }
        lines.splice(insertAt, 0, replacement);
        next = lines.join('\n');
      }
      if (next !== c) {
        this.recordUndo(c, 'meta:' + key);
        this.editor.content = next;
        this.editor.dirty = true;
        // Y el modelo del visual también, o se pierde el cambio: cualquier
        // acción del visual llama a commitParsed(), que reserializa desde
        // editor.parsed y machacaría el {título} que acabamos de escribir.
        this.syncMetaIntoParsed(key, value);
      }
    },
    // Refleja un {key: value} del panel de metadatos en editor.parsed.
    syncMetaIntoParsed(key, value) {
      const parsed = this.editor.parsed;
      if (!parsed || !parsed.length) return;
      const raw = `{${key}: ${value}}`;
      const re = new RegExp('^\\s*\\{\\s*' + key + '\\s*:', 'i');
      const at = parsed.findIndex(ln => ln.type === 'directive' && re.test(ln.raw || ''));
      if (at >= 0) {
        parsed[at] = { ...parsed[at], raw };
      } else {
        // No existía: la colocamos al final del bloque de cabecera, igual que
        // hace updateMetaInRaw() con el texto crudo.
        let insertAt = 0;
        for (let i = 0; i < parsed.length; i++) {
          const ln = parsed[i];
          if (ln.type === 'directive' || ln.type === 'comment') insertAt = i + 1;
          else if (ln.type === 'blank' && insertAt > 0) break;
        }
        parsed.splice(insertAt, 0, { type: 'directive', raw });
      }
      this.editor.parsed = [...parsed];
    },
    async saveSong() {
      if (!this.editor.dirty) return;
      this.setSaveIndicator('saving', 'Guardando…');
      try {
        const r = await fetch('/api/song?path=' + encodeURIComponent(this.editor.path), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: this.editor.content }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this.editor.originalContent = this.editor.content;
        this.editor.dirty = false;
        this.lastSaveAt = new Date();
        this.setSaveIndicator('saved', '✓ Guardado · haz commit cuando termines');
        await this.loadCatalog();
      } catch (e) {
        this.setSaveIndicator('error', '✗ Error guardando');
        alert('Error guardando: ' + e.message);
      }
    },
    setSaveIndicator(cls, text) { this.saveIndicator = { cls, text }; },
    async deleteSong(r) {
      if (!confirm(`¿Borrar "${r.title}" (${r.filename})? Se hace backup en songs-backup-edits.`)) return;
      try {
        const res = await fetch('/api/song?path=' + encodeURIComponent(r.path), { method: 'DELETE' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        await this.loadCatalog();
      } catch (e) {
        alert('Error: ' + e.message);
      }
    },
    // ─────────── Mover canción de categoría ───────────
    openMoveModal(r) {
      this.moveModal = {
        path: r.path, title: r.title, fromLetter: r.category_letter,
        targetLetter: '', number: '', suggested: null, saving: false,
      };
    },
    async onMoveCategoryChange() {
      const m = this.moveModal;
      if (!m || !m.targetLetter) { if (m) { m.suggested = null; m.number = ''; } return; }
      try {
        const r = await fetch('/api/doce/suggest-number?category=' + encodeURIComponent(m.targetLetter));
        if (r.ok) {
          const j = await r.json();
          m.suggested = j.next_number;
          m.number = j.next_number;  // prefill con el hueco libre; el usuario puede cambiarlo
        }
      } catch (_) { /* silencio: el backend elegirá hueco si se deja vacío */ }
    },
    async doMoveSong() {
      const m = this.moveModal;
      if (!m || !m.targetLetter) { alert('Elige la categoría destino'); return; }
      m.saving = true;
      try {
        const r = await fetch('/api/song/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: m.path,
            category_letter: m.targetLetter,
            number: m.number !== '' ? m.number : undefined,
          }),
        });
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.error || ('HTTP ' + r.status));
        }
        this.moveModal = null;
        await this.loadCatalog();
      } catch (e) {
        alert('Error moviendo: ' + e.message);
        m.saving = false;
      }
    },
    // ─────────── Estado de revisión (editor individual) ───────────
    editorStatus() {
      if (this.editor.meta.has_todo) return 'revisar';
      if (this.editor.meta.has_chord_review) return 'revisar_acordes';
      return null;
    },
    setEditorStatus(status) {
      // Quita ambos markers y añade el que corresponde
      let lines = this.editor.content.split('\n');
      lines = lines.filter(ln =>
        !/\{\s*comment\s*:[^}]*\bTO\s+DO\b[^}]*\}/i.test(ln) &&
        !/\{\s*comment\s*:[^}]*♩\s*REVISAR\s*ACORDES[^}]*\}/i.test(ln)
      );
      if (status === 'revisar' || status === 'revisar_acordes') {
        const marker = status === 'revisar'
          ? '{comment: TO DO: PENDIENTE REVISIÓN ACORDES}'
          : '{comment: ♩ REVISAR ACORDES}';
        let insertAt = 0;
        for (let i = 0; i < lines.length; i++) {
          if (/^\{(title|comment|artist|author|key|capo)/i.test(lines[i])) insertAt = i + 1;
          else if (lines[i].trim() === '' && insertAt > 0) break;
        }
        lines.splice(insertAt, 0, marker);
      }
      this.editor.content = lines.join('\n');
      this.editor.dirty = true;
      this.editor.meta.has_todo = status === 'revisar';
      this.editor.meta.has_chord_review = status === 'revisar_acordes';
    },

    // ─────────── Etiquetas ───────────
    async loadTags() {
      this.tagsLoading = true;
      try {
        const r = await fetch('/api/tags');
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this.allTags = (await r.json()).tags || [];
      } catch (e) {
        console.warn('No se han podido cargar las etiquetas:', e);
      } finally {
        this.tagsLoading = false;
      }
    },
    tagBySlug(slug) {
      return this.allTags.find(t => t.slug === slug) || null;
    },
    tagLabelOf(slug) {
      const t = this.tagBySlug(slug);
      return t ? t.label : prettyTagLabel(slug);
    },
    tagEmojiOf(slug) {
      const t = this.tagBySlug(slug);
      return t ? (t.emoji || '') : '';
    },
    tagIsUndeclared(slug) {
      const t = this.tagBySlug(slug);
      return !!t && !t.declared;
    },
    get maxTagCount() {
      return this.allTags.reduce((m, t) => Math.max(m, t.count), 0) || 1;
    },
    filteredTags() {
      const q = this.tagSearch.trim().toLowerCase();
      return this.allTags.filter(t => {
        if (this.tagOnlyUndeclared && t.declared) return false;
        if (!q) return true;
        return t.slug.includes(q) || t.label.toLowerCase().includes(q)
            || (t.alias || []).some(a => a.includes(q));
      });
    },

    // Ir a la pestaña de etiquetas y abrir una concreta.
    goTags(slug) {
      this.view = 'tags';
      this.loadTags().then(() => { if (slug) this.openTagEditor(slug); });
    },
    async openTagEditor(slug) {
      const t = this.tagBySlug(slug);
      this.tagEdit = slug;
      this.tagForm = {
        label: t ? t.label : prettyTagLabel(slug),
        emoji: t ? (t.emoji || '') : '',
        destacada: !!(t && t.destacada),
        orden: t && t.orden !== null && t.orden !== undefined ? String(t.orden) : '',
        alias: t ? [...(t.alias || [])] : [],
      };
      this.tagMerge = { into: '', mode: 'alias' };
      this.tagSongs = [];
      try {
        const r = await fetch('/api/tags/songs?slug=' + encodeURIComponent(slug));
        if (r.ok) this.tagSongs = (await r.json()).songs || [];
      } catch (e) { /* la lista es un extra, no bloquea la edición */ }
    },
    closeTagEditor() { this.tagEdit = null; this.tagSongs = []; },

    async saveTag() {
      if (!this.tagEdit) return;
      this.tagSaving = true;
      try {
        const body = {
          label: this.tagForm.label,
          emoji: this.tagForm.emoji,
          destacada: this.tagForm.destacada,
          alias: this.tagForm.alias,
        };
        if (String(this.tagForm.orden).trim() !== '') body.orden = this.tagForm.orden;
        const r = await fetch('/api/tags/' + encodeURIComponent(this.tagEdit), {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this.allTags = (await r.json()).tags || [];
      } catch (e) {
        alert('Error guardando la etiqueta: ' + e.message);
      } finally {
        this.tagSaving = false;
      }
    },

    // Renombrar el SLUG reescribe los .cho. Cambiar solo el nombre visible NO
    // necesita esto: para eso está el label, que no toca ni un fichero.
    async renameTagSlug() {
      if (!this.tagEdit) return;
      const proposed = prompt(
        'Nuevo identificador (slug) de la etiqueta.\n\n' +
        'Esto REESCRIBE la directiva {tags:} de todas las canciones que la usan.\n' +
        'Si solo quieres cambiar cómo se ve, edita el nombre de arriba.',
        this.tagEdit);
      if (proposed === null) return;
      const next = slugifyTag(proposed);
      if (!next || next === this.tagEdit) return;
      this.tagSaving = true;
      try {
        const r = await fetch('/api/tags/rename', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: this.tagEdit, new_slug: next }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        this.allTags = j.tags || [];
        await this.loadCatalog();
        this.openTagEditor(next);
        alert(`Renombrada a "${next}" en ${j.changed} canción(es).`);
      } catch (e) {
        alert('Error renombrando: ' + e.message);
      } finally {
        this.tagSaving = false;
      }
    },

    async mergeTag() {
      const into = slugifyTag(this.tagMerge.into);
      if (!this.tagEdit || !into || into === this.tagEdit) return;
      const mode = this.tagMerge.mode;
      const msg = mode === 'alias'
        ? `Se declarará "${this.tagEdit}" como alias de "${into}".\n\n` +
          'No se toca ningún fichero: las canciones siguen igual y la app las ' +
          'muestra bajo la etiqueta buena. Es reversible.'
        : `Se reescribirá "${this.tagEdit}" como "${into}" en TODAS sus canciones.\n\n` +
          'Esto sí toca los .cho (con backup de cada uno). Es definitivo.';
      if (!confirm(msg)) return;
      this.tagSaving = true;
      try {
        const r = await fetch('/api/tags/merge', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: [this.tagEdit], into, mode }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        this.allTags = j.tags || [];
        await this.loadCatalog();
        this.openTagEditor(into);
      } catch (e) {
        alert('Error fundiendo: ' + e.message);
      } finally {
        this.tagSaving = false;
      }
    },

    async deleteTag(purge) {
      if (!this.tagEdit) return;
      const t = this.tagBySlug(this.tagEdit);
      const n = t ? t.count : 0;
      const msg = purge
        ? `¿Quitar "${this.tagEdit}" de las ${n} canciones que la llevan?\n\n` +
          'Se reescriben los .cho (con backup de cada uno).'
        : `¿Quitar "${this.tagEdit}" del catálogo?\n\n` +
          `Las ${n} canciones la conservan y sigue funcionando: solo pierde el ` +
          'nombre bonito, el emoji y los alias.';
      if (!confirm(msg)) return;
      this.tagSaving = true;
      try {
        const r = await fetch('/api/tags/' + encodeURIComponent(this.tagEdit)
                              + (purge ? '?purge=1' : ''), { method: 'DELETE' });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this.allTags = (await r.json()).tags || [];
        this.closeTagEditor();
        if (purge) await this.loadCatalog();
      } catch (e) {
        alert('Error borrando: ' + e.message);
      } finally {
        this.tagSaving = false;
      }
    },

    // ── Etiquetado en bloque desde el catálogo ──
    async applyBulkTags() {
      const paths = [...this.selectedCatalogPaths];
      if (!paths.length) return;
      if (!this.bulkTagsAdd.length && !this.bulkTagsRemove.length) return;
      const parts = [];
      if (this.bulkTagsAdd.length) parts.push('poner ' + this.bulkTagsAdd.join(', '));
      if (this.bulkTagsRemove.length) parts.push('quitar ' + this.bulkTagsRemove.join(', '));
      if (!confirm(`¿En ${paths.length} canción(es): ${parts.join(' y ')}?`)) return;
      this.bulkTagging = true;
      try {
        const r = await fetch('/api/songs/bulk-tags', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths, add: this.bulkTagsAdd, remove: this.bulkTagsRemove }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        this.allTags = j.tags || [];
        const failed = (j.results || []).filter(x => !x.ok);
        this.bulkTagsAdd = [];
        this.bulkTagsRemove = [];
        await this.loadCatalog();
        if (failed.length) {
          alert('No se pudieron etiquetar:\n' +
                failed.map(f => `· ${f.path} — ${f.error}`).join('\n'));
        }
      } catch (e) {
        alert('Error etiquetando: ' + e.message);
      } finally {
        this.bulkTagging = false;
      }
    },

    // ── Sugerencias al importar ──
    // El backend solo propone etiquetas que YA existen: inventar vocabulario
    // solo, sin que nadie lo mire, es lo que degenera un sistema de etiquetas
    // libres. Aquí se aceptan con un toque o se ignoran.
    tagsForImport(id) { return this.importTagsById[id] || []; },
    setTagsForImport(id, tags) {
      this.importTagsById = { ...this.importTagsById, [id]: tags };
    },
    async suggestImportTags(m) {
      if (!this.allTags.length) return;
      if (this.importSuggestions[m.docx_id]) return;
      try {
        const qs = new URLSearchParams({
          title: m.title || '', category: m.section_letter || '', limit: '4',
        });
        const r = await fetch('/api/tags/suggest?' + qs.toString());
        if (!r.ok) return;
        const j = await r.json();
        this.importSuggestions = {
          ...this.importSuggestions, [m.docx_id]: j.suggestions || [],
        };
      } catch (e) { /* las sugerencias son un extra */ }
    },
    // Pide sugerencias para todo lo que se ve, de una tacada.
    async suggestAllVisibleImports() {
      const rows = this.filteredMissing().slice(0, 60);
      for (const m of rows) await this.suggestImportTags(m);
    },

    // ─────────── Selección bulk en catálogo ───────────
    toggleCatalogSelect(path) {
      if (this.selectedCatalogPaths.has(path)) this.selectedCatalogPaths.delete(path);
      else this.selectedCatalogPaths.add(path);
      this.selectedCatalogPaths = new Set(this.selectedCatalogPaths);
    },
    selectAllCatalog() {
      this.selectedCatalogPaths = new Set(this.filteredRepoSongs().map(r => r.path));
    },
    clearCatalogSelect() {
      this.selectedCatalogPaths = new Set();
    },
    async bulkSetStatus(status) {
      const n = this.selectedCatalogPaths.size;
      if (n === 0) return;
      const label = status === 'revisar' ? 'Revisar canción'
                  : status === 'revisar_acordes' ? 'Revisar acordes'
                  : 'Sin revisión pendiente';
      if (!confirm(`¿Marcar ${n} canción(es) como "${label}"?`)) return;
      try {
        const r = await fetch('/api/songs/bulk-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths: [...this.selectedCatalogPaths], status: status || null }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this.selectedCatalogPaths = new Set();
        await this.loadCatalog();
      } catch (e) {
        alert('Error: ' + e.message);
      }
    },

    // Mueve todas las seleccionadas a una categoría. Los números los reparte el
    // backend sobre la marcha para que no choquen entre ellas.
    async bulkMoveToCategory() {
      const paths = [...this.selectedCatalogPaths];
      const cat = this.bulkMoveCategory;
      if (!paths.length || !cat) return;
      const catName = (this.data?.categories || []).find(c => c.letter === cat);
      const label = catName ? catName.title : cat;
      if (!confirm(`¿Mover ${paths.length} canción(es) a "${label}"?\n\n` +
                   'Se renumeran en el destino y se hace backup de cada una antes de moverla.')) return;
      this.bulkMoving = true;
      try {
        const r = await fetch('/api/songs/bulk-move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths, category_letter: cat }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const { results } = await r.json();
        const okN = results.filter(x => x.ok).length;
        const failed = results.filter(x => !x.ok);
        this.selectedCatalogPaths = new Set();
        this.bulkMoveCategory = '';
        await this.loadCatalog();
        if (failed.length) {
          alert(`Movidas ${okN} de ${results.length}.\n\nNo se pudieron mover:\n` +
                failed.map(f => `· ${f.path} — ${f.error}`).join('\n'));
        }
      } catch (e) {
        alert('Error moviendo: ' + e.message);
      } finally {
        this.bulkMoving = false;
      }
    },

    // ─────────── Backups ───────────
    async loadBackups() {
      this.backups.loading = true;
      try {
        const r = await fetch('/api/backups');
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const d = await r.json();
        this.backups.sessions = d.sessions;
        this.backups.total_size_bytes = d.total_size_bytes;
      } catch (e) {
        alert('Error cargando backups: ' + e.message);
      } finally {
        this.backups.loading = false;
      }
    },
    async deleteBackupSession(id) {
      if (!confirm(`¿Borrar la sesión de backup ${id}? Esta acción no se puede deshacer.`)) return;
      try {
        const r = await fetch('/api/backups/' + id, { method: 'DELETE' });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        await this.loadBackups();
      } catch (e) {
        alert('Error: ' + e.message);
      }
    },
    async cleanupBackups() {
      const keep = parseInt(this.backups.keepLast);
      const toDelete = Math.max(0, this.backups.sessions.length - keep);
      if (toDelete === 0) return;
      if (!confirm(`¿Borrar ${toDelete} sesión(es) antigua(s) y conservar las ${keep} más recientes?`)) return;
      try {
        const r = await fetch('/api/backups/cleanup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keep_last: keep }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        await this.loadBackups();
      } catch (e) {
        alert('Error: ' + e.message);
      }
    },
    async deleteAllBackups() {
      if (this.backups.sessions.length === 0) return;
      if (!confirm(`¿Borrar TODOS los ${this.backups.sessions.length} backups? Esta acción no se puede deshacer.`)) return;
      try {
        const r = await fetch('/api/backups/cleanup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keep_last: 0 }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        await this.loadBackups();
      } catch (e) {
        alert('Error: ' + e.message);
      }
    },
    // ─────────── Peticiones de la gente ───────────
    goPeticiones() {
      this.view = 'peticiones';
      if (!this.peticiones.loaded) this.loadPeticiones();
    },
    _applyPeticiones(d) {
      this.peticiones.updatedAt = d.updatedAt;
      this.peticiones.solicitudes = d.solicitudes || [];
      this.peticiones.fallitos = d.fallitos || [];
      if (d.counts) this.peticiones.counts = d.counts;
    },
    async loadPeticiones() {
      this.peticiones.loading = true; this.peticiones.error = null;
      try {
        const r = await fetch('/api/peticiones');
        const d = await r.json();
        if (!d.ok) throw new Error(d.error || ('HTTP ' + r.status));
        this._applyPeticiones(d);
        this.peticiones.loaded = true;
      } catch (e) {
        this.peticiones.error = 'No pude cargar las peticiones guardadas: ' + e.message;
      } finally {
        this.peticiones.loading = false;
      }
    },
    async refreshPeticiones() {
      this.peticiones.refreshing = true;
      this.peticiones.error = null;
      this.peticiones.message = '';
      try {
        const r = await fetch('/api/peticiones/refresh', { method: 'POST' });
        const d = await r.json();
        if (!d.ok) throw new Error(d.error || ('HTTP ' + r.status));
        this._applyPeticiones(d);
        this.peticiones.loaded = true;
        const ns = d.new_solicitudes || 0, nf = d.new_fallitos || 0;
        let novedad = (ns || nf)
          ? `${ns} solicitud(es) y ${nf} fallito(s) nuevos`
          : 'sin novedades';
        this.peticiones.message =
          `✓ Hecho · ${d.counts.solicitudes_total} solicitudes y ${d.counts.fallitos_total} fallitos guardados (${novedad}). ` +
          `Guardado en ${d.saved_to || 'peticiones/peticiones.json'} — haz git commit para conservarlo.`;
      } catch (e) {
        this.peticiones.error = 'No pude consultar Firebase: ' + e.message;
      } finally {
        this.peticiones.refreshing = false;
      }
    },
    async commitPeticiones() {
      this.peticiones.committing = true;
      this.peticiones.error = null;
      try {
        const r = await fetch('/api/peticiones/commit', { method: 'POST' });
        const d = await r.json();
        if (!d.ok) throw new Error(d.error || ('HTTP ' + r.status));
        this.peticiones.message = '✓ ' + (d.message || 'Guardado en el repo.');
        this.loadGitStatus(true);
      } catch (e) {
        this.peticiones.error = 'No pude guardar en el repo: ' + e.message;
      } finally {
        this.peticiones.committing = false;
      }
    },
    fmtFecha(x) {
      const v = x && (x.requestedAt || x.reportedAt || x._lastFetched);
      if (!v) return '—';
      try { return new Date(v).toLocaleString('es-ES'); } catch (e) { return v; }
    },

    formatBytes(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },

    // ─────────── Nueva canción ───────────
    openNewSongModal() {
      this.newSong = { open: true, category: '', title: '', artist: '', key: '', capo: 0,
                       number: null, mode: 'blank', content: '', creating: false };
    },
    async createNewSong() {
      if (!this.newSong.category || !this.newSong.title) return;
      this.newSong.creating = true;
      try {
        const r = await fetch('/api/song/new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: this.newSong.category,
            title: this.newSong.title,
            artist: this.newSong.artist,
            key: this.newSong.key,
            capo: parseInt(this.newSong.capo) || 0,
            number: this.newSong.number || undefined,
            mode: this.newSong.mode,
            content: this.newSong.content,
          }),
        });
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.error || ('HTTP ' + r.status));
        }
        const { path } = await r.json();
        this.newSong.open = false;
        await this.loadCatalog();
        await this.openEditor(path);
      } catch (e) {
        alert('Error creando: ' + e.message);
      } finally {
        this.newSong.creating = false;
      }
    },

    // ─────────── Preview HTML render ───────────
    renderPreviewHtml(cho) {
      if (!cho) return '';
      const esc = (s) => String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
      }[c]));
      const lines = cho.split('\n');
      const out = [];
      let inChorus = false;
      for (const ln of lines) {
        const trimmed = ln.trim();
        if (/^\{title\s*:/.test(trimmed)) {
          const m = trimmed.match(/^\{title\s*:\s*(.*?)\s*\}/i);
          out.push(`<h3 class="pv-title">${esc(m ? m[1] : '')}</h3>`);
          continue;
        }
        if (/^\{(comment|artist|author|key|capo)\s*:/.test(trimmed)) {
          const m = trimmed.match(/^\{(\w+)\s*:\s*(.*?)\s*\}/i);
          out.push(`<div class="pv-meta">${m ? esc(m[1] + ': ' + m[2]) : esc(trimmed)}</div>`);
          continue;
        }
        if (/^\{soc\}/.test(trimmed)) { inChorus = true; out.push('<div class="pv-chorus">'); continue; }
        if (/^\{eoc\}/.test(trimmed)) { inChorus = false; out.push('</div>'); continue; }
        // Cualquier otro directive ({ritmo}, {tiempo}, {video}, {youtube}, …):
        // se muestra como metadato discreto, no como letra con corchetes a la vista.
        if (/^\{[a-z_]+\s*[:}]/i.test(trimmed)) {
          const m = trimmed.match(/^\{(\w+)\s*:\s*(.*?)\s*\}/i);
          out.push(`<div class="pv-meta">${m ? esc(m[1] + ': ' + m[2]) : esc(trimmed)}</div>`);
          continue;
        }
        if (trimmed === '') { out.push('<div class="pv-blank"></div>'); continue; }
        out.push(`<div class="pv-line">${renderChordLine(ln)}</div>`);
      }
      if (inChorus) out.push('</div>');
      return out.join('\n');
    },
  };
}

// ─────────── ChordPro parsing helpers (visual editor) ───────────

// Parse full ChordPro content into a list of line-objects.
// Types: 'directive' (incl. {comment}), 'soc', 'eoc', 'blank', 'lyric'.
function parseCho(content) {
  const lines = content.split('\n');
  return lines.map(raw => {
    const t = raw.trim();
    if (t === '') return { type: 'blank', raw };
    if (/^\{soc\}$/i.test(t) || /^\{start_of_chorus\}$/i.test(t)) return { type: 'soc', raw };
    if (/^\{eoc\}$/i.test(t) || /^\{end_of_chorus\}$/i.test(t)) return { type: 'eoc', raw };
    if (/^\{arr\s*:/i.test(t)) {
      const text = t.replace(/^\{arr\s*:\s*/i, '').replace(/\}\s*$/, '');
      return { type: 'arr', raw, text };
    }
    // Comentarios editables: {comment: ...} y su forma corta {c: ...}
    const cm = t.match(/^\{(comment|c)\s*:\s*(.*?)\s*\}$/i);
    if (cm) return { type: 'comment', raw, tag: cm[1].toLowerCase(), text: cm[2] };
    if (/^\{[a-z_]+\s*:/i.test(t) || /^\{[a-z_]+\}$/i.test(t)) {
      return { type: 'directive', raw };
    }
    // Parse as lyric line with optional [chord] tags
    const { lyric, chords } = parseChordLineToModel(raw);
    return { type: 'lyric', lyric, chords, raw };
  });
}

function parseChordLineToModel(line) {
  let lyric = '';
  const chords = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '[') {
      const j = line.indexOf(']', i);
      if (j > 0) {
        chords.push({ text: line.slice(i + 1, j), pos: lyric.length });
        i = j + 1;
        continue;
      }
    }
    lyric += line[i];
    i++;
  }
  return { lyric, chords };
}

function serializeChordLine(model) {
  // Insert chords back into the lyric at their positions; multiple chords at the same pos stack.
  const lyric = model.lyric;
  const byPos = new Map();
  for (const ch of model.chords) {
    const p = Math.max(0, Math.min(ch.pos, lyric.length));
    if (!byPos.has(p)) byPos.set(p, []);
    byPos.get(p).push(ch.text);
  }
  const positions = [...byPos.keys()].sort((a, b) => a - b);
  let out = '';
  let last = 0;
  for (const p of positions) {
    out += lyric.slice(last, p);
    for (const t of byPos.get(p)) out += '[' + t + ']';
    last = p;
  }
  out += lyric.slice(last);
  return out;
}

function serializeCho(parsed) {
  return parsed.map(ln => {
    if (ln.type === 'lyric') return serializeChordLine({ lyric: ln.lyric, chords: ln.chords });
    return ln.raw;
  }).join('\n');
}

// ¿Esto parece un acorde? Deliberadamente PERMISIVO: preferimos no marcar un
// acorde raro pero válido antes que pintar de rojo media canción. Se exige nota
// raíz A-G (con # o b opcional) y, si hay bajo tras la barra, que también lo sea.
// Notas españolas que se colarían por la puerta de atrás: 'Do' es D + 'o' y 'Fa'
// es F + 'a', así que pasarían el filtro de abajo. Justo son las que quedan sin
// traducir en un import, o sea las que más interesa cazar. Se rechazan sólo con
// sufijo de menor/número para no pisar acordes legítimos como Faug o Fadd9.
const ES_NOTE_LEAK_RE = /^(Do|Fa)[#b]?m?[0-9]*$/;

function isKnownChord(tok) {
  const t = String(tok || '').trim();
  if (!t) return false;
  if (ES_NOTE_LEAK_RE.test(t)) return false;
  const parts = t.split('/');
  if (parts.length > 2) return false;
  if (!/^[A-G][#b]?[A-Za-z0-9°ºø+\-#b().,]*$/.test(parts[0])) return false;
  if (parts.length === 2 && !/^[A-G][#b]?[A-Za-z0-9#b]*$/.test(parts[1])) return false;
  return true;
}

// Reubica los acordes al cambiar el texto de una línea: cada acorde se queda
// pegado a la MISMA palabra (por índice) del texto nuevo. Si el texto nuevo tiene
// menos palabras, los que sobran caen en la última.
function remapChordsToNewLyric(chords, oldLyric, newLyric) {
  const oldStarts = wordStarts(oldLyric);
  const newStarts = wordStarts(newLyric);
  return (chords || []).map(ch => {
    let wordIdx = 0;
    for (let k = 0; k < oldStarts.length; k++) {
      if (oldStarts[k] <= ch.pos) wordIdx = k; else break;
    }
    const mapped = newStarts[Math.min(wordIdx, newStarts.length - 1)];
    const pos = mapped != null ? mapped : Math.min(ch.pos, newLyric.length);
    return { text: ch.text, pos };
  });
}

function snapToWordStart(idx, lyric) {
  // Find the word-start (non-space preceded by space or BOL) closest in CHARS to idx.
  if (!lyric) return idx;
  const starts = [0];
  for (let i = 1; i < lyric.length; i++) {
    if (!isSpace(lyric[i]) && isSpace(lyric[i - 1])) starts.push(i);
  }
  starts.push(lyric.length);
  let best = starts[0], bestDist = Infinity;
  for (const s of starts) {
    const d = Math.abs(s - idx);
    if (d < bestDist) { bestDist = d; best = s; }
  }
  return best;
}
function isSpace(ch) { return ch === ' ' || ch === '\t'; }

function wordStarts(lyric) {
  if (!lyric) return [0];
  const starts = [];
  if (!isSpace(lyric[0] || ' ')) starts.push(0);
  for (let i = 1; i < lyric.length; i++) {
    if (!isSpace(lyric[i]) && isSpace(lyric[i - 1])) starts.push(i);
  }
  if (starts.length === 0) starts.push(0);
  return starts;
}

// Mapea acordes desde {lyric: src, chords: [...]} a un newLyric, alineando por índice de palabra.
function mapChordsByWord(srcLine, newLyric) {
  const srcStarts = wordStarts(srcLine.lyric);
  const newStarts = wordStarts(newLyric);
  // Para cada acorde, encontrar a qué palabra pertenecía (la última cuyo start <= pos)
  const out = [];
  for (const ch of srcLine.chords) {
    let wordIdx = 0;
    for (let i = 0; i < srcStarts.length; i++) {
      if (srcStarts[i] <= ch.pos) wordIdx = i;
      else break;
    }
    let newPos;
    if (wordIdx < newStarts.length) {
      newPos = newStarts[wordIdx];
      // Si el acorde estaba más a la derecha que el inicio de palabra (caso raro), lo respetamos proporcionalmente
      const srcWordStart = srcStarts[wordIdx];
      const srcWordEnd = (srcStarts[wordIdx + 1] != null) ? srcStarts[wordIdx + 1] : srcLine.lyric.length;
      const newWordEnd = (newStarts[wordIdx + 1] != null) ? newStarts[wordIdx + 1] : newLyric.length;
      const srcWordLen = Math.max(1, srcWordEnd - srcWordStart);
      const newWordLen = Math.max(1, newWordEnd - newPos);
      const offsetInWord = ch.pos - srcWordStart;
      const ratio = offsetInWord / srcWordLen;
      newPos = newPos + Math.round(ratio * newWordLen);
      newPos = Math.min(newPos, newLyric.length);
    } else {
      newPos = newLyric.length;
    }
    out.push({ text: ch.text, pos: newPos });
  }
  return out;
}

// ─────────── Silabeado español sencillo ───────────
const SP_STRONG = new Set(['a','e','o','á','é','ó']);
const SP_WEAK_UNACC = new Set(['i','u','ü']);
const SP_WEAK_ACC = new Set(['í','ú']);
const SP_VOW = new Set([...SP_STRONG, ...SP_WEAK_UNACC, ...SP_WEAK_ACC]);
const SP_INSEP = new Set(['pr','br','tr','dr','cr','gr','fr','pl','bl','cl','gl','fl','ch','ll','rr']);

function isVow(c) { return SP_VOW.has((c || '').toLowerCase()); }

function syllableStartsInWord(word) {
  // Devuelve los índices (relativos al inicio de la palabra) donde empieza cada sílaba.
  if (!word) return [0];
  const w = word.toLowerCase();
  const starts = [0];
  let i = 0;
  while (i < w.length) {
    // saltar consonantes iniciales (ya están en la sílaba actual)
    while (i < w.length && !isVow(w[i])) i++;
    // saltar el núcleo vocálico (diptongo si corresponde — simplificado)
    while (i < w.length && isVow(w[i])) i++;
    // cluster consonántico hasta la siguiente vocal
    const cStart = i;
    while (i < w.length && !isVow(w[i])) i++;
    if (i >= w.length) break;  // fin de palabra
    const cluster = w.slice(cStart, i);
    let nextSyl;
    if (cluster.length === 0) nextSyl = i;
    else if (cluster.length === 1) nextSyl = cStart;  // V-CV
    else if (cluster.length === 2) {
      nextSyl = SP_INSEP.has(cluster) ? cStart : cStart + 1;
    } else {
      const last2 = cluster.slice(-2);
      nextSyl = SP_INSEP.has(last2) ? i - 2 : i - 1;
    }
    if (nextSyl > starts[starts.length - 1]) starts.push(nextSyl);
  }
  return starts;
}

function syllableStartsInLine(lyric) {
  if (!lyric) return [0];
  const starts = [];
  let wstart = -1;
  for (let i = 0; i <= lyric.length; i++) {
    const ch = lyric[i];
    if (i === lyric.length || isSpace(ch)) {
      if (wstart >= 0) {
        const word = lyric.slice(wstart, i);
        for (const s of syllableStartsInWord(word)) starts.push(wstart + s);
        wstart = -1;
      }
    } else if (wstart === -1) {
      wstart = i;
    }
  }
  starts.push(lyric.length);
  return starts;
}

function snapToSyllable(idx, lyric) {
  const starts = syllableStartsInLine(lyric);
  if (starts.length === 0) return idx;
  let best = starts[0], bestDist = Infinity;
  for (const s of starts) {
    const d = Math.abs(s - idx);
    if (d < bestDist) { bestDist = d; best = s; }
  }
  return best;
}

// Render a ChordPro line: produces stacked chord/lyric HTML.
function renderChordLine(line) {
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
  // Tokenize: each [chord] or character
  const tokens = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '[') {
      const j = line.indexOf(']', i);
      if (j > 0) {
        tokens.push({ chord: line.slice(i + 1, j) });
        i = j + 1;
        continue;
      }
    }
    tokens.push({ char: line[i] });
    i++;
  }
  // Group: each pos has [chords...] + chars until next chord
  const html = [];
  let pendingChords = [];
  let textBuf = '';
  for (const t of tokens) {
    if (t.chord != null) {
      if (textBuf || pendingChords.length) {
        html.push(`<span class="pv-seg"><span class="pv-chords">${pendingChords.map(esc).join(' ')}</span><span class="pv-lyr">${esc(textBuf) || '&nbsp;'}</span></span>`);
        pendingChords = [];
        textBuf = '';
      }
      pendingChords.push(t.chord);  // sin corchetes en el preview
    } else {
      textBuf += t.char;
    }
  }
  if (textBuf || pendingChords.length) {
    html.push(`<span class="pv-seg"><span class="pv-chords">${pendingChords.map(esc).join(' ')}</span><span class="pv-lyr">${esc(textBuf) || '&nbsp;'}</span></span>`);
  }
  return html.join('');
}

// ─────────── Transposición de acordes ───────────
const NOTES_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const NOTES_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const NOTE_INDEX = {
  'C':0,'C#':1,'Db':1,'D':2,'D#':3,'Eb':3,'E':4,'Fb':4,'E#':5,
  'F':5,'F#':6,'Gb':6,'G':7,'G#':8,'Ab':8,'A':9,'A#':10,'Bb':10,
  'B':11,'Cb':11,'B#':0,
};

function transposeNoteName(note, semis, useFlats) {
  const idx = NOTE_INDEX[note];
  if (idx == null) return note;
  const arr = useFlats ? NOTES_FLAT : NOTES_SHARP;
  return arr[((idx + semis) % 12 + 12) % 12];
}

// Transpone el texto de un acorde (ej. "Dm7/F#" → "Cm7/E"). Conserva todo lo no-nota.
function transposeChordText(text, semis, useFlats) {
  if (!text) return text;
  // Acordes con barras (NC, x, etc) o textos no estándar — los dejamos intactos.
  const reChord = /^([A-G])([#b]?)([^\/\s]*)(\/([A-G])([#b]?)(.*))?$/;
  const m = text.match(reChord);
  if (!m) return text;
  const newRoot = transposeNoteName(m[1] + (m[2] || ''), semis, useFlats);
  let out = newRoot + (m[3] || '');
  if (m[4]) {
    const newBass = transposeNoteName(m[5] + (m[6] || ''), semis, useFlats);
    out += '/' + newBass + (m[7] || '');
  }
  return out;
}

// Normaliza un tono a su índice cromático + modo, para comparar "Db" == "C#" y
// detectar igualdad real (ignorando mayúsculas/espacios). Devuelve "" si no se reconoce.
function normalizeKey(key) {
  if (!key) return '';
  const m = String(key).trim().match(/^([A-G])([#b]?)(m?)/i);
  if (!m) return '';
  const note = m[1].toUpperCase() + (m[2] || '');
  const idx = NOTE_INDEX[note];
  if (idx == null) return '';
  return idx + (m[3].toLowerCase() === 'm' ? 'm' : '');
}

// Transpone un .cho completo (texto) desde fromKey hasta toKey, reescribiendo
// los acordes [..] y el directive {key:}. Devuelve null si no puede.
function transposeChoToKey(cho, fromKey, toKey) {
  const fm = String(fromKey || '').match(/^([A-G])([#b]?)/i);
  const tm = String(toKey || '').match(/^([A-G])([#b]?)/i);
  if (!fm || !tm) return null;
  const fIdx = NOTE_INDEX[fm[1].toUpperCase() + (fm[2] || '')];
  const tIdx = NOTE_INDEX[tm[1].toUpperCase() + (tm[2] || '')];
  if (fIdx == null || tIdx == null) return null;
  let semis = tIdx - fIdx;
  if (semis > 6) semis -= 12;
  if (semis < -6) semis += 12;
  const target = computeTransposedKey(fromKey, semis);
  const useFlats = target ? target.useFlats : (semis < 0);
  const lines = cho.split('\n');
  const out = lines.map((raw) => {
    const t = raw.trim();
    // Reescribir el directive {key: ...}
    const km = t.match(/^\{\s*key\s*:\s*(.*?)\s*\}$/i);
    if (km) return `{key: ${toKey}}`;
    // No tocar otros directives ({title}, {comment}, etc.)
    if (/^\{[a-z_]+\s*[:}]/i.test(t)) return raw;
    // Línea de letra: transponer cada [acorde]
    const model = parseChordLineToModel(raw);
    if (!model.chords.length) return raw;
    model.chords = model.chords.map(c => ({ ...c, text: transposeChordText(c.text, semis, useFlats) }));
    return serializeChordLine(model);
  });
  return out.join('\n');
}

// Calcula el nuevo tono después de transponer, eligiendo bemoles o sostenidos
// según la convención habitual del nuevo tono.
function computeTransposedKey(key, semis) {
  if (!key) return null;
  const m = key.match(/^([A-G])([#b]?)(m?)(.*)$/);
  if (!m) return null;
  const isMinor = m[3] === 'm';
  const suffix = m[4] || '';
  // Probamos ambos spellings y elegimos
  const sharpName = transposeNoteName(m[1] + (m[2] || ''), semis, false);
  const flatName = transposeNoteName(m[1] + (m[2] || ''), semis, true);
  const FLAT_MAJOR = new Set(['F','Bb','Eb','Ab','Db','Gb','Cb']);
  const FLAT_MINOR = new Set(['D','G','C','F','Bb','Eb','Ab']);
  const flatSet = isMinor ? FLAT_MINOR : FLAT_MAJOR;
  // Si el original venía con bemol y el resultado natural empata, preferimos bemoles
  const originalHasFlat = (m[2] === 'b');
  let useFlats;
  if (sharpName === flatName) {
    useFlats = originalHasFlat;
  } else {
    useFlats = flatSet.has(flatName);
  }
  const tonic = useFlats ? flatName : sharpName;
  return { key: tonic + (isMinor ? 'm' : '') + suffix, useFlats };
}
