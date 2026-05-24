// Cantoral Admin - Alpine.js single-page app
// Phase 3a/3b: catalog + raw editor + import. Visual drag&drop comes in 3c.

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
    onlyInRepoFilter: false,
    selectedCatalogPaths: new Set(),

    // Import view
    importSearch: '',
    importSectionFilter: '',
    selectedImports: new Set(),
    importing: false,
    importResults: [],
    docxPreview: null,
    importIgnored: [],
    showIgnored: false,

    // Reorder
    reorderCategory: '',
    reorderSongs: [],
    reorderModified: false,
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
    visualSelectedChord: null,
    visualSelectedLines: new Set(),
    visualLastClickedLine: null,
    visualChordClipboard: null,   // [{lyric, chords}]  patrón copiado
    clipboardInfo: '',            // texto persistente cuando hay acordes copiados
    showHelp: false,
    newSong: { open: false, category: '', title: '', artist: '', key: '', capo: 0,
               mode: 'blank', content: '', creating: false },
    saveIndicator: { text: 'Sin cambios', cls: 'saved' },
    lastSaveAt: null,

    // Backups
    backups: { sessions: [], total_size_bytes: 0, loading: false, keepLast: 5 },

    // ─────────── Lifecycle ───────────
    async boot() {
      this.$watch('editor.dirty', (v) => {
        if (v) this.setSaveIndicator('dirty', '● Sin guardar — pulsa 💾');
      });
      // Atajo global: Ctrl/Cmd+S
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's' && this.editor.path) {
          e.preventDefault();
          this.saveSong();
        }
      });
      await this.loadCatalog();
    },

    async loadCatalog() {
      this.loading = true;
      this.error = null;
      try {
        const r = await fetch('/api/catalog');
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this.data = await r.json();
      } catch (e) {
        this.error = 'No pude cargar el catálogo: ' + e.message;
      } finally {
        this.loading = false;
      }
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
      if (this.search) {
        const q = this.normalizeSearch(this.search);
        list = list.filter(r =>
          this.normalizeSearch(r.title).includes(q) ||
          this.normalizeSearch(r.artist).includes(q)
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
    async doImport() {
      if (this.selectedImports.size === 0) return;
      this.importing = true;
      this.importResults = [];
      try {
        const r = await fetch('/api/docx/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: [...this.selectedImports] }),
        });
        const json = await r.json();
        this.importResults = json.results || [];
        this.selectedImports = new Set();
        await this.loadCatalog();
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

    // ─────────── Reorder ───────────
    async loadReorder() {
      if (!this.reorderCategory) {
        this.reorderSongs = [];
        this.reorderModified = false;
        return;
      }
      this.reorderSongs = this.data.repo_songs
        .filter(r => r.category_letter === this.reorderCategory)
        .sort((a, b) => (a.number || 999) - (b.number || 999));
      this.reorderModified = false;
    },
    onReorderDrop(targetIdx) {
      if (this.reorderDragIdx == null || this.reorderDragIdx === targetIdx) return;
      const arr = this.reorderSongs;
      const [moved] = arr.splice(this.reorderDragIdx, 1);
      arr.splice(targetIdx, 0, moved);
      this.reorderSongs = [...arr];
      this.reorderModified = true;
      this.reorderDragIdx = null;
    },
    async applyReorder() {
      if (!this.reorderCategory || !this.reorderModified) return;
      try {
        const r = await fetch('/api/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: this.reorderCategory,
            order: this.reorderSongs.map(s => s.filename),
          }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
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
      this.setSaveIndicator('saved', 'Sin cambios');
    },
    setEditorTab(t) {
      if (this.editor.tab === 'visual' && t !== 'visual') {
        this.editor.content = serializeCho(this.editor.parsed);
        this.refreshMetaFromRaw();
      }
      this.editor.tab = t;
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
    commitParsed() {
      this.editor.dirty = true;
      this.editor.content = serializeCho(this.editor.parsed);
      this.refreshMetaFromRaw();
    },

    lineCssClass(ln, idx) {
      const cls = ['ed-line', 'ed-' + ln.type];
      if (this.visualSelectedLines.has(idx)) cls.push('selected');
      if (ln._inChorus) cls.push('in-chorus');
      return cls.join(' ');
    },

    // ─────────── Selección de líneas (gutter) ───────────
    toggleLineSelection(idx, ev) {
      if (ev && ev.shiftKey && this.visualLastClickedLine != null) {
        const lo = Math.min(this.visualLastClickedLine, idx);
        const hi = Math.max(this.visualLastClickedLine, idx);
        for (let i = lo; i <= hi; i++) this.visualSelectedLines.add(i);
      } else {
        if (this.visualSelectedLines.has(idx)) this.visualSelectedLines.delete(idx);
        else this.visualSelectedLines.add(idx);
        this.visualLastClickedLine = idx;
      }
      this.visualSelectedLines = new Set(this.visualSelectedLines);  // trigger Alpine
    },
    clearLineSelection() {
      this.visualSelectedLines = new Set();
      this.visualLastClickedLine = null;
    },
    selectedLineRange() {
      const arr = [...this.visualSelectedLines].sort((a, b) => a - b);
      if (arr.length === 0) return null;
      // Tomamos el rango entre min y max (contiguo)
      return { start: arr[0], end: arr[arr.length - 1] };
    },

    // ─────────── Estribillo: marcar / desmarcar / insertar ───────────
    markSelectionAsChorus() {
      const r = this.selectedLineRange();
      if (!r) return;
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
      let insertAt = r ? r.end + 1 : this.editor.parsed.length;
      // Añadir línea blanca de separación antes y después
      const toInsert = [{ type: 'blank', raw: '' }, ...clone, { type: 'blank', raw: '' }];
      this.editor.parsed.splice(insertAt, 0, ...toInsert);
      this.commitParsed();
      this.markChorusFlags();
      this.$nextTick(() => this.layoutChords());
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
    editLyricLine(idx) {
      const ln = this.editor.parsed[idx];
      if (!ln || ln.type !== 'lyric') return;
      const next = prompt('Edita el texto de esta línea (los acordes intentan mantenerse pegados a su palabra):', ln.lyric);
      if (next == null || next === ln.lyric) return;
      // Mapear posiciones de acordes al nuevo texto por word-index
      const oldStarts = wordStarts(ln.lyric);
      const newStarts = wordStarts(next);
      ln.chords = ln.chords.map(ch => {
        // Encontrar a qué palabra pertenecía
        let wordIdx = 0;
        for (let k = 0; k < oldStarts.length; k++) {
          if (oldStarts[k] <= ch.pos) wordIdx = k; else break;
        }
        const newPos = newStarts[Math.min(wordIdx, newStarts.length - 1)] || Math.min(ch.pos, next.length);
        return { text: ch.text, pos: newPos };
      });
      ln.lyric = next;
      this.commitParsed();
      this.$nextTick(() => this.layoutChords());
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
        this.editor.content = next;
        this.editor.dirty = true;
      }
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
    formatBytes(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },

    // ─────────── Nueva canción ───────────
    openNewSongModal() {
      this.newSong = { open: true, category: '', title: '', artist: '', key: '', capo: 0,
                       mode: 'blank', content: '', creating: false };
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
    if (/^\{[a-z_]+\s*:/i.test(t) || /^\{[a-z_]+\}$/i.test(t)) {
      const isComment = /^\{comment/i.test(t);
      return { type: isComment ? 'comment' : 'directive', raw };
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
