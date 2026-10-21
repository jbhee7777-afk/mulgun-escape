/* 종이 다리 실험 그림·영상 (8차시·24차시)
   책 두 무더기 사이(10cm)에 종이를 걸치고 동전을 하나씩 살며시 올려요. 중력 때문에 종이가 휘고, 너무 휘면 종이 끝이 책에서 미끄러져 떨어져요.
   - 실제와 같은 비율: 1cm = 32px(1600×900 기준). 종이 14.8cm(A4를 4등분한 크기), 책 사이 10cm, 동전 지름 2.4cm·두께 0.18cm
   - 휘는 모양: 가운데에 무게가 실린 '양끝을 받친 막대'처럼 3u−4u³ 곡선. 동전 하나마다 모양별로 정해진 만큼 더 휘어요(STIFF).
   - 종이 길이는 그대로라서 휘면 양끝이 안쪽으로 끌려와요(늘어나는 길이 ≈ 8/3·d²/간격). 책 위에 걸친 길이가 0이 되면 미끄러져 떨어져요.
   - 동전은 중력 가속도로 떨어지고, 종이는 감쇠 용수철처럼 출렁이다 멈춰요. 시간은 실제 흐른 시간으로 계산해요(느린 컴퓨터에서도 같은 빠르기).
   - 거의 옆에서 본 모습이라 휘는 정도가 잘 보여요. 병풍은 접는 선이 다리 방향과 같아요(오른쪽 위 작은 그림: 끝에서 본 모양).
   쓰는 법: const pb = new PaperBridge(canvas); pb.play('flat', {onCount, onFall, onDone}); pb.record('flat') → webm Blob
            PaperBridge.thumb(canvas, 'channel', 동전수) · PaperBridge.column(canvas, 'round') */
(function(){
const CM = 32, SPAN = 10, PAPER = 14.8, OVER = (PAPER - SPAN) / 2, DEPTH_V = 3.4;
const DESK = 720, BOOKS = 4, BOOK_T = 46, TOP = DESK - BOOKS * BOOK_T, CX = 800;
const LX = CX - SPAN / 2 * CM, RX = CX + SPAN / 2 * CM;
const DV = {x:.30, y:-.55};                                  /* 안쪽(깊이) 1cm 의 화면 이동: 위에서 살짝 내려다본 모습 */
const COIN_R = 1.2 * CM, COIN_T = .18 * CM * 1.7, G = 2600;  /* 중력(화면 px/s²) */
const STIFF = {flat:{d0:.6, k:1.6, max:6, n:'평평한 종이'}, hat:{d0:.06, k:.18, max:12, n:'⊓자 다리', h:.6},
  channel:{d0:.06, k:.17, max:12, n:'ㄷ자 홈통'}, pleat:{d0:.03, k:.06, max:15, n:'병풍 접기'}};
const BOOKL = [['#2f5aa8', '#244785'], ['#d94b4b', '#b13a3a'], ['#f2b51c', '#cf9a12'], ['#3a9bd1', '#2c7fae']];
const BOOKR = [['#3c8c5a', '#2f7047'], ['#d64a7a', '#b23a63'], ['#ee8a2f', '#c97022'], ['#7a59b8', '#61469a']];

class PaperBridge{
  constructor(cv){ this.cv = cv; this.x = cv.getContext('2d'); this.reset('flat'); }
  reset(kind){ this.kind = kind; const s = STIFF[kind]; this.d = s.d0; this.v = 0; this.coins = []; this.fall = null; this.wait = .8; this.placed = 0; this.done = false; this.draw(); }
  onPaper(){ return this.coins.filter(c => c.st === 'on'); }
  target(){ const s = STIFF[this.kind]; return s.d0 + s.k * this.onPaper().length; }
  retreat(d){ return 8 / 3 * d * d / SPAN / 2; }                         /* 한쪽 끝이 끌려온 길이(cm) */
  y(xcm, d){ const u = (xcm + SPAN / 2) / SPAN; if(u <= 0 || u >= 1) return TOP; const w = u <= .5 ? u : 1 - u; return TOP + d * CM * (3 * w - 4 * w * w * w); }
  lift(){ return (STIFF[this.kind].h || 0) * CM; }
  stackY(){ return this.y(0, this.d) - this.lift() - this.onPaper().length * COIN_T; }
  /* ---------- 한 걸음 계산 ---------- */
  step(dt, o){ const s = STIFF[this.kind];
    if(!this.fall){ const a = 70 * (this.target() - this.d) - 10 * this.v; this.v += a * dt; this.d = Math.max(0, this.d + this.v * dt); }
    for(const c of this.coins){
      if(c.st === 'lower'){ c.y += 380 * dt; if(c.y >= this.stackY() - COIN_T * 3){ c.st = 'drop'; c.vy = 40; } }
      else if(c.st === 'drop'){ c.vy += G * dt; c.y += c.vy * dt; if(c.y >= this.stackY()){ c.y = this.stackY(); c.st = 'on'; this.v += c.vy * .0011 * (s.k + .04); this.placed++; o.onClink && o.onClink(); o.onCount && o.onCount(this.placed); } }
      else if(c.st === 'free'){ c.vy += G * dt; c.y += c.vy * dt; c.x += c.vx * dt; c.rot += c.vr * dt; const floor = DESK - 3 - c.k * COIN_T * .6;
        if(c.y >= floor){ c.y = floor; if(c.vy > 120){ c.vy *= -.25; c.vx *= .5; c.vr *= .4; o.onClink && o.onClink(); } else { c.vy = 0; c.vx *= .85; c.rot *= .8; } } } }
    const on = this.onPaper(); on.forEach((c, i) => { c.y = this.y(0, this.d) - this.lift() - i * COIN_T; c.x = CX + c.ox; });
    if(!this.fall && this.retreat(this.d) >= OVER){ const w = (PAPER - 2 * OVER) * CM;
      this.fall = {y:this.y(0, this.d), vy:0, sag:this.d * CM, w};
      this.coins.forEach((c, k) => { if(c.st !== 'free'){ c.st = 'free'; c.k = k; c.vy = 30; c.vx = (Math.sin(k * 7.3) * .5) * 220; c.vr = Math.sin(k * 3.1) * 2.5; c.rot = 0; } }); o.onFall && o.onFall(); }
    if(this.fall){ const f = this.fall; f.vy += G * dt; f.y += f.vy * dt; const bottom = DESK - 4; if(f.y + 0 >= bottom){ f.y = bottom; f.vy = 0; f.sag += (6 - f.sag) * dt * 6; } }
    this.wait -= dt; const busy = this.coins.some(c => c.st === 'lower' || c.st === 'drop');
    if(!this.fall && !busy && this.wait <= 0){ if(this.placed < s.max){ this.coins.push({st:'lower', x:CX, ox:Math.sin(this.coins.length * 2.7) * 2, y:this.stackY() - 230, vy:0, rot:0}); this.wait = o.gap || .55; } else this.done = true; }
    const still = this.fall ? this.fall.vy === 0 && this.coins.every(c => c.st !== 'free' || (c.vy === 0 && Math.abs(c.vx) < 4)) : this.done && Math.abs(this.v) < .015;
    return still; }
  /* ---------- 그리기 ---------- */
  draw(){ const x = this.x; x.save(); x.setTransform(this.cv.width / 1600, 0, 0, this.cv.height / 900, 0, 0);
    this.room(x); this.books(x, LX, BOOKL, -1); this.books(x, RX, BOOKR, 1);
    if(this.fall) this.fallen(x); else this.paper(x, this.kind, this.d);
    this.coins.forEach(c => this.coin(x, c.x, c.y, c.rot || 0));
    if(this.kind !== 'flat') this.inset(x, this.kind);
    x.restore(); }
  room(x){ let g = x.createLinearGradient(0, 0, 0, 470); g.addColorStop(0, '#f5efe5'); g.addColorStop(1, '#ebe1d1'); x.fillStyle = g; x.fillRect(0, 0, 1600, 480);
    g = x.createLinearGradient(0, 470, 0, 900); g.addColorStop(0, '#dcb98a'); g.addColorStop(1, '#c39865'); x.fillStyle = g; x.fillRect(0, 470, 1600, 430);
    x.strokeStyle = 'rgba(120,80,40,.09)'; x.lineWidth = 2; for(let i = 0; i < 13; i++){ const y = 495 + i * 32; x.beginPath(); x.moveTo(0, y); for(let k = 0; k <= 16; k++) x.lineTo(k * 100, y + Math.sin(k * 1.3 + i) * 4); x.stroke(); }
    x.fillStyle = 'rgba(0,0,0,.07)'; x.fillRect(0, 468, 1600, 4); }
  books(x, edge, cols, side){ const w = 420, dx = DV.x * 8 * CM * .45, dy = DV.y * 8 * CM * .45;
    for(let i = 0; i < BOOKS; i++){ const y0 = DESK - (i + 1) * BOOK_T, sh = (i % 2 ? 7 : 0) * side, x0 = side < 0 ? edge - w + sh : edge + sh, x1 = x0 + w, [c, c2] = cols[i];
      /* 아래 그림자 */ if(i === 0){ x.fillStyle = 'rgba(70,40,10,.18)'; x.beginPath(); x.ellipse((x0 + x1) / 2 + 20, DESK + 4, w / 2 + 30, 10, 0, 0, Math.PI * 2); x.fill(); }
      /* 앞면: 책등 쪽 표지 + 종이 단면 */
      x.fillStyle = '#f8f2e2'; x.fillRect(x0 + 6, y0 + 7, w - 12, BOOK_T - 14);
      x.strokeStyle = 'rgba(165,145,105,.32)'; x.lineWidth = 1; for(let k = 0; k < 9; k++){ x.beginPath(); x.moveTo(x0 + 8, y0 + 10 + k * 3.3); x.lineTo(x1 - 8, y0 + 10 + k * 3.3); x.stroke(); }
      x.fillStyle = c; x.fillRect(x0, y0, w, 7); x.fillRect(x0, y0 + BOOK_T - 7, w, 7);
      x.fillStyle = c2; x.fillRect(side < 0 ? x0 : x1 - 10, y0, 10, BOOK_T);
      /* 옆면 */ x.fillStyle = c2; x.beginPath(); x.moveTo(x1, y0); x.lineTo(x1 + dx, y0 + dy); x.lineTo(x1 + dx, y0 + dy + BOOK_T); x.lineTo(x1, y0 + BOOK_T); x.closePath(); x.fill();
      x.fillStyle = 'rgba(0,0,0,.12)'; x.fill();
      if(i === BOOKS - 1){ x.fillStyle = c; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x0 + dx, y0 + dy); x.lineTo(x1 + dx, y0 + dy); x.lineTo(x1, y0); x.closePath(); x.fill();
        x.fillStyle = 'rgba(255,255,255,.14)'; x.fill(); } } }
  /* 종이: 앞 가장자리 선과 뒤 가장자리 선을 이어 칠해요 */
  paper(x, kind, d){ const r = Math.min(this.retreat(d), OVER), xs0 = -SPAN / 2 - OVER + r, xs1 = SPAN / 2 + OVER - r, N = 64;
    const P = []; for(let i = 0; i <= N; i++){ const xc = xs0 + (xs1 - xs0) * i / N; P.push([CX + xc * CM, this.y(xc, d)]); }
    const back = (px, py, z, h = 0) => [px + DV.x * z * CM, py + DV.y * z * CM - h * CM];
    const band = (z0, z1, h0, h1, fill) => { x.beginPath(); P.forEach(([px, py], i) => { const [a, b] = back(px, py, z0, h0); i ? x.lineTo(a, b) : x.moveTo(a, b); });
      for(let i = N; i >= 0; i--){ const [a, b] = back(P[i][0], P[i][1], z1, h1); x.lineTo(a, b); } x.closePath(); x.fillStyle = fill; x.fill(); x.strokeStyle = '#c3c3cd'; x.lineWidth = 1.2; x.stroke(); };
    if(kind === 'pleat'){ const n = 8, H = .35; for(let j = n - 1; j >= 0; j--){ band(j / n * DEPTH_V, (j + 1) / n * DEPTH_V, j % 2 ? H : 0, j % 2 ? 0 : H, j % 2 ? '#e1e1e9' : '#fbfbfd'); } }
    else if(kind === 'channel'){ const H = .55; band(DEPTH_V, DEPTH_V, 0, H, '#fff'); band(0, DEPTH_V, 0, 0, '#f4f4f8'); x.beginPath();
      P.forEach(([px, py], i) => { const [a, b] = back(px, py, DEPTH_V, 0); i ? x.lineTo(a, b) : x.moveTo(a, b); }); for(let i = N; i >= 0; i--){ const [a, b] = back(P[i][0], P[i][1], DEPTH_V, H); x.lineTo(a, b); } x.closePath(); x.fillStyle = '#e4e4ec'; x.fill(); x.stroke();
      x.beginPath(); P.forEach(([px, py], i) => i ? x.lineTo(px, py - H * CM) : x.moveTo(px, py - H * CM)); for(let i = N; i >= 0; i--) x.lineTo(P[i][0], P[i][1]); x.closePath(); x.fillStyle = 'rgba(250,250,253,.92)'; x.fill(); x.stroke(); }
    else if(kind === 'hat'){ const H = .6;
      x.beginPath(); P.forEach(([px, py], i) => { const [a, b] = back(px, py, DEPTH_V, 0); i ? x.lineTo(a, b) : x.moveTo(a, b); }); for(let i = N; i >= 0; i--){ const [a, b] = back(P[i][0], P[i][1], DEPTH_V, H); x.lineTo(a, b); } x.closePath(); x.fillStyle = '#d9d9e2'; x.fill(); x.strokeStyle = '#c3c3cd'; x.stroke();
      band(0, DEPTH_V, H, H, '#fbfbfd');
      x.beginPath(); P.forEach(([px, py], i) => i ? x.lineTo(px, py - H * CM) : x.moveTo(px, py - H * CM)); for(let i = N; i >= 0; i--) x.lineTo(P[i][0], P[i][1]); x.closePath(); x.fillStyle = '#e9e9f0'; x.fill(); x.strokeStyle = '#c3c3cd'; x.stroke(); }
    else { const layers = 1; for(let L = layers - 1; L >= 0; L--){ const g = x.createLinearGradient(0, TOP - 60, 0, TOP + d * CM + 10); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#e6e6ee');
        x.save(); x.translate(0, -L * 4); band(0, DEPTH_V, 0, 0, g); x.restore(); } }
    /* 앞 가장자리 두께와 그림자 */
    x.strokeStyle = 'rgba(60,60,80,.35)'; x.lineWidth = 2; x.beginPath(); P.forEach(([px, py], i) => i ? x.lineTo(px, py + 1) : x.moveTo(px, py + 1)); x.stroke(); }
  fallen(x){ const f = this.fall, w = f.w; x.save(); x.translate(CX, f.y);
    x.fillStyle = '#efeff4'; x.strokeStyle = '#c3c3cd'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(-w / 2, -f.sag * .35); x.quadraticCurveTo(0, f.sag * .1, w / 2, -f.sag * .35);
    x.lineTo(w / 2 + DV.x * DEPTH_V * CM, -f.sag * .35 + DV.y * DEPTH_V * CM); x.quadraticCurveTo(DV.x * DEPTH_V * CM, f.sag * .1 + DV.y * DEPTH_V * CM, -w / 2 + DV.x * DEPTH_V * CM, -f.sag * .35 + DV.y * DEPTH_V * CM); x.closePath(); x.fill(); x.stroke(); x.restore(); }
  coin(x, cx, cy, rot){ const R = COIN_R, ry = R * .38, T = COIN_T; x.save(); x.translate(cx + DV.x * DEPTH_V * CM * .5, cy + DV.y * DEPTH_V * CM * .5); x.rotate(rot);
    x.fillStyle = '#80858c'; x.beginPath(); x.ellipse(0, 0, R, ry, 0, 0, Math.PI); x.lineTo(-R, -T); x.ellipse(0, -T, R, ry, 0, Math.PI, 0, true); x.closePath(); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.4)'; x.lineWidth = 1; for(let a = .12; a < Math.PI; a += .13){ const px = -Math.cos(a) * R, py = Math.sin(a) * ry; x.beginPath(); x.moveTo(px, py - T + 1); x.lineTo(px, py); x.stroke(); }
    const g = x.createLinearGradient(-R, -T - ry, R, -T + ry); g.addColorStop(0, '#f6f7f9'); g.addColorStop(.45, '#c2c7ce'); g.addColorStop(.7, '#eff1f4'); g.addColorStop(1, '#a1a7af');
    x.fillStyle = g; x.beginPath(); x.ellipse(0, -T, R, ry, 0, 0, Math.PI * 2); x.fill();
    x.strokeStyle = 'rgba(95,100,108,.5)'; x.lineWidth = 1.3; x.beginPath(); x.ellipse(0, -T, R * .8, ry * .8, 0, 0, Math.PI * 2); x.stroke(); x.restore(); }
  /* 끝에서 본 모양(작은 그림) */
  inset(x, kind){ const X = 1230, Y = 70, W = 300, H = 170; x.fillStyle = 'rgba(255,255,255,.92)'; x.strokeStyle = '#d7e3e6'; x.lineWidth = 3; x.beginPath(); x.roundRect(X, Y, W, H, 22); x.fill(); x.stroke();
    x.fillStyle = '#127d74'; x.font = '700 26px Jua, "Malgun Gothic", sans-serif'; x.textAlign = 'center'; x.fillText('끝에서 본 모양', X + W / 2, Y + 40);
    x.strokeStyle = '#6b6b7c'; x.lineWidth = 5; x.lineJoin = 'round'; x.beginPath();
    if(kind === 'pleat'){ for(let i = 0; i <= 10; i++){ const px = X + 40 + i * 22, py = Y + (i % 2 ? 80 : 130); i ? x.lineTo(px, py) : x.moveTo(px, py); } }
    else if(kind === 'channel'){ x.moveTo(X + 50, Y + 75); x.lineTo(X + 50, Y + 130); x.lineTo(X + 250, Y + 130); x.lineTo(X + 250, Y + 75); }
    else { x.moveTo(X + 50, Y + 135); x.lineTo(X + 50, Y + 80); x.lineTo(X + 250, Y + 80); x.lineTo(X + 250, Y + 135); }
    x.stroke(); }
  /* ---------- 화면에서 재생 ---------- */
  play(kind, o = {}){ this.stop(); this.reset(kind); let last = performance.now(), acc = 0;
    const loop = now => { acc += Math.min(.25, (now - last) / 1000); last = now; let still = false;
      while(acc >= 1 / 240){ still = this.step(1 / 240, o); acc -= 1 / 240; if(still) break; }
      this.draw(); if(still){ this.raf = null; o.onDone && o.onDone(!!this.fall, this.placed); return; } this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop); }
  stop(){ if(this.raf) cancelAnimationFrame(this.raf); this.raf = null; }
  /* ---------- 영상 파일(webm)로 기록: 1/30초씩 계산해서 한 장면씩 넣어요 ---------- */
  async record(kinds, o = {}){ const st = this.cv.captureStream(0), tr = st.getVideoTracks()[0], rec = new MediaRecorder(st, {mimeType:'video/webm;codecs=vp9', videoBitsPerSecond:4e6}), parts = [];
    rec.ondataavailable = e => parts.push(e.data); rec.start(); const frame = () => new Promise(r => { tr.requestFrame(); setTimeout(r, 1000 / 30); });
    for(const k of kinds){ this.reset(k); o.title && o.title(this, k); for(let i = 0; i < 30; i++){ this.draw(); o.title && o.title(this, k); await frame(); }
      let still = false, t = 0; while(!still && t < 40){ for(let s = 0; s < 8; s++){ still = this.step(1 / 240, o); if(still) break; } t += 1 / 30; this.draw(); o.title && o.title(this, k); await frame(); }
      for(let i = 0; i < 60; i++){ this.draw(); o.title && o.title(this, k); await frame(); } }
    rec.stop(); await new Promise(r => rec.onstop = r); return new Blob(parts, {type:'video/webm'}); }
}
PaperBridge.STIFF = STIFF;

/* ---------- 모양 카드용 작은 그림: 다리 부분을 크게 ---------- */
PaperBridge.thumb = function(cv, kind, coins = 0){ const big = document.createElement('canvas'); big.width = 1600; big.height = 900; const pb = new PaperBridge(big); pb.reset(kind);
  for(let i = 0; i < coins; i++) pb.coins.push({st:'on', ox:0, x:CX, y:0}); pb.d = pb.target(); pb.onPaper().forEach((c, i) => { c.y = pb.y(0, pb.d) - pb.lift() - i * COIN_T; c.x = CX; });
  const inset = pb.inset; pb.inset = () => {}; pb.draw(); pb.inset = inset;
  const x = cv.getContext('2d'); x.clearRect(0, 0, cv.width, cv.height); x.drawImage(big, 420, 300, 760, 428, 0, 0, cv.width, cv.height); };

/* ---------- 세운 종이 기둥(위에 책을 올려요): 둥근·세모·네모·병풍 ---------- */
PaperBridge.column = function(cv, kind){ const x = cv.getContext('2d'), W = cv.width, H = cv.height; x.clearRect(0, 0, W, H); x.save(); x.scale(W / 300, H / 300);
  let g = x.createLinearGradient(0, 0, 0, 300); g.addColorStop(0, '#f6f0e6'); g.addColorStop(1, '#e9dfcf'); x.fillStyle = g; x.fillRect(0, 0, 300, 300); x.fillStyle = '#d6b080'; x.fillRect(0, 250, 300, 50);
  const cx = 150, top = 70, bot = 250, w = 90;
  const face = (pts, col) => { x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fillStyle = col; x.fill(); x.strokeStyle = '#b9b9c6'; x.lineWidth = 1.5; x.stroke(); };
  if(kind === 'round'){ g = x.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0); g.addColorStop(0, '#dcdce4'); g.addColorStop(.4, '#ffffff'); g.addColorStop(1, '#cfcfd8');
    x.fillStyle = g; x.beginPath(); x.ellipse(cx, bot, w / 2, 14, 0, 0, Math.PI); x.lineTo(cx - w / 2, top); x.ellipse(cx, top, w / 2, 14, 0, Math.PI, 0, true); x.closePath(); x.fill(); x.strokeStyle = '#b9b9c6'; x.stroke();
    x.fillStyle = '#9a9aa6'; x.beginPath(); x.ellipse(cx, top, w / 2, 14, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = '#f1f1f6'; x.beginPath(); x.ellipse(cx, top, w / 2 - 3, 11, 0, 0, Math.PI * 2); x.fill(); }
  if(kind === 'tri'){ face([[cx - 50, bot], [cx + 10, bot + 14], [cx + 10, top + 14], [cx - 50, top]], '#f6f6f9'); face([[cx + 10, bot + 14], [cx + 50, bot - 6], [cx + 50, top - 6], [cx + 10, top + 14]], '#dcdce4');
    face([[cx - 50, top], [cx + 10, top + 14], [cx + 50, top - 6]], '#c9c9d4'); }
  if(kind === 'square'){ face([[cx - 50, bot - 4], [cx, bot + 12], [cx, top + 12], [cx - 50, top - 4]], '#f6f6f9'); face([[cx, bot + 12], [cx + 50, bot - 4], [cx + 50, top - 4], [cx, top + 12]], '#dcdce4');
    face([[cx - 50, top - 4], [cx, top + 12], [cx + 50, top - 4], [cx, top - 20]], '#c9c9d4'); }
  if(kind === 'zig'){ for(let i = 0; i < 8; i++){ const x0 = cx - 60 + i * 15, x1 = x0 + 15, y0 = i % 2 ? 8 : 0, y1 = i % 2 ? 0 : 8; face([[x0, bot + y0], [x1, bot + y1], [x1, top + y1], [x0, top + y0]], i % 2 ? '#dcdce4' : '#f6f6f9'); } }
  if(kind === 'mix' || kind === 'new'){ x.restore(); const t = document.createElement('canvas'); t.width = t.height = 300;
    if(kind === 'mix'){ PaperBridge.column(t, 'round'); x.drawImage(t, 0, 0, W, H); x.save(); x.scale(W / 300, H / 300); x.fillStyle = 'rgba(246,240,230,.0)'; x.restore(); PaperBridge.column(t, 'tri'); x.save(); x.globalAlpha = 1; x.drawImage(t, 60, 40, 240, 260, W * .45, H * .2, W * .55, H * .8); x.restore(); return; }
    x.save(); x.scale(W / 300, H / 300); g = x.createLinearGradient(0, 0, 0, 300); g.addColorStop(0, '#f6f0e6'); g.addColorStop(1, '#e9dfcf'); x.fillStyle = g; x.fillRect(0, 0, 300, 300);
    x.fillStyle = '#127d74'; x.font = '700 160px Jua, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('?', 150, 160); }
  x.restore(); };

window.PaperBridge = PaperBridge;
})();
