/* 21~23차시 만들기 과정 그림 (SVG, viewBox 0 0 600 340)
   BUILD.car[0..5], BUILD.guitar[0..4], BUILD.shaker[0..3] → 단계마다 만들어 가는 모습
   BUILD.front(spin) → 앞에서 본 자동차(축·축받이·바퀴 설명)
   BUILD.mat(이름) → 재료 그림(나무젓가락·굵은 빨대·병뚜껑·종이컵·테이프·상자·고무줄·연필) */
const BUILD = (() => {
  const OL = '#5b3a1e';
  const defs = `<defs>
    <pattern id="bStripe" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="16" height="16" fill="#fff"/><rect width="7" height="16" fill="#ff8fb0"/></pattern>
    <pattern id="bStripeH" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-55)"><rect width="16" height="16" fill="#fff"/><rect width="7" height="16" fill="#ff8fb0"/></pattern>
    <linearGradient id="bWood" x1="0" x2="1"><stop offset="0" stop-color="#f3dcae"/><stop offset=".5" stop-color="#e8c48a"/><stop offset="1" stop-color="#d9ad6c"/></linearGradient>
    <linearGradient id="bCap" x1="0" x2="1"><stop offset="0" stop-color="#ff7a6b"/><stop offset=".5" stop-color="#e5483a"/><stop offset="1" stop-color="#b8322a"/></linearGradient>
    <marker id="bAr" markerUnits="userSpaceOnUse" markerWidth="22" markerHeight="22" refX="11" refY="11" orient="auto"><path d="M1 3 L21 11 L1 19 z" fill="#2d6fd6"/></marker>
    <marker id="bArR" markerUnits="userSpaceOnUse" markerWidth="22" markerHeight="22" refX="11" refY="11" orient="auto"><path d="M1 3 L21 11 L1 19 z" fill="#e03131"/></marker>
  </defs>`;
  const W = s => `<svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" font-family="Jua,'Malgun Gothic',sans-serif">${defs}${s}</svg>`;
  const tag = (x, y, t, col = '#2a4f9a') => { const w = t.length * 19 + 26; return `<g><rect x="${x - w / 2}" y="${y - 19}" width="${w}" height="36" rx="12" fill="#fff" stroke="${col}" stroke-width="3"/><text x="${x}" y="${y + 7}" font-size="21" fill="${col}" text-anchor="middle">${t}</text></g>`; };
  const line = (x1, y1, x2, y2, col = '#2a4f9a', dash = '6 5') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="3" stroke-dasharray="${dash}"/>`;
  /* --- 재료 --- */
  const boxBottom = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#d9a86c" stroke="${OL}" stroke-width="4"/><line x1="${x + 8}" y1="${y + h / 2}" x2="${x + w - 8}" y2="${y + h / 2}" stroke="#b78445" stroke-width="3"/><rect x="${x + w * .3}" y="${y + h / 2 - 8}" width="${w * .4}" height="16" fill="#e8dcc8" opacity=".8"/>`;
  const strawV = (x, y, l, t = 22) => `<rect x="${x - t / 2}" y="${y}" width="${t}" height="${l}" rx="${t / 2}" fill="url(#bStripe)" stroke="#d65f86" stroke-width="3"/>`;
  const strawH = (x, y, l, t = 22) => `<rect x="${x}" y="${y - t / 2}" width="${l}" height="${t}" rx="${t / 2}" fill="url(#bStripeH)" stroke="#d65f86" stroke-width="3"/>`;
  const chopV = (x, y, l, w = 12) => `<path d="M${x - w / 2} ${y} L${x + w / 2} ${y} L${x + w * .35} ${y + l} L${x - w * .35} ${y + l} Z" fill="url(#bWood)" stroke="#9c6b2e" stroke-width="2.5"/><line x1="${x}" y1="${y + 6}" x2="${x}" y2="${y + l - 6}" stroke="#c99a5a" stroke-width="1.5"/>`;
  const chopH = (x, y, l, w = 12) => `<path d="M${x} ${y - w / 2} L${x + l} ${y - w * .35} L${x + l} ${y + w * .35} L${x} ${y + w / 2} Z" fill="url(#bWood)" stroke="#9c6b2e" stroke-width="2.5"/>`;
  const capEdge = (x, y, w = 70, h = 22) => { let r = `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="5" fill="url(#bCap)" stroke="#8f241d" stroke-width="3"/>`; for(let i = 1; i < 9; i++) r += `<line x1="${x - w / 2 + i * w / 9}" y1="${y - h / 2 + 3}" x2="${x - w / 2 + i * w / 9}" y2="${y + h / 2 - 3}" stroke="#9e2f26" stroke-width="1.5" opacity=".6"/>`; return r; };
  const capFace = (x, y, r = 34, hole = true) => { let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#bCap)" stroke="#8f241d" stroke-width="3.5"/><circle cx="${x}" cy="${y}" r="${r * .72}" fill="#f25a4a" stroke="#c03a2f" stroke-width="2"/>`; for(let i = 0; i < 18; i++){ const a = i / 18 * Math.PI * 2; s += `<line x1="${x + Math.cos(a) * r * .8}" y1="${y + Math.sin(a) * r * .8}" x2="${x + Math.cos(a) * r * .97}" y2="${y + Math.sin(a) * r * .97}" stroke="#9e2f26" stroke-width="2"/>`; } return s + (hole ? `<circle cx="${x}" cy="${y}" r="${r * .15}" fill="#5b3a1e"/>` : ''); };
  const tapeV = (x, y, w, h) => { const z = n => Array.from({length:n}, (_, i) => `${x + i * w / (n - 1)},${(i % 2 ? 4 : 0)}`); return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#e9f5ff" fill-opacity=".78" stroke="#8fb3cf" stroke-width="2"/><line x1="${x + 3}" y1="${y + 4}" x2="${x + 3}" y2="${y + h - 4}" stroke="#fff" stroke-width="3" opacity=".9"/>`; };
  const tapeH = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#e9f5ff" fill-opacity=".78" stroke="#8fb3cf" stroke-width="2"/><line x1="${x + 4}" y1="${y + 3}" x2="${x + w - 4}" y2="${y + 3}" stroke="#fff" stroke-width="3" opacity=".9"/>`;
  const cup = (x, y, s = 1, down = false) => { const tw = 92 * s, bw = 62 * s, h = 112 * s, rim = 9 * s; const t = down ? y + h : y, b = down ? y : y + h;
    return `<g><path d="M${x - tw / 2} ${t} L${x + tw / 2} ${t} L${x + bw / 2} ${b} L${x - bw / 2} ${b} Z" fill="#fffdf7" stroke="${OL}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M${x - tw / 2 + (tw - bw) / 2 * .38} ${t + (b - t) * .38} L${x + tw / 2 - (tw - bw) / 2 * .38} ${t + (b - t) * .38} L${x + tw / 2 - (tw - bw) / 2 * .62} ${t + (b - t) * .62} L${x - tw / 2 + (tw - bw) / 2 * .62} ${t + (b - t) * .62} Z" fill="#8fc1ff"/>
      <rect x="${x - tw / 2 - 3}" y="${t - rim / 2}" width="${tw + 6}" height="${rim}" rx="${rim / 2}" fill="#fffdf7" stroke="${OL}" stroke-width="3"/></g>`; };
  const pencilV = (x, y, l) => `<rect x="${x - 9}" y="${y + 18}" width="18" height="${l - 18}" fill="#ffd34d" stroke="${OL}" stroke-width="2.5"/><path d="M${x - 9} ${y + 18} L${x} ${y} L${x + 9} ${y + 18} Z" fill="#f6d3a8" stroke="${OL}" stroke-width="2.5"/><rect x="${x - 9}" y="${y + l - 14}" width="18" height="14" fill="#ff8fa3" stroke="${OL}" stroke-width="2.5"/>`;
  const band = (x1, x2, y, col, w = 6) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  const spin = (x, y, r = 26, col = '#2d6fd6') => `<path d="M${x - r} ${y} A${r} ${r * .45} 0 1 0 ${x + r * .2} ${y - r * .44}" fill="none" stroke="${col}" stroke-width="4" marker-end="url(#bAr)"/>`;
  const scissors = (x, y) => `<image href="../shared/icons/scissors.png" x="${x}" y="${y}" width="80" height="80"/>`;
  const tapeRoll = (x, y, s = 80) => `<image href="../shared/icons/tape.png" x="${x}" y="${y}" width="${s}" height="${s}"/>`;
  const ok = (x, y) => `<circle cx="${x}" cy="${y}" r="18" fill="#3bbf8f"/><path d="M${x - 9} ${y} l6 7 l12 -14" fill="none" stroke="#fff" stroke-width="4"/>`;
  const no = (x, y) => `<circle cx="${x}" cy="${y}" r="18" fill="#ef6a5a"/><path d="M${x - 8} ${y - 8} l16 16 M${x + 8} ${y - 8} l-16 16" stroke="#fff" stroke-width="4"/>`;

  /* --- 상자 자동차 (아래에서 본 모습: 상자를 뒤집었어요) --- */
  const BX = 150, BY = 100, BW = 300, BH = 150, A1 = 205, A2 = 395;
  const carBase = (st) => { let s = '';
    if(st >= 2){ /* 나무젓가락 (빨대보다 길게) */ s += chopV(A1, BY - 58, BH + 116) + chopV(A2, BY - 58, BH + 116); }
    s = boxBottom(BX, BY, BW, BH) + s;
    if(st >= 1){ s += strawV(A1, BY, BH) + strawV(A2, BY, BH); for(const a of [A1, A2]) for(const k of [.12, .5, .88]) s += tapeH(a - 26, BY + BH * k - 9, 52, 18); }
    if(st >= 2){ s += chopV(A1, BY - 58, 58) + chopV(A1, BY + BH, 58) + chopV(A2, BY - 58, 58) + chopV(A2, BY + BH, 58); }
    if(st >= 3){ for(const a of [A1, A2]){ s += capEdge(a, BY - 26) + capEdge(a, BY + BH + 26); } }
    if(st >= 4){ for(const a of [A1, A2]){ s += tapeH(a - 12, BY - 52, 24, 14) + tapeH(a - 12, BY + BH + 38, 24, 14); } }
    return s; };
  const car = [
    W(`<g transform="translate(40 40)"><rect x="0" y="40" width="200" height="150" rx="10" fill="#d9a86c" stroke="${OL}" stroke-width="4"/><line x1="0" y1="215" x2="200" y2="215" stroke="#2a4f9a" stroke-width="3" marker-start="url(#bAr)" marker-end="url(#bAr)"/><text x="100" y="250" font-size="24" fill="#2a4f9a" text-anchor="middle">상자 폭</text></g>
      ${strawH(300, 120, 260, 24)}${line(300, 90, 300, 150, '#e03131')}${line(500, 90, 500, 150, '#e03131')}${strawH(300, 235, 200, 24)}${scissors(505, 70)}
      <text x="400" y="290" font-size="24" fill="#e03131" text-anchor="middle">굵은 빨대를 상자 폭만큼 2개!</text>`),
    W(`${carBase(1)}${tag(300, 50, '상자를 뒤집어 바닥에 붙여요')}${tag(300, 300, '두 빨대가 나란하게!', '#e03131')}${line(A1, 275, A2, 275, '#e03131', '0')}${tapeRoll(490, 230, 90)}`),
    W(`${carBase(2)}${spin(A1, BY - 42)}${spin(A2, BY - 42)}${tag(520, 60, '나무젓가락')}${line(470, 70, A2 + 8, BY - 40)}${tag(300, 318, '젓가락이 빨대 속에서 빙글빙글 돌아요', '#2d6fd6')}`),
    W(`${carBase(3)}${tag(520, 40, '병뚜껑 바퀴')}${line(470, 52, A2 + 30, BY - 30)}<line x1="${A1 + 46}" y1="${BY - 15}" x2="${A1 + 46}" y2="${BY}" stroke="#e03131" stroke-width="3"/><text x="${A1 + 58}" y="${BY - 2}" font-size="19" fill="#e03131">틈</text>${tag(300, 318, '구멍은 선생님이! 상자와 손가락 한 마디 띄워요', '#e03131')}`),
    W(`${carBase(4)}${tag(510, 32, '젓가락 끝에 테이프')}${line(455, 40, A2 + 14, BY - 46)}${ok(90, 170)}<text x="90" y="215" font-size="18" fill="#22906a" text-anchor="middle">바퀴가</text><text x="90" y="236" font-size="18" fill="#22906a" text-anchor="middle">안 빠져요</text>${tag(300, 320, '바퀴를 상자에 붙이면 안 돌아요!', '#e03131')}`),
    W(`${TOY.car({x:300, y:110, s:1.1})}<path d="M80 150 h60 M60 180 h80 M90 210 h50" stroke="#8fb8ff" stroke-width="6" stroke-linecap="round"/><path d="M470 120 h70" stroke="#2d6fd6" stroke-width="6" marker-end="url(#bAr)"/>${tag(300, 318, '바퀴를 손으로 돌려 보고, 바닥에서 살짝 밀어요')}`)];

  /* --- 고무줄 기타 (위에서 본 모습) --- */
  const GX = 120, GY = 70, GW = 360, GH = 200;
  const gBase = st => { let s = `<rect x="${GX}" y="${GY}" width="${GW}" height="${GH}" rx="12" fill="#d9a86c" stroke="${OL}" stroke-width="4"/><rect x="${GX + 16}" y="${GY + 16}" width="${GW - 32}" height="${GH - 32}" rx="8" fill="#b98550"/>`;
    if(st >= 1) s += pencilV(GX + 40, GY + 6, GH - 12) + pencilV(GX + GW - 40, GY + 6, GH - 12) + tapeH(GX + 26, GY - 4, 28, 20) + tapeH(GX + 26, GY + GH - 16, 28, 20) + tapeH(GX + GW - 54, GY - 4, 28, 20) + tapeH(GX + GW - 54, GY + GH - 16, 28, 20);
    if(st >= 2){ const ys = [GY + 60, GY + 100, GY + 140], cs = ['#e8a33c', '#e06a5a', '#3d6fd0']; ys.forEach((y, i) => { s += band(GX - 8, GX + GW + 8, y, cs[i], i === 2 && st >= 3 ? 5 : 6); if(i === 2 && st >= 3) s += band(GX - 8, GX + GW + 8, y + 7, cs[i], 5); }); }
    return s; };
  const guitar = [
    W(`${gBase(0)}${tag(300, 40, '뚜껑 없는 상자')}${tag(300, 312, '뚜껑이 있으면 가운데 구멍 (선생님과 함께)')}`),
    W(`${gBase(1)}${tag(160, 312, '연필 다리')}${line(160, 294, GX + 40, GY + GH - 20)}${tapeRoll(500, 230, 80)}${tag(420, 312, '테이프로 붙여요')}`),
    W(`${gBase(2)}${tag(300, 36, '고무줄 3개를 상자 둘레에 걸어요')}${tag(300, 312, '연필 위로 지나가게!', '#e03131')}`),
    W(`${gBase(3)}<path d="M${GX + GW + 22} ${GY + 175} q30 -20 0 -40" fill="none" stroke="#e03131" stroke-width="4" marker-end="url(#bArR)"/>${tag(300, 36, '한 고무줄은 두 번 감아요')}${tag(300, 312, '팽팽할수록 높은 소리!', '#e03131')}`),
    W(`${gBase(3)}<image href="../shared/icons/pointup.png" x="270" y="${GY + 106}" width="70" height="70"/>${[0, 1, 2].map(i => `<path d="M${GX + GW + 30 + i * 18} ${GY + 70} q12 30 0 60" fill="none" stroke="#2d6fd6" stroke-width="4"/>`).join('')}${tag(300, 36, '하나씩 튕겨 소리를 들어요')}<text x="${GX + GW + 50}" y="${GY + 30}" font-size="20" fill="#e8a33c" text-anchor="middle">낮은 소리</text><text x="${GX + GW + 50}" y="${GY + 190}" font-size="20" fill="#3d6fd0" text-anchor="middle">높은 소리</text>`)];

  /* --- 마라카스 (종이컵 두 개) --- */
  const capsIn = (x, y) => [[-18, 0], [12, -4], [-4, -16], [22, -18], [-24, -20]].map(([dx, dy]) => `<ellipse cx="${x + dx}" cy="${y + dy}" rx="13" ry="6" fill="url(#bCap)" stroke="#8f241d" stroke-width="2"/>`).join('');
  const shaker = [
    W(`${cup(210, 110, 1.2)}${cup(390, 110, 1.2)}${tag(300, 40, '종이컵 2개를 준비해요')}`),
    W(`<g opacity=".95">${cup(300, 100, 1.4)}</g>${capsIn(300, 222)}<g transform="translate(400 40)"><ellipse cx="0" cy="0" rx="13" ry="6" fill="url(#bCap)" stroke="#8f241d" stroke-width="2"/><path d="M0 14 v40" stroke="#2d6fd6" stroke-width="4" marker-end="url(#bAr)"/></g>${tag(300, 312, '병뚜껑 3~5개 — 꽉 채우지 않아요!', '#e03131')}`),
    W(`${cup(300, 64, 1, true)}${cup(300, 176, 1)}${tapeH(248, 168, 104, 16)}<path d="M380 186 q30 0 22 -30" fill="none" stroke="#2d6fd6" stroke-width="4" marker-end="url(#bAr)"/>${tapeRoll(450, 210, 80)}${tag(300, 26, '컵을 입끼리 맞대요')}${tag(300, 318, '테이프를 빙 둘러 틈 없이!', '#e03131')}`),
    W(`<g transform="rotate(-14 300 176)">${cup(300, 64, 1, true)}${cup(300, 176, 1)}${tapeH(248, 168, 104, 16)}<circle cx="282" cy="120" r="10" fill="#ffc53d"/><circle cx="318" cy="250" r="9" fill="#4fd1ae"/><path d="M270 240 l10 -12 l10 12" fill="none" stroke="#ff8fb0" stroke-width="4"/></g><path d="M160 120 q-20 30 0 60 M130 105 q-28 45 0 90 M440 160 q20 30 0 60 M470 145 q28 45 0 90" fill="none" stroke="#8fb8ff" stroke-width="5" stroke-linecap="round"/>${tag(300, 318, '흔들어 소리를 듣고, 예쁘게 꾸며요')}`)];

  /* --- 앞에서 본 자동차: 축받이·축·바퀴 --- */
  function front(ang = 0){ const cx = 300, by = 70, bw = 240, bh = 120, ay = by + bh + 22, L = 380;
    const spokes = (x) => [0, 1, 2].map(i => { const a = ang + i * Math.PI / 3; return `<line x1="${x}" y1="${ay + Math.sin(a) * 26}" x2="${x}" y2="${ay - Math.sin(a) * 26}" stroke="#fff" stroke-width="3" opacity=".7"/>`; }).join('');
    const wheel = x => `<rect x="${x - 13}" y="${ay - 38}" width="26" height="76" rx="6" fill="url(#bCap)" stroke="#8f241d" stroke-width="3"/>${spokes(x)}`;
    return W(`<line x1="40" y1="${ay + 40}" x2="560" y2="${ay + 40}" stroke="#b48a55" stroke-width="6" stroke-linecap="round"/>
      <rect x="${cx - bw / 2}" y="${by}" width="${bw}" height="${bh}" rx="10" fill="#d9a86c" stroke="${OL}" stroke-width="4"/><text x="${cx}" y="${by + 70}" font-size="26" fill="#7a5530" text-anchor="middle">몸통 (상자)</text>
      ${chopH(cx - L / 2, ay, L)}${strawH(cx - bw / 2, ay, bw, 26)}${tapeV(cx - bw / 2 + 20, by + bh - 6, 22, 44)}${tapeV(cx + bw / 2 - 42, by + bh - 6, 22, 44)}
      ${wheel(cx - L / 2 + 24)}${wheel(cx + L / 2 - 24)}
      <path d="M${cx - L / 2 + 24} ${ay + 50} a16 7 0 1 0 14 -6" fill="none" stroke="#2d6fd6" stroke-width="4" marker-end="url(#bAr)"/><path d="M${cx + L / 2 - 24} ${ay + 50} a16 7 0 1 0 14 -6" fill="none" stroke="#2d6fd6" stroke-width="4" marker-end="url(#bAr)"/>`); }
  const mat = {
    chop:W(`${chopH(60, 150, 480, 22)}${chopH(60, 200, 480, 22)}`), straw:W(`${strawH(80, 170, 440, 40)}`), cap:W(`${capFace(220, 170, 70)}${capFace(400, 170, 70, false)}`),
    cup:W(`${cup(300, 90, 1.6)}`), tape:W(`<image href="../shared/icons/tape.png" x="200" y="70" width="200" height="200"/>`), box:W(`<image href="../shared/icons/box.png" x="190" y="60" width="220" height="220"/>`),
    band:W(`<ellipse cx="300" cy="170" rx="200" ry="70" fill="none" stroke="#e8a33c" stroke-width="12"/>`), pencil:W(`<g transform="rotate(90 300 170)">${pencilV(300, 20, 300)}</g>`)};
  mat.cap1 = W(capFace(300, 170, 140, false));
  return {car, guitar, shaker, front, mat};
})();
