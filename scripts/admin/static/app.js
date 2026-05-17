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
    todoFilter: false,
    onlyInRepoFilter: false,

    // Import view
    importSearch: '',
    importSectionFilter: '',
    selectedImports: new Set(),
    importing: false,
    importResults: [],
    docxPreview: null,

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
      meta: { title: '', artist: '', key: '', capo: 0, has_todo: false },
    },

    // ─────────── Lifecycle ───────────
    async boot() {
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
      if (this.todoFilter) list = list.filter(r => r.has_todo);
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
          tab: 'raw',
          meta: { ...json.meta },
        };
      } catch (e) {
        alert('Error abriendo: ' + e.message);
      }
    },
    closeEditor() {
      if (this.editor.dirty && !confirm('Hay cambios sin guardar. ¿Descartar?')) return;
      this.editor = {
        path: null, filename: null, content: '', originalContent: '',
        dirty: false, tab: 'raw',
        meta: { title: '', artist: '', key: '', capo: 0, has_todo: false },
      };
    },
    setEditorTab(t) { this.editor.tab = t; },
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
      try {
        const r = await fetch('/api/song?path=' + encodeURIComponent(this.editor.path), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: this.editor.content }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this.editor.originalContent = this.editor.content;
        this.editor.dirty = false;
        await this.loadCatalog();
      } catch (e) {
        alert('Error guardando: ' + e.message);
      }
    },
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
    markReviewed() {
      // Remove the TO DO comment line
      const lines = this.editor.content.split('\n');
      const filtered = lines.filter(ln => !/\{\s*comment\s*:[^}]*\bTO\s+DO\b[^}]*\}/i.test(ln));
      if (filtered.length !== lines.length) {
        this.editor.content = filtered.join('\n');
        this.editor.dirty = true;
        this.editor.meta.has_todo = false;
      }
    },

    // ─────────── Build JSON ───────────
    async buildJson() {
      this.building = true;
      this.buildResult = '';
      try {
        const r = await fetch('/api/build-json', { method: 'POST' });
        const json = await r.json();
        this.buildResult = (json.ok ? '✓ OK\n\n' : '✗ Error (rc=' + json.returncode + ')\n\n') +
          (json.stdout || '') + (json.stderr ? '\nSTDERR:\n' + json.stderr : '');
      } catch (e) {
        this.buildResult = 'Error: ' + e.message;
      } finally {
        this.building = false;
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
      // flush previous segment first
      if (textBuf || pendingChords.length) {
        html.push(`<span class="pv-seg"><span class="pv-chords">${pendingChords.map(esc).join(' ')}</span><span class="pv-lyr">${esc(textBuf) || '&nbsp;'}</span></span>`);
        pendingChords = [];
        textBuf = '';
      }
      pendingChords.push('[' + t.chord + ']');
    } else {
      textBuf += t.char;
    }
  }
  if (textBuf || pendingChords.length) {
    html.push(`<span class="pv-seg"><span class="pv-chords">${pendingChords.map(esc).join(' ')}</span><span class="pv-lyr">${esc(textBuf) || '&nbsp;'}</span></span>`);
  }
  return html.join('');
}
