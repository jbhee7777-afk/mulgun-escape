/* 물건 교과서 수업 화면 공용 스크립트
   페이지에서 먼저 정해 둘 것: window.LESSON = {room, lesson, keyPieces}  (keyPieces = 이 차시까지 모은 열쇠 조각 수)
   슬라이드: <section class="slide" data-phase="…" data-notes="…" data-hook="이름">
   훅: hooks.이름 = () => {} 로 등록하면 그 슬라이드에 들어올 때 실행돼요. */
const stage = document.getElementById('stage');
function fit(){ stage.style.transform = `scale(${Math.min(innerWidth / 1600, innerHeight / 900)})`; }
addEventListener('resize', fit); fit();

/* ---------- 소리 ---------- */
let ac;
function snd(seq){ try{ ac = ac || new (window.AudioContext || window.webkitAudioContext)(); let t = ac.currentTime;
  seq.forEach(([f, d, type = 'sine', v = .18]) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d); t += d * .8; }); }catch(e){} }
const S = {
  tick: () => snd([[880, .07, 'square', .06]]), ok: () => snd([[660, .12], [880, .12], [1175, .25]]),
  no: () => snd([[300, .15, 'square', .07], [220, .25, 'square', .06]]),
  poof: () => snd([[900, .08, 'triangle', .12], [600, .1, 'triangle', .1], [300, .3, 'sawtooth', .06]]),
  win: () => snd([[523, .15], [659, .15], [784, .15], [1047, .45]]), flip: () => snd([[520, .1, 'triangle']]),
  end: () => snd([[880, .3], [660, .3], [880, .3], [660, .5]])
};

/* ---------- 슬라이드 넘기기 ---------- */
const hooks = {};
const slides = [...document.querySelectorAll('.slide')]; let cur = 0;
const dots = document.getElementById('dots');
slides.forEach((_, i) => { const d = document.createElement('i'); d.onclick = () => go(i); dots.appendChild(d); });
function go(i){ if(i < 0 || i >= slides.length) return; slides[cur].classList.remove('active'); if(hooks.leave) hooks.leave(cur); cur = i; const s = slides[cur]; s.classList.add('active');
  document.getElementById('phase').textContent = s.dataset.phase || '';
  document.getElementById('notes').innerHTML = s.dataset.notes || '';
  [...dots.children].forEach((d, k) => { d.className = k === cur ? 'on' : (k < cur ? 'done' : ''); });
  const h = s.dataset.hook; if(h && hooks[h]) hooks[h]();
  try{ history.replaceState(null, '', '#' + (cur + 1)); }catch(e){} }
addEventListener('keydown', e => { if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  if(['ArrowRight', 'PageDown', ' '].includes(e.key)){ e.preventDefault(); go(cur + 1); }
  else if(['ArrowLeft', 'PageUp'].includes(e.key)){ e.preventDefault(); go(cur - 1); }
  else if(e.key === 'n' || e.key === 'N') toggleNotes(); else if(e.key === 'f' || e.key === 'F') toggleFull();
  else if(e.key === 'Escape' && window.onEsc) window.onEsc(); });
function toggleNotes(){ document.getElementById('notes').classList.toggle('show'); }
function toggleFull(){ if(!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); }

/* ---------- 타자기 글자 ---------- */
function typewriter(el, html, speed = 55){ clearInterval(el._tw); const parts = html.split(/(<[^>]+>)/); let out = '', pi = 0, ci = 0;
  el._tw = setInterval(() => { if(pi >= parts.length){ clearInterval(el._tw); el.innerHTML = out; return; }
    const p = parts[pi]; if(p.startsWith('<')){ out += p; pi++; ci = 0; return; }
    if(ci < p.length){ out += p[ci++]; if(ci % 3 === 0) S.tick(); } else { pi++; ci = 0; }
    el.innerHTML = out + '<span class="cursor"></span>'; }, speed);
  el.onclick = () => { clearInterval(el._tw); el.innerHTML = html; }; }

/* ---------- 타이머 ---------- */
document.querySelectorAll('.timer').forEach(t => { const total = +t.dataset.sec; let left = total, iv = null, max = total;
  t.innerHTML = `<div class="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" stroke="#f3e2c4" stroke-width="10" fill="none"/>
  <circle class="arc" cx="50" cy="50" r="42" stroke="#4fd1ae" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="263.9" stroke-dashoffset="0"/></svg><div class="num"></div></div>
  <div class="ctl"><button class="btn mint" data-a="go">▶ 시작</button><button class="btn ghost" data-a="plus">＋1분</button><button class="btn ghost" data-a="reset">↺ 처음부터</button></div>`;
  const num = t.querySelector('.num'), arc = t.querySelector('.arc'), gob = t.querySelector('[data-a=go]');
  const draw = () => { num.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`; arc.style.strokeDashoffset = 263.9 * (1 - left / max); arc.style.stroke = left <= 60 ? '#ff7b6b' : '#4fd1ae'; }; draw();
  t.addEventListener('click', e => { const a = e.target.dataset.a; if(!a) return;
    if(a === 'go'){ if(iv){ clearInterval(iv); iv = null; gob.textContent = '▶ 계속'; } else { gob.textContent = '⏸ 멈춤'; t.classList.remove('end');
      iv = setInterval(() => { left--; draw(); if(left <= 0){ clearInterval(iv); iv = null; t.classList.add('end'); gob.textContent = '▶ 시작'; S.end(); } }, 1000); } }
    if(a === 'plus'){ left += 60; max = Math.max(max, left); draw(); }
    if(a === 'reset'){ clearInterval(iv); iv = null; left = total; max = total; t.classList.remove('end'); gob.textContent = '▶ 시작'; draw(); } }); });

/* ---------- 발표 번호 뽑기 ---------- */
const picked = [];
function pick(){ const max = Math.max(2, +document.getElementById('pickMax').value || 25); const el = document.getElementById('picker');
  let pool = [...Array(max)].map((_, i) => i + 1).filter(n => !picked.includes(n)); if(!pool.length){ picked.length = 0; pool = [...Array(max)].map((_, i) => i + 1); }
  const ans = pool[Math.floor(Math.random() * pool.length)]; el.classList.add('roll'); let k = 0;
  const iv = setInterval(() => { el.textContent = 1 + Math.floor(Math.random() * max); S.tick(); if(++k > 18){ clearInterval(iv); el.textContent = ans; el.classList.remove('roll'); S.ok();
    picked.push(ans); document.getElementById('pickHist').textContent = '발표한 요원: ' + picked.join(', ') + '번'; } }, 70); }

/* ---------- 비밀 문장 빈칸 ---------- */
function openBlank(el){ if(el.classList.contains('open')) return; el.classList.add('open'); S.ok(); }

/* ---------- 열쇠 조각 ---------- */
function litKey(){ const n = (window.LESSON || {}).keyPieces || 1;
  for(let k = 1; k <= 8; k++){ const p = document.getElementById('p' + k); if(!p) continue; if(k < n) p.classList.add('lit'); else p.classList.remove('lit'); }
  const p = document.getElementById('p' + n); if(!p) return; setTimeout(() => p.classList.add('lit'), 60); S.win();
  const box = document.getElementById('keybox'), bb = p.getBBox(), sx = box.clientWidth / 700;
  for(let i = 0; i < 28; i++){ const s = document.createElement('div'); s.className = 'spark';
    s.style.left = (bb.x + bb.width / 2) * sx + 'px'; s.style.top = (bb.y + bb.height / 2) * sx + 'px'; const a = Math.random() * Math.PI * 2, r = 120 + Math.random() * 170;
    s.style.setProperty('--dx', Math.cos(a) * r + 'px'); s.style.setProperty('--dy', Math.sin(a) * r + 'px'); box.appendChild(s); setTimeout(() => s.remove(), 1400); } }
hooks.key = () => setTimeout(litKey, 400);

/* ---------- 차시 완료 → 방탈출 앱에 알리기 ---------- */
function complete(){ const L = window.LESSON || {}; S.win();
  try{ parent.postMessage({type:'lesson-complete', room:L.room, lesson:L.lesson}, '*'); }catch(e){}
  const b = document.getElementById('doneBtn'); if(b){ b.textContent = `🎉 완료! 열쇠 조각 ${L.keyPieces}/${document.querySelectorAll(".piece").length || 4}`; b.disabled = true; } }

function startDeck(){ const startAt = parseInt(location.hash.slice(1)) - 1; go(isNaN(startAt) ? 0 : Math.min(Math.max(startAt, 0), slides.length - 1)); }
