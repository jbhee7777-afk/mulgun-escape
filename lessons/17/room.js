/* 17차시 우리 교실 지도 — 선생님이 우리 교실 모양으로 고쳐 쓰는 지도
   - 이 컴퓨터 브라우저에 저장돼요(localStorage 'mg17room'). 활동지도 같은 컴퓨터에서 인쇄하면 고친 지도로 나와요.
   - ROOM.items() 지금 지도, ROOM.svg(items) 그림, ROOM.edit(svg, onChange) 고치기 */
const ROOM = (() => {
  const KEY = 'mg17room';
  const KIND = {
    board:{n:'칠판', f:'#4f8a63', s:'#3b6b4b', c:'#fff'}, tdesk:{n:'선생님 책상', f:'#e8c99a', s:'#c9a477', c:'#7a5530'},
    desk:{n:'책상', f:'#f2d7a6', s:'#d3ad73', c:'#9a7448'}, door:{n:'문', f:'#d69a5a', s:'#a8743c', c:'#fff'},
    window:{n:'창문', f:'#bfe3ff', s:'#8fc2e8', c:'#2f6a92'}, locker:{n:'사물함', f:'#f6c9a8', s:'#d99a72', c:'#8a4a2b'},
    notice:{n:'게시판', f:'#ffe3ef', s:'#e9a6c4', c:'#8f2f5c'}, shelf:{n:'책꽂이', f:'#efe1f7', s:'#bf9bd8', c:'#6a3d92'},
    recycle:{n:'분리수거', f:'#d9f0d9', s:'#8fc98f', c:'#3a7a3a'}, clean:{n:'청소함', f:'#e3e7ee', s:'#a9b3c4', c:'#4a5568'},
    tv:{n:'텔레비전', f:'#3a4152', s:'#22293a', c:'#fff'}, etc:{n:'기타', f:'#fff6d6', s:'#e7c35a', c:'#7a5a00'}};
  const DEF = () => { const a = [
    {k:'board', x:230, y:22, w:340, h:30}, {k:'tv', x:110, y:22, w:100, h:30}, {k:'tdesk', x:590, y:70, w:110, h:56},
    {k:'window', x:14, y:90, w:14, h:380}, {k:'door', x:772, y:64, w:14, h:80, n:'앞문'}, {k:'door', x:772, y:420, w:14, h:80, n:'뒷문'},
    {k:'locker', x:120, y:470, w:420, h:62, n:'사물함 (위에 게시판)'}, {k:'clean', x:40, y:470, w:66, h:62},
    {k:'recycle', x:560, y:480, w:76, h:52}, {k:'shelf', x:656, y:480, w:84, h:52}];
    for(let r = 0; r < 3; r++) for(let c = 0; c < 4; c++) a.push({k:'desk', x:110 + c * 145, y:150 + r * 85, w:90, h:46, n:''});
    return a; };
  function items(){ try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if(Array.isArray(s) && s.length) return s; } catch(e) {} return DEF(); }
  function save(a){ try { localStorage.setItem(KEY, JSON.stringify(a)); } catch(e) {} }
  function reset(){ try { localStorage.removeItem(KEY); } catch(e) {} return DEF(); }
  const esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'}[c]));
  function one(o, i, sel){ const K = KIND[o.k] || KIND.etc, label = o.n != null ? o.n : K.n, vert = o.h > o.w * 2.2 && o.w < 40;
    const fs = Math.max(13, Math.min(21, Math.min(o.w, o.h) * .45 + 6));
    let t = '';
    if(label){ if(vert) t = `<text x="${o.x + o.w + 8}" y="${o.y + o.h / 2 + 6}" font-size="18" fill="${K.s}">${esc(label)}</text>`;
      else if(o.w < 40 || o.h < 22) t = `<text x="${o.x + o.w / 2}" y="${o.y - 6}" font-size="17" fill="${K.s}" text-anchor="middle">${esc(label)}</text>`;
      else t = `<text x="${o.x + o.w / 2}" y="${o.y + o.h / 2 + fs * .36}" font-size="${fs}" fill="${K.c}" text-anchor="middle">${esc(label)}</text>`; }
    if(o.x > 700 && vert && label) t = `<text x="${o.x - 8}" y="${o.y + o.h / 2 + 6}" font-size="18" fill="${K.s}" text-anchor="end">${esc(label)}</text>`;
    return `<g data-i="${i}" class="ri${sel ? ' sel' : ''}"><rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${Math.min(10, o.w / 3, o.h / 3)}" fill="${K.f}" stroke="${sel ? '#2d3a7c' : K.s}" stroke-width="${sel ? 5 : 2.5}"/>${t}${sel ? `<rect class="rh" x="${o.x + o.w - 9}" y="${o.y + o.h - 9}" width="18" height="18" rx="4" fill="#2d3a7c"/>` : ''}</g>`; }
  function svg(a, sel = -1){ return `<rect x="6" y="6" width="788" height="548" rx="26" fill="#fffaf0" stroke="#c9a77a" stroke-width="6"/>` + a.map((o, i) => one(o, i, i === sel)).join(''); }
  /* 고치기: 끌어서 옮기기, 오른쪽 아래 네모를 끌어 크기 바꾸기 */
  function edit(el, st){ /* st: {a, sel, on(sel)} */
    const pt = e => { const r = el.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 800, (e.clientY - r.top) / r.height * 560]; };
    let drag = null;
    el.addEventListener('pointerdown', e => { if(!st.editing) return; const g = e.target.closest('.ri'); const [x, y] = pt(e);
      if(!g){ st.sel = -1; st.on(); return; } const i = +g.dataset.i, o = st.a[i]; st.sel = i;
      drag = {i, mode:e.target.classList.contains('rh') ? 'size' : 'move', x, y, o:{...o}}; el.setPointerCapture(e.pointerId); st.on(); e.preventDefault(); });
    el.addEventListener('pointermove', e => { if(!drag) return; const [x, y] = pt(e), o = st.a[drag.i], dx = x - drag.x, dy = y - drag.y, g = v => Math.round(v / 5) * 5;
      if(drag.mode === 'move'){ o.x = Math.max(6, Math.min(794 - o.w, g(drag.o.x + dx))); o.y = Math.max(6, Math.min(554 - o.h, g(drag.o.y + dy))); }
      else { o.w = Math.max(10, Math.min(794 - o.x, g(drag.o.w + dx))); o.h = Math.max(10, Math.min(554 - o.y, g(drag.o.h + dy))); }
      st.on(true); });
    el.addEventListener('pointerup', () => { if(drag){ drag = null; save(st.a); st.on(); } }); }
  return {KIND, items, save, reset, svg, edit, DEF};
})();
