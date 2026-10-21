/* 9차시부터 쓰는 공용 도구 (base.js 다음에 불러요)
   K.photo('glue')            → 실제 사진 <img> (lessons/shared/photos/glue.jpg)
   K.teams('elId', {n:6})     → 모둠 점수판. K.score[t] 로 점수를 읽어요. 여러 판을 만들어도 점수는 하나로 이어져요.
   K.clock({el, btn, label, sec, onEnd}) → 타이머(시작/멈춤/처음부터). 반환값 .stop() .reset(sec)
   K.rounds('elId', 개수, i => {...}) → 문제 번호 단추. 반환값 .on(i) .done(i)
   K.leave(fn)                → 슬라이드를 떠날 때 할 일(여러 개 등록 가능)
   K.ro('나무') → '나무로', K.shuffle(배열) */
const K = (() => {
  const score = Array(8).fill(0); let teamN = 6; const boards = [];
  const photo = (k, cls = '') => `<img class="ph ${cls}" src="../shared/photos/${k}.jpg" alt="">`;
  function drawTeams(){ boards.forEach(b => { const el = document.getElementById(b.id); if(!el) return;
    el.innerHTML = [...Array(teamN)].map((_, t) => `<div class="team ${b.turn && b.turn() === t ? 'turn' : ''}"><span class="tn">${t + 1}모둠</span><button class="m" onclick="K.add(${t},-1)">−</button><span class="pt">${score[t]}</span><button onclick="K.add(${t},1)">＋</button></div>`).join('')
      + `<div style="text-align:center;margin-top:6px;font-size:18px;color:var(--ink2)">모둠 수 <button class="m" style="width:30px;height:30px;border-radius:8px;background:#f1e6d4" onclick="K.setN(-1)">−</button> ${teamN} <button style="width:30px;height:30px;border-radius:8px;background:var(--gold2)" onclick="K.setN(1)">＋</button></div>`; }); }
  function teams(id, o = {}){ boards.push({id, turn:o.turn}); drawTeams(); }
  function add(t, d){ score[t] = Math.max(0, score[t] + d); if(d > 0) S.ok(); drawTeams(); }
  function setN(d){ teamN = Math.min(8, Math.max(2, teamN + d)); drawTeams(); }
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  function clock(o){ let left = o.sec, iv = null; const el = () => document.getElementById(o.el), btn = () => document.getElementById(o.btn), lbl = o.btnLabel || ('▶ ' + (o.sec >= 60 ? `${Math.round(o.sec / 60 * 10) / 10}분` : `${o.sec}초`));
    const draw = () => { const e = el(); if(!e) return; e.textContent = o.sec >= 60 ? fmt(left) : left; e.classList.toggle('low', left <= Math.min(30, o.sec / 4)); };
    const stop = () => { clearInterval(iv); iv = null; if(btn()) btn().textContent = lbl; };
    const api = {stop, reset(s){ stop(); left = s == null ? o.sec : s; draw(); }, get left(){ return left; },
      toggle(){ if(iv){ stop(); return; } if(left <= 0) left = o.sec; if(btn()) btn().textContent = '⏸ 멈춤'; S.tick();
        iv = setInterval(() => { left--; draw(); if(left <= 0){ stop(); S.end(); o.onEnd && o.onEnd(); } }, 1000); }};
    draw(); leaves.push(stop); return api; }
  function rounds(id, n, pick){ const done = {}; let cur = 0; const draw = () => { document.getElementById(id).innerHTML = [...Array(n)].map((_, i) => `<button class="${i === cur ? 'on' : done[i] ? 'done' : ''}" data-i="${i}">${i + 1}</button>`).join('');
      document.querySelectorAll(`#${id} button`).forEach(b => b.onclick = () => pick(+b.dataset.i)); };
    draw(); return {on(i){ cur = i; draw(); }, done(i){ done[i] = 1; draw(); }, get cur(){ return cur; }, n}; }
  const leaves = []; const prevLeave = hooks.leave; hooks.leave = i => { prevLeave && prevLeave(i); leaves.forEach(f => f(i)); };
  const ro = w => { const c = w.charCodeAt(w.length - 1) - 0xAC00, j = c % 28; return w + (c >= 0 && c < 11172 && j && j !== 8 ? '으로' : '로'); };
  const shuffle = a => { for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  return {photo, teams, add, setN, score, get teamN(){ return teamN; }, clock, rounds, leave:f => leaves.push(f), ro, shuffle, fmt};
})();
