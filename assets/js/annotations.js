/* ========================================
   Notion-style Annotation System
   ======================================== */
import { fsLoad, fsSave, fsDelete } from './firebase.js';

export async function initAnnotations() {
  const pageId     = getPageId();
  const STORAGE_KEY = 'aws-security-annotations-' + pageId;
  let annotations  = [];
  let activeAnnotationId = null;
  let pending      = null;

  const toolbar = createToolbar();
  const popover = createPopover();
  const panel   = createPanel();
  const fab     = createFab();
  document.body.append(toolbar, popover, panel, fab);

  /* ---- 유틸 ---- */
  function getPageId() {
    return location.pathname.replace(/[^a-z0-9]/gi, '-');
  }
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---- 저장/불러오기 ---- */
  async function loadAnnotations() {
    const remote = await fsLoad(pageId);
    if (remote !== null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
      return remote;
    }
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }

  function saveLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
  }

  async function saveAnnotation(ann) {
    saveLocal();
    await fsSave({ ...ann, pageId });
  }

  async function removeAnnotation(id) {
    annotations = annotations.filter(a => a.id !== id);
    saveLocal();
    await fsDelete(id);
  }

  annotations = await loadAnnotations();

  /* ---- DOM 생성: 툴바 ---- */
  function createToolbar() {
    const t = document.createElement('div');
    t.id = 'annotation-toolbar';
    const colors = [
      { id: 'yellow', label: '노랑', hex: '#F9A825' },
      { id: 'green',  label: '초록', hex: '#43A047' },
      { id: 'blue',   label: '파랑', hex: '#1E88E5' },
      { id: 'pink',   label: '분홍', hex: '#E91E63' },
      { id: 'purple', label: '보라', hex: '#8E24AA' },
    ];
    colors.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'toolbar-btn color-dot';
      btn.title = c.label;
      btn.style.color = c.hex;
      btn.addEventListener('mousedown', e => e.preventDefault());
      btn.addEventListener('click', () => applyHighlight(c.id, false).catch(console.error));
      t.appendChild(btn);
    });
    const sep = document.createElement('div');
    sep.className = 'toolbar-sep';
    t.appendChild(sep);
    const noteBtn = document.createElement('button');
    noteBtn.className = 'toolbar-btn';
    noteBtn.innerHTML = '&#x1F4DD; 메모';
    noteBtn.addEventListener('mousedown', e => e.preventDefault());
    noteBtn.addEventListener('click', () => applyHighlight('yellow', true).catch(console.error));
    t.appendChild(noteBtn);
    return t;
  }

  /* ---- DOM 생성: 팝오버 ---- */
  function createPopover() {
    const p = document.createElement('div');
    p.className = 'note-popover';
    p.innerHTML = `
      <div class="note-popover-header">
        <span>메모</span>
        <button class="note-popover-close">&times;</button>
      </div>
      <textarea placeholder="이 부분에 대한 메모를 입력하세요..." rows="4"></textarea>
      <div class="note-popover-actions">
        <button class="note-delete-btn">삭제</button>
        <button class="note-save-btn">저장</button>
      </div>`;
    p.querySelector('.note-popover-close').addEventListener('click', closePopover);
    p.querySelector('.note-save-btn').addEventListener('click', () => saveNote().catch(console.error));
    p.querySelector('.note-delete-btn').addEventListener('click', () => deleteAnnotation().catch(console.error));
    return p;
  }

  /* ---- DOM 생성: 메모 패널 ---- */
  function createPanel() {
    const p = document.createElement('div');
    p.id = 'notes-panel';
    p.innerHTML = `
      <div class="notes-panel-header">
        <h3>&#x1F4CB; 내 메모 목록</h3>
        <button class="notes-panel-close">&times;</button>
      </div>
      <div class="notes-panel-body"></div>`;
    p.querySelector('.notes-panel-close').addEventListener('click', () => p.classList.remove('open'));
    return p;
  }

  /* ---- DOM 생성: FAB ---- */
  function createFab() {
    const f = document.createElement('button');
    f.id = 'notes-fab';
    f.title = '내 메모 보기';
    f.innerHTML = '&#x1F4DD;<span class="fab-badge"></span>';
    f.addEventListener('click', () => {
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) renderPanel();
    });
    return f;
  }

  /* ---- 텍스트 선택 감지 ---- */
  document.addEventListener('mouseup', e => {
    if (toolbar.contains(e.target) || popover.contains(e.target)) return;
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) { hideToolbar(); return; }
      const text = sel.toString().trim();
      if (text.length < 2) { hideToolbar(); return; }

      const range = sel.getRangeAt(0);
      const main  = document.querySelector('.main-content');
      if (!main) { hideToolbar(); return; }

      const ancestor = range.commonAncestorContainer.nodeType === 3
        ? range.commonAncestorContainer.parentElement
        : range.commonAncestorContainer;
      if (!main.contains(ancestor)) { hideToolbar(); return; }

      pending = {
        text,
        startNode:   range.startContainer,
        startOffset: range.startOffset,
        endNode:     range.endContainer,
        endOffset:   range.endOffset,
        rect:        range.getBoundingClientRect(),
      };
      positionToolbar(pending.rect);
    }, 20);
  });

  document.addEventListener('mousedown', e => {
    if (toolbar.contains(e.target) || popover.contains(e.target)) return;
    if (e.target.closest('.annotated')) return;
    hideToolbar();
    closePopover();
  });

  /* ---- 툴바 위치 ---- */
  function positionToolbar(rect) {
    toolbar.classList.add('visible');
    requestAnimationFrame(() => {
      const tw = toolbar.offsetWidth || 260;
      const th = toolbar.offsetHeight || 40;
      let left = rect.left + rect.width / 2 - tw / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
      let top = rect.top - th - 10;
      if (top < 8) top = rect.bottom + 8;
      toolbar.style.left = left + 'px';
      toolbar.style.top  = top + 'px';
    });
  }

  function hideToolbar() {
    toolbar.classList.remove('visible');
    pending = null;
  }

  /* ---- DOM 조작: 텍스트 노드에 span 삽입 ---- */
  function wrapTextNodes(p, spanClass, annId) {
    const range = document.createRange();
    try {
      range.setStart(p.startNode, p.startOffset);
      range.setEnd(p.endNode, p.endOffset);
    } catch { return null; }

    const root   = range.commonAncestorContainer;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const nodes  = [];
    let n;
    while ((n = walker.nextNode())) {
      if (range.intersectsNode(n)) nodes.push(n);
    }
    if (!nodes.length && root.nodeType === 3) nodes.push(root);
    if (!nodes.length) return null;

    let firstSpan = null;
    nodes.forEach(tn => {
      const len = tn.textContent.length;
      let s = 0, e = len;
      if (tn === p.startNode) s = p.startOffset;
      if (tn === p.endNode)   e = p.endOffset;
      if (s < 0) s = 0;
      if (e > len) e = len;
      if (s >= e) return;

      const before = tn.textContent.slice(0, s);
      const mid    = tn.textContent.slice(s, e);
      const after  = tn.textContent.slice(e);
      if (!mid) return;

      const span = document.createElement('span');
      span.className = spanClass;
      span.dataset.annId = annId;
      span.textContent = mid;
      bindSpan(span);

      const par = tn.parentNode;
      if (before) par.insertBefore(document.createTextNode(before), tn);
      par.insertBefore(span, tn);
      if (after)  par.insertBefore(document.createTextNode(after), tn);
      par.removeChild(tn);

      if (!firstSpan) firstSpan = span;
    });
    return firstSpan;
  }

  function bindSpan(span) {
    span.addEventListener('click', e => {
      e.stopPropagation();
      openPopover(span);
    });
  }

  /* ---- 위치 직렬화/역직렬화 ---- */
  function nodeOffsetToAbsolute(root, targetNode, targetOffset) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let total = 0, n;
    while ((n = walker.nextNode())) {
      if (n === targetNode) return total + targetOffset;
      total += n.textContent.length;
    }
    return -1;
  }

  function absoluteToNodeOffset(root, absOffset) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let total = 0, n;
    while ((n = walker.nextNode())) {
      const len = n.textContent.length;
      if (total + len >= absOffset) return { node: n, offset: absOffset - total };
      total += len;
    }
    return null;
  }

  function serializeRange(startNode, startOffset, endNode, endOffset) {
    const root = document.querySelector('.main-content');
    if (!root) return null;
    const startAbs = nodeOffsetToAbsolute(root, startNode, startOffset);
    const endAbs   = nodeOffsetToAbsolute(root, endNode,   endOffset);
    if (startAbs < 0 || endAbs < 0) return null;
    return { startAbs, endAbs };
  }

  function deserializeRange(loc) {
    const root = document.querySelector('.main-content');
    if (!root || !loc) return null;
    const start = absoluteToNodeOffset(root, loc.startAbs);
    const end   = absoluteToNodeOffset(root, loc.endAbs);
    if (!start || !end) return null;
    return { startNode: start.node, startOffset: start.offset, endNode: end.node, endOffset: end.offset };
  }

  /* ---- 하이라이트 적용 ---- */
  async function applyHighlight(color, withNote) {
    if (!pending) return;
    const snap = pending;
    pending = null;
    hideToolbar();

    const id  = 'ann-' + Date.now();
    const cls = 'annotated color-' + color;
    const loc = serializeRange(snap.startNode, snap.startOffset, snap.endNode, snap.endOffset);

    const first = wrapTextNodes(snap, cls, id);
    if (!first) return;

    const ann = { id, color, quote: snap.text, note: '', time: Date.now(), loc };
    annotations.push(ann);
    await saveAnnotation(ann);
    updateBadge();
    window.getSelection()?.removeAllRanges();

    if (withNote) openPopover(first);
    renderPanel();
  }

  /* ---- 팝오버 열기/닫기 ---- */
  function openPopover(span) {
    const id  = span.dataset.annId;
    const ann = annotations.find(a => a.id === id);
    if (!ann) return;
    activeAnnotationId = id;
    popover.querySelector('textarea').value = ann.note || '';

    const rect = span.getBoundingClientRect();
    let top  = rect.bottom + 8;
    let left = rect.left;
    if (left + 290 > window.innerWidth) left = window.innerWidth - 298;
    if (top + 220 > window.innerHeight) top = rect.top - 228;
    popover.style.top  = Math.max(8, top) + 'px';
    popover.style.left = Math.max(8, left) + 'px';
    popover.classList.add('visible');
    popover.querySelector('textarea').focus();
  }

  function closePopover() {
    popover.classList.remove('visible');
    activeAnnotationId = null;
  }

  /* ---- 메모 저장 ---- */
  async function saveNote() {
    if (!activeAnnotationId) return;
    const ann = annotations.find(a => a.id === activeAnnotationId);
    if (!ann) return;
    ann.note = popover.querySelector('textarea').value.trim();
    ann.time = Date.now();
    await saveAnnotation(ann);
    document.querySelectorAll(`[data-ann-id="${activeAnnotationId}"]`).forEach(s =>
      s.classList.toggle('has-note', !!ann.note)
    );
    closePopover();
    renderPanel();
  }

  /* ---- 하이라이트 삭제 ---- */
  async function deleteAnnotation() {
    if (!activeAnnotationId) return;
    const id = activeAnnotationId;
    document.querySelectorAll(`[data-ann-id="${id}"]`).forEach(span => {
      const par = span.parentNode;
      while (span.firstChild) par.insertBefore(span.firstChild, span);
      par.removeChild(span);
    });
    closePopover();
    await removeAnnotation(id);
    updateBadge();
    renderPanel();
  }

  /* ---- 패널 렌더링 ---- */
  function renderPanel() {
    const body = panel.querySelector('.notes-panel-body');
    if (!annotations.length) {
      body.innerHTML = '<p class="notes-panel-empty">아직 메모가 없습니다.<br>텍스트를 선택해서 하이라이트하거나 메모를 추가해보세요.</p>';
      return;
    }
    body.innerHTML = '';
    [...annotations].reverse().forEach(ann => {
      const item = document.createElement('div');
      item.className = 'note-item';
      const d  = new Date(ann.time);
      const ts = `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
      item.innerHTML = `
        <div class="note-item-quote">${esc(ann.quote)}</div>
        ${ann.note ? `<div class="note-item-text">${esc(ann.note)}</div>` : ''}
        <div class="note-item-meta">${ts}</div>`;
      item.addEventListener('click', () => {
        const span = document.querySelector(`[data-ann-id="${ann.id}"]`);
        panel.classList.remove('open');
        if (!span) return;
        setTimeout(() => {
          span.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            span.classList.add('ann-flash');
            setTimeout(() => span.classList.remove('ann-flash'), 1200);
          }, 500);
        }, 280);
      });
      body.appendChild(item);
    });
  }

  /* ---- FAB 배지 ---- */
  function updateBadge() {
    const badge = fab.querySelector('.fab-badge');
    const n = annotations.filter(a => a.note).length;
    badge.textContent = n;
    badge.classList.toggle('visible', n > 0);
  }

  /* ---- 복원 ---- */
  function restore() {
    const failed = [];
    annotations.forEach(ann => {
      if (!ann.loc) { failed.push(ann.id); return; }
      const rangeInfo = deserializeRange(ann.loc);
      if (!rangeInfo) { failed.push(ann.id); return; }
      const cls   = 'annotated color-' + ann.color + (ann.note ? ' has-note' : '');
      const first = wrapTextNodes(rangeInfo, cls, ann.id);
      if (!first) failed.push(ann.id);
    });
    if (failed.length) {
      failed.forEach(id => fsDelete(id).catch(console.error));
      annotations = annotations.filter(a => !failed.includes(a.id));
      saveLocal();
    }
    updateBadge();
    renderPanel();
  }

  restore();
}
