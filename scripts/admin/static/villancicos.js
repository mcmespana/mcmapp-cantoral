// 🎄 Villancicos Solidarios — sección del admin.
//
// Se mezcla con el app() de Alpine (ver el final de app.js): todo lo de aquí
// vive en `this` igual que el resto del admin. API en scripts/admin/villancicos_api.py
// y contrato de datos en docs/CAMPOS_CANCIONES.md §5 y docs/VILLANCICOS_SOLIDARIOS.md.
//
// Tres pestañas:
//   🎶 Canciones  — lo de Navidad (propias y traídas de otras categorías) por
//                   subcategoría; traer del cantoral normal y llevar al normal.
//   📄 Importar   — el Word de canciones nuevas, una a una, con el original al lado.
//   🎼 Packs      — bloques de ~1 hora: ordenar, tono del día, duración, exportar.

const VILL_DEFAULT_SECS = 150;

// «3:30», «3'30», «210» → segundos (espejo de chordpro.parse_duration).
function villParseDuration(v) {
  const s = String(v || '').trim();
  let m = s.match(/^(\d{1,3})\s*(?::|'|’|m(?:in)?\.?)\s*(\d{1,2})?\s*(?:"|”|s(?:eg)?\.?)?$/i);
  if (m) {
    const sec = parseInt(m[2] || '0', 10);
    return sec < 60 ? parseInt(m[1], 10) * 60 + sec : 0;
  }
  m = s.match(/^(\d{1,4})\s*(?:"|”|s(?:eg)?\.?)?$/i);
  return m ? parseInt(m[1], 10) : 0;
}
function villClock(secs) {
  secs = Math.max(0, Math.round(secs || 0));
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}
// «19.hoy_ha_nacido.cho» → «hoy_ha_nacido» (espejo de packs.song_slug).
function villSongSlug(filename) {
  let s = String(filename || '').replace(/\.cho$/i, '').replace(/^\d+\s*\.\s*/, '');
  s = s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
  return s.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}
function villNorm(s) {
  return String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function villancicosMixin() {
  return {
    vill: {
      tab: 'songs',
      loading: false,
      data: null,              // /api/villancicos/overview
      subFilter: null,         // null = todas · '' = sin clasificar · slug
      search: '',
      selected: [],
      bulkSub: '',
      bring: { open: false, search: '', sub: 'otras' },
      sendTo: {},              // path → categoría elegida en «llevar también a…»
      // Word
      word: null,
      wordFilter: 'pending',
      wordSel: null,
      wordPreview: null,
      wordContent: '',
      wordNumber: null,
      wordSub: (() => { try { return localStorage.getItem('vill.wordSub') || ''; } catch (e) { return ''; } })(),
      wordView: 'app',
      wordBusy: false,
      wordUrl: (() => { try { return localStorage.getItem('vill.docUrl') || ''; } catch (e) { return ''; } })(),
      // Cantoral de 2008 (PDF escaneado): se lee página a página con ✨
      importSrc: 'word',       // word | pdf
      pdf: null,               // /api/villancicos/pdf/index
      pdfPage: null,
      pdfFilter: 'pending',
      // Packs
      packs: [],
      packSlug: null,          // slug guardado del pack abierto (null = nuevo)
      pack: null,              // copia en edición
      packDirty: false,
      packSaving: false,
      packAdd: '',             // buscador para añadir
      packLinkIdx: null,       // ítem al que se busca canción
      dragIdx: null,
      overIdx: null,
      defaultSecs: VILL_DEFAULT_SECS,
    },

    // ─────────── Navegación ─────────── #
    async goVillancicos(tab) {
      this.view = 'villancicos';
      if (tab) this.vill.tab = tab;
      await this.villLoad();
      if (this.vill.tab === 'word' && !this.vill.word) this.villLoadWord();
      if (this.vill.tab === 'packs') this.villLoadPacks();
    },
    villTab(tab) {
      if (this.vill.tab === 'packs' && tab !== 'packs' && this.vill.packDirty &&
          !confirm('El pack tiene cambios sin guardar. ¿Salir igualmente?')) return;
      this.vill.tab = tab;
      if (tab === 'word' && this.vill.importSrc === 'word' && !this.vill.word) this.villLoadWord();
      if (tab === 'word' && this.vill.importSrc === 'pdf' && !this.vill.pdf) this.villLoadPdf();
      if (tab === 'packs' && !this.vill.packs.length) this.villLoadPacks();
    },
    async villLoad() {
      this.vill.loading = true;
      try {
        const r = await fetch('/api/villancicos/overview');
        if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'HTTP ' + r.status);
        this.vill.data = await r.json();
      } catch (e) {
        alert('No pude cargar Navidad: ' + e.message);
      } finally {
        this.vill.loading = false;
      }
    },
    villSubs() { return this.vill.data ? this.vill.data.subcategories : []; },
    villSub(slug) { return this.villSubs().find(s => s.slug === slug) || null; },
    villSubLabel(slug) {
      const s = this.villSub(slug);
      return s ? `${s.emoji || ''} ${s.title}`.trim() : (slug ? slug : 'Sin clasificar');
    },
    villCount(slug) { return (this.vill.data && this.vill.data.counts[slug || '']) || 0; },

    // ─────────── 🎶 Canciones ─────────── #
    villFiltered() {
      const d = this.vill.data;
      if (!d) return [];
      const q = villNorm(this.vill.search).trim();
      const known = new Set(this.villSubs().map(s => s.slug));
      return d.songs.filter(s => {
        const sub = known.has(s.subcategory) ? s.subcategory : '';
        if (this.vill.subFilter !== null && sub !== this.vill.subFilter) return false;
        if (q && !villNorm(`${s.title} ${s.artist} ${s.category_title}`).includes(q)) return false;
        return true;
      });
    },
    // Filas de la tabla: cabecera de cada subcategoría y sus canciones.
    villRows() {
      const songs = this.villFiltered();
      const known = new Set(this.villSubs().map(s => s.slug));
      const groups = [...this.villSubs().map(s => s.slug), ''];
      const rows = [];
      for (const g of groups) {
        const list = songs.filter(s => (known.has(s.subcategory) ? s.subcategory : '') === g)
          .sort((a, b) => (b.home - a.home) || ((a.number ?? 999) - (b.number ?? 999)) ||
                          a.title.localeCompare(b.title, 'es'));
        if (!list.length) continue;
        rows.push({ head: true, key: 'h:' + g, slug: g, label: this.villSubLabel(g), n: list.length });
        list.forEach(s => rows.push({ head: false, key: s.path, s }));
      }
      return rows;
    },
    villToggle(path) {
      const sel = new Set(this.vill.selected);
      sel.has(path) ? sel.delete(path) : sel.add(path);
      this.vill.selected = [...sel];
    },
    async villSetSub(paths, sub) {
      try {
        const r = await fetch('/api/villancicos/subcategory', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths, subcategory: sub }),
        });
        if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'HTTP ' + r.status);
        await this.villLoad();
        this.loadGitStatus && this.loadGitStatus(true);
      } catch (e) { alert('No se pudo: ' + e.message); }
    },
    async villApplyBulk() {
      if (!this.vill.selected.length) return;
      await this.villSetSub(this.vill.selected, this.vill.bulkSub);
      this.vill.selected = [];
    },
    async villAlsoIn(path, category, subcategory, remove) {
      try {
        const r = await fetch('/api/song/also-in', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path, category, subcategory: subcategory || '', remove: !!remove }),
        });
        if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'HTTP ' + r.status);
        await this.villLoad();
        if (this.vill.word) this.villLoadWord(true);
        if (this.vill.pdf) this.villLoadPdf();
        this.loadGitStatus && this.loadGitStatus(true);
        return true;
      } catch (e) { alert('No se pudo: ' + e.message); return false; }
    },
    // Canciones del cantoral normal que se pueden traer (las que no son ya de Navidad).
    villBringResults() {
      const q = villNorm(this.vill.bring.search).trim();
      if (!q || !this.data) return [];
      const inNav = new Set((this.vill.data?.songs || []).map(s => s.path));
      const navLetter = this.vill.data?.category.letter;
      return this.data.repo_songs
        .filter(s => s.category_letter !== navLetter && !inNav.has(s.path))
        .filter(s => villNorm(`${s.title} ${s.artist || ''}`).includes(q))
        .slice(0, 12);
    },
    // Categorías del cantoral normal donde se puede «llevar» una de Navidad.
    villOtherCategories() {
      const navLetter = this.vill.data?.category.letter;
      return (this.data?.categories || []).filter(c => c.letter !== navLetter && c.indice_key);
    },
    villCategoryTitle(key) {
      const c = (this.data?.categories || []).find(x => x.indice_key === key);
      return c ? c.title.replace(/^[A-Z+\d]+\.\s*/, '') : key;
    },

    // ─────────── 📄 Importar del Word ─────────── #
    async villLoadWord(keepSel) {
      try {
        const r = await fetch('/api/villancicos/word/list');
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this.vill.word = await r.json();
        if (!keepSel) this.vill.wordSel = null;
      } catch (e) { alert('No pude leer el Word: ' + e.message); }
    },
    villWordSongs() {
      const w = this.vill.word;
      if (!w) return [];
      const f = this.vill.wordFilter;
      return w.songs.filter(s => f === 'all' || s.status === f ||
                                 (f === 'elsewhere' && s.status === 'linked'));
    },
    villWordCount(status) {
      return (this.vill.word?.songs || []).filter(s => s.status === status ||
        (status === 'elsewhere' && s.status === 'linked')).length;
    },
    villWordStatusText(s) {
      return { pending: '⏳ Falta', imported: '✅ Importada', elsewhere: '↪ Ya en ' + (s.category_title || ''),
               linked: '🔗 Traída de ' + (s.category_title || '') }[s.status] || s.status;
    },
    async villWordOpen(s) {
      if (this.vill.wordPreview && this.vill.wordContent !== this.vill.wordPreview.cho &&
          !confirm('Has tocado el ChordPro de la canción abierta. ¿Cambiar de canción y perderlo?')) return;
      this.vill.wordSel = s.id;
      this.vill.wordPreview = null;
      try {
        const r = await fetch('/api/villancicos/word/preview?id=' + s.id);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const p = await r.json();
        this.vill.wordPreview = p;
        this.vill.wordContent = p.cho;
        this.vill.wordNumber = s.suggested_number ?? s.number ?? null;
      } catch (e) { alert('No pude convertirla: ' + e.message); }
    },
    villWordCurrent() {
      return (this.vill.word?.songs || []).find(s => s.id === this.vill.wordSel) || null;
    },
    villWordNext() {
      const list = this.vill.word?.songs.filter(s => s.status === 'pending') || [];
      const cur = this.villWordCurrent();
      const next = list.find(s => !cur || (s.number ?? 999) > (cur.number ?? -1) && s.id !== cur.id) || list[0];
      if (next) this.villWordOpen(next);
    },
    async villWordImport() {
      const cur = this.villWordCurrent();
      if (!cur || this.vill.wordBusy) return;
      if (this.vill.wordNumber === null || this.vill.wordNumber === '') { alert('Pon el número'); return; }
      this.vill.wordBusy = true;
      try {
        try { localStorage.setItem('vill.wordSub', this.vill.wordSub); } catch (e) { /* privado */ }
        const r = await fetch('/api/villancicos/word/import', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: cur.id, number: Number(this.vill.wordNumber),
                                 subcategory: this.vill.wordSub, content: this.vill.wordContent }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status);
        try {
          // Para la pestaña 📄 Original del editor: la canción tal y como está en el Word.
          localStorage.setItem('cantoral.original:' + j.path, JSON.stringify({
            text: j.layout, files: [], url: '', at: Date.now() }));
        } catch (e) { /* sin localStorage: no pasa nada */ }
        this.vill.wordPreview = null;
        await Promise.all([this.villLoadWord(true), this.villLoad(), this.loadCatalog(true)]);
        this.loadGitStatus && this.loadGitStatus(true);
        await this.openEditor(j.path);
      } catch (e) {
        alert('No se pudo crear: ' + e.message);
      } finally {
        this.vill.wordBusy = false;
      }
    },
    async villWordBringExisting() {
      const cur = this.villWordCurrent();
      if (!cur || !cur.path) return;
      if (await this.villAlsoIn(cur.path, 'navidad', this.vill.wordSub || 'otras')) {
        this.vill.wordPreview = null;
      }
    },
    async villWordRefresh() {
      const url = (this.vill.wordUrl || '').trim();
      if (!url) { alert('Pega el enlace del Google Doc (compartido como «cualquier persona con el enlace»).'); return; }
      try { localStorage.setItem('vill.docUrl', url); } catch (e) { /* privado */ }
      this.vill.wordBusy = true;
      try {
        const r = await fetch('/api/villancicos/word/refresh', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status);
        alert(j.unchanged ? 'El Google Doc no ha cambiado desde la última vez.'
                          : `Word actualizado: ${j.songs} canciones. Haz commit para guardarlo en el repo.`);
        await this.villLoadWord();
        this.loadGitStatus && this.loadGitStatus(true);
      } catch (e) {
        alert('No pude traerlo: ' + e.message);
      } finally {
        this.vill.wordBusy = false;
      }
    },

    // ─────────── 📕 Cantoral 2008 (PDF) ─────────── #
    async villLoadPdf() {
      try {
        const r = await fetch('/api/villancicos/pdf/index');
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this.vill.pdf = await r.json();
        if (this.vill.pdfPage === null) {
          const first = this.vill.pdf.pages.find(pg => pg.songs.some(s => s.status === 'pending'));
          this.vill.pdfPage = first ? first.page : 2;
        }
      } catch (e) { alert('No pude leer el índice del cantoral de 2008: ' + e.message); }
    },
    villSetImportSrc(src) {
      this.vill.importSrc = src;
      if (src === 'pdf' && !this.vill.pdf) this.villLoadPdf();
      if (src === 'word' && !this.vill.word) this.villLoadWord();
    },
    villPdfPages() {
      const f = this.vill.pdfFilter;
      return (this.vill.pdf?.pages || []).filter(pg => pg.songs.length &&
        (f === 'all' || pg.songs.some(s => s.status === f || (f === 'elsewhere' && s.status === 'linked'))));
    },
    villPdfCurrent() { return (this.vill.pdf?.pages || []).find(pg => pg.page === this.vill.pdfPage) || null; },
    villPdfCount(status) {
      return (this.vill.pdf?.pages || []).flatMap(pg => pg.songs)
        .filter(s => !s.repeat && (s.status === status || (status === 'elsewhere' && s.status === 'linked'))).length;
    },
    // Manda la página a ✨ Añadir canción, que la lee con Claude (como una foto).
    async villRead2008(pg, song) {
      if (!this.aiStatus?.enabled) { alert(this.aiMissingText ? this.aiMissingText() : 'La IA no está activada (⚙️ Ajustes).'); return; }
      let blob;
      try {
        const r = await fetch('/api/villancicos/pdf/page/' + pg.page);
        if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'HTTP ' + r.status);
        blob = await r.blob();
      } catch (e) { alert('No pude sacar la página: ' + e.message); return; }
      this.openAddSong();
      this.addSong.category = this.vill.data?.category.letter || 'N';
      await this.readAddSongFiles([new File([blob], `cantoral-2008-p${pg.page}.pdf`, { type: 'application/pdf' })]);
      // Una página trae varias: se elige la que se pidió.
      const want = villNorm(song.title).replace(/\([^)]*\)|[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
      const songs = this.addSong.read?.songs || [];
      const idx = songs.findIndex(s => {
        const t = villNorm(s.title).replace(/\([^)]*\)|[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
        return t && (t.includes(want) || want.includes(t));
      });
      if (idx > 0) this.pickReadSong(idx);
      if (song.n !== undefined && song.n !== null && song.n > 0) this.addSong.number = song.n;
    },
    // Tras crear con ✨ una canción leída de una página del cantoral de 2008:
    // su {fuente:} con la página (así se sabe que ya está) y la subcategoría.
    async villAfterAddSong(path, a) {
      const m = /^cantoral-2008-p(\d+)\.pdf$/.exec(a?.photos?.[0]?.name || '');
      if (!m) return;
      const page = Number(m[1]);
      if (!this.vill.pdf) await this.villLoadPdf();
      const pg = (this.vill.pdf?.pages || []).find(x => x.page === page);
      const t = villNorm(a.title || '');
      const hit = pg?.songs.find(s => villNorm(s.title).includes(t) || t.includes(villNorm(s.title))) || null;
      try {
        await fetch('/api/villancicos/mark', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path, source: `Cantoral Villancicos Solidarios 2008 (p. ${page})`,
                                 subcategory: hit?.sub || '' }),
        });
      } catch (e) { /* no es grave: se pone a mano */ }
      this.vill.pdf = null;
      this.villLoadPdf();
      this.villLoad();
    },

    // ─────────── 🎼 Packs ─────────── #
    async villLoadPacks() {
      try {
        const r = await fetch('/api/packs');
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        this.vill.packs = j.packs;
        this.vill.defaultSecs = j.defaultSeconds || VILL_DEFAULT_SECS;
      } catch (e) { alert('No pude leer los packs: ' + e.message); }
    },
    villOpenPack(p) {
      if (this.vill.packDirty && !confirm('El pack abierto tiene cambios sin guardar. ¿Abrir otro?')) return;
      this.vill.packSlug = p ? p.slug : null;
      this.vill.pack = p ? JSON.parse(JSON.stringify(p)) : {
        title: '', event: '', date: '', targetMinutes: 60, defaultDuration: '', notes: '', items: [] };
      this.vill.packDirty = !p;
      this.vill.packLinkIdx = null;
    },
    villNewPack() {
      this.villOpenPack(null);
      this.vill.pack.title = 'Pack nuevo';
      this.vill.pack.event = this.vill.packs[0]?.event || '';
      this.$nextTick(() => { const el = document.querySelector('.vill-pack-title'); el && el.select(); });
    },
    villDuplicatePack() {
      const p = this.vill.pack;
      if (!p) return;
      this.villOpenPack(null);
      this.vill.pack = { ...JSON.parse(JSON.stringify(p)), title: p.title + ' (copia)' };
      this.vill.packDirty = true;
    },
    villTouch() { this.vill.packDirty = true; },
    villItemSecs(it) {
      if (it.type === 'break') return (parseInt(it.minutes, 10) || 0) * 60;
      return villParseDuration(it.duration) || villParseDuration(it.songDuration) ||
             villParseDuration(this.vill.pack?.defaultDuration) || this.vill.defaultSecs;
    },
    villItemEstimated(it) {
      return it.type !== 'break' && !villParseDuration(it.duration) && !villParseDuration(it.songDuration);
    },
    villPackTimeline() {
      let t = 0;
      return (this.vill.pack?.items || []).map(it => { const start = t; t += this.villItemSecs(it); return start; });
    },
    villPackTotal(p) {
      p = p || this.vill.pack;
      if (!p) return 0;
      if (p !== this.vill.pack && typeof p.totalSeconds === 'number') return p.totalSeconds;
      return (p.items || []).reduce((acc, it) => acc + this.villItemSecs(it), 0);
    },
    villPackEstimated() { return (this.vill.pack?.items || []).some(it => this.villItemEstimated(it)); },
    villPackPct(p) {
      p = p || this.vill.pack;
      const target = (p?.targetMinutes || 60) * 60;
      return Math.min(100, Math.round(100 * this.villPackTotal(p) / target));
    },
    villPackOver(p) {
      p = p || this.vill.pack;
      return this.villPackTotal(p) > (p?.targetMinutes || 60) * 60;
    },
    villSongNumber(items, idx) {
      let n = 0;
      for (let i = 0; i <= idx; i++) if (items[i].type !== 'break') n++;
      return n;
    },
    // Canciones para añadir: primero las de Navidad (y prestadas), luego el resto.
    villPackCandidates() {
      const q = villNorm(this.vill.packAdd).trim();
      if (!q || !this.data) return [];
      const keyOf = Object.fromEntries((this.data.categories || []).map(c => [c.letter, c.indice_key || '']));
      const nav = new Set((this.vill.data?.songs || []).map(s => s.path));
      return this.data.repo_songs
        .filter(s => villNorm(`${s.title} ${s.artist || ''}`).includes(q))
        .map(s => ({ ...s, ref: `${keyOf[s.category_letter]}/${villSongSlug(s.filename)}`, nav: nav.has(s.path) }))
        .sort((a, b) => (b.nav - a.nav) || a.title.localeCompare(b.title, 'es'))
        .slice(0, 10);
    },
    villItemFromSong(s) {
      return { song: s.ref, title: s.title, path: s.path, status: 'ok', songTitle: s.title,
               songKey: s.key || '', songCapo: s.capo || 0, songDuration: s.duration || '' };
    },
    villPickSong(s) {
      const items = this.vill.pack.items;
      if (this.vill.packLinkIdx !== null) {
        const it = items[this.vill.packLinkIdx];
        Object.assign(it, this.villItemFromSong(s), { title: it.title || s.title });
        this.vill.packLinkIdx = null;
      } else {
        items.push(this.villItemFromSong(s));
      }
      this.vill.packAdd = '';
      this.villTouch();
    },
    villAddBreak() {
      this.vill.pack.items.push({ type: 'break', title: 'Pausa', minutes: 3 });
      this.villTouch();
    },
    // Cada pack empieza y acaba con el himno y «Feliz Navidad».
    villAddBookends() {
      const find = (re) => (this.vill.data?.songs || []).find(s => re.test(villNorm(s.title)));
      const keyOf = Object.fromEntries((this.data?.categories || []).map(c => [c.letter, c.indice_key || '']));
      const mk = (s, fallback) => s
        ? this.villItemFromSong({ ...s, ref: `${keyOf[s.category_letter]}/${villSongSlug(s.filename)}` })
        : { song: null, title: fallback, status: 'missing' };
      const himno = find(/himno/), feliz = find(/feliz navidad/);
      const items = this.vill.pack.items;
      items.unshift(mk(himno, 'Himno Villancicos Solidarios'), mk(feliz, 'Feliz Navidad'));
      items.push(mk(himno, 'Himno Villancicos Solidarios'), mk(feliz, 'Feliz Navidad'));
      this.villTouch();
    },
    villRemoveItem(i) { this.vill.pack.items.splice(i, 1); this.villTouch(); },
    villMoveItem(i, d) {
      const items = this.vill.pack.items, j = i + d;
      if (j < 0 || j >= items.length) return;
      [items[i], items[j]] = [items[j], items[i]];
      this.villTouch();
    },
    villDragStart(i, ev) { this.vill.dragIdx = i; ev.dataTransfer.effectAllowed = 'move'; },
    villDragOver(i, ev) { ev.preventDefault(); this.vill.overIdx = i; },
    villDrop(i) {
      const from = this.vill.dragIdx;
      this.vill.dragIdx = this.vill.overIdx = null;
      if (from === null || from === i) return;
      const items = this.vill.pack.items;
      const [it] = items.splice(from, 1);
      items.splice(i, 0, it);
      this.villTouch();
    },
    villPackPayload() {
      const p = this.vill.pack;
      return {
        title: p.title, event: p.event, date: p.date, targetMinutes: p.targetMinutes,
        defaultDuration: p.defaultDuration, notes: p.notes,
        items: p.items.map(it => it.type === 'break'
          ? { type: 'break', title: it.title, minutes: it.minutes }
          : { song: it.song || null, title: it.title, key: it.key, capo: it.capo === '' ? undefined : it.capo,
              duration: it.duration, notes: it.notes, page: it.page }),
      };
    },
    async villSavePack() {
      const p = this.vill.pack;
      if (!p || !p.title.trim()) { alert('Ponle un título al pack'); return; }
      this.vill.packSaving = true;
      try {
        // El nombre del fichero no cambia aunque cambie el título: solo un pack
        // nuevo lo saca del título (sin pisar ninguno que ya exista).
        let slug = this.vill.packSlug;
        if (!slug) {
          const base = slugifyTag(p.title) || 'pack';
          slug = base;
          for (let n = 2; this.vill.packs.some(x => x.slug === slug); n++) slug = `${base}-${n}`;
        }
        const body = this.villPackPayload();
        const r = await fetch('/api/packs/' + encodeURIComponent(slug), {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status);
        this.vill.packDirty = false;
        await this.villLoadPacks();
        this.villOpenPack(this.vill.packs.find(x => x.slug === j.slug) || j.pack);
        this.loadGitStatus && this.loadGitStatus(true);
      } catch (e) {
        alert('No se pudo guardar: ' + e.message);
      } finally {
        this.vill.packSaving = false;
      }
    },
    async villDeletePack() {
      if (!this.vill.packSlug) { this.vill.pack = null; this.vill.packDirty = false; return; }
      if (!confirm(`¿Borrar el pack «${this.vill.pack.title}»? (Queda en el historial de git)`)) return;
      await fetch('/api/packs/' + encodeURIComponent(this.vill.packSlug), { method: 'DELETE' });
      this.vill.pack = null;
      this.vill.packSlug = null;
      this.vill.packDirty = false;
      await this.villLoadPacks();
      this.loadGitStatus && this.loadGitStatus(true);
    },
    async villExport(format) {
      if (!this.vill.packSlug || this.vill.packDirty) { alert('Guarda primero el pack.'); return; }
      const r = await fetch(`/api/packs/${encodeURIComponent(this.vill.packSlug)}/export?format=${format}`);
      const j = await r.json();
      if (format === 'md') {
        const blob = new Blob([j.text], { type: 'text/markdown' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = j.filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        return;
      }
      try {
        await navigator.clipboard.writeText(j.text);
        alert('Copiado. Pégalo en WhatsApp:\n\n' + j.text.slice(0, 400) + (j.text.length > 400 ? '…' : ''));
      } catch (e) {
        prompt('Copia el texto:', j.text);
      }
    },
    villEsc(s) {
      return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    },
    // Hoja para imprimir: la lista con la hora a la que empieza cada una.
    villPrintList() {
      const p = this.vill.pack;
      if (!p) return;
      const starts = this.villPackTimeline();
      const rows = p.items.map((it, i) => it.type === 'break'
        ? `<tr class="br"><td></td><td>${villClock(starts[i])}</td><td colspan="4">⏸ ${this.villEsc(it.title)} (${it.minutes || 0}′)</td></tr>`
        : `<tr><td>${this.villSongNumber(p.items, i)}</td><td>${villClock(starts[i])}</td>
             <td><b>${this.villEsc(it.title || it.songTitle)}</b></td>
             <td>${this.villEsc(it.key || it.songKey || '')}${(it.capo ?? it.songCapo) ? ' · C/' + (it.capo ?? it.songCapo) : ''}</td>
             <td>${this.villEsc(it.notes || '')}</td><td>${this.villEsc(it.page || '')}</td></tr>`).join('');
      const w = window.open('', '_blank');
      w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${this.villEsc(p.title)}</title>
        <style>body{font:14px system-ui,sans-serif;margin:24px}h1{margin:0}p{color:#555;margin:4px 0 16px}
        table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ddd;padding:6px 8px;text-align:left}
        th{font-size:12px;color:#666}tr.br td{color:#777;font-style:italic;background:#f6f6f6}</style></head><body>
        <h1>🎄 ${this.villEsc(p.title)}</h1>
        <p>${this.villEsc([p.event, p.date].filter(Boolean).join(' · '))} — ⏱ ${this.villPackEstimated() ? '≈ ' : ''}${villClock(this.villPackTotal())} (objetivo ${p.targetMinutes}′)</p>
        <table><tr><th>#</th><th>Empieza</th><th>Canción</th><th>Tono</th><th>Notas</th><th>Pág.</th></tr>${rows}</table>
        ${p.notes ? `<p>${this.villEsc(p.notes)}</p>` : ''}
        <script>setTimeout(() => print(), 300)<\/script></body></html>`);
      w.document.close();
    },
    // El cancionero del pack: cada canción con acordes, en el tono del pack y
    // pintada con la hoja de la app. Una por página.
    async villPrintSongbook() {
      if (!this.vill.packSlug || this.vill.packDirty) { alert('Guarda primero el pack.'); return; }
      if (!this.appPreviewOn()) { alert('Falta static/mcm-sheet.js (la hoja de la app).'); return; }
      const r = await fetch(`/api/packs/${encodeURIComponent(this.vill.packSlug)}/songs`);
      const p = await r.json();
      let head = '', bodyClass = '';
      const pages = [];
      for (const it of p.items) {
        if (it.type === 'break' || !it.content) continue;
        let cho = it.content;
        const from = it.songKey, to = it.key;
        if (to && from && normalizeKey(to) !== normalizeKey(from)) {
          try { cho = transposeChoToKey(cho, from, to); } catch (e) { /* se queda en su tono */ }
          cho = cho.replace(/^\s*\{\s*key\s*:[^}]*\}/im, `{key: ${to}}`);
        }
        if (it.capo !== undefined && it.capo !== null && it.capo !== '') {
          cho = /\{\s*capo\s*:/i.test(cho) ? cho.replace(/\{\s*capo\s*:[^}]*\}/i, `{capo: ${it.capo}}`)
                                          : cho.replace(/(\{\s*title\s*:[^}]*\})/i, `$1\n{capo: ${it.capo}}`);
        }
        // DOMParser y no expresiones regulares: el CSS de la hoja lleva «<body>»
        // dentro de un comentario.
        const doc = new DOMParser().parseFromString(this.appPreviewHtml(cho), 'text/html');
        doc.querySelectorAll('script').forEach(el => el.remove());
        if (!head) { head = doc.head.innerHTML; bodyClass = doc.body.className; }
        const body = doc.body.innerHTML;
        pages.push(`<div class="pk-page">${it.notes ? `<div class="pk-note">${this.villEsc(it.notes)}</div>` : ''}${body}</div>`);
      }
      if (!pages.length) { alert('Ninguna canción del pack está todavía en el cantoral.'); return; }
      const w = window.open('', '_blank');
      w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${this.villEsc(p.title)}</title>${head}
        <style>.pk-page{page-break-after:always}.pk-note{float:right;font-size:13px;color:#888}
        @media print{body{padding:0 8px}}</style></head><body class="${this.villEsc(bodyClass)}">
        <h1 style="text-align:center">🎄 ${this.villEsc(p.title)}</h1>${pages.join('')}
        <script>setTimeout(() => print(), 600)<\/script></body></html>`);
      w.document.close();
    },
  };
}
