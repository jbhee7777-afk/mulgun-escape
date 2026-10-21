/* 21~24차시 놀잇감 그림 (SVG 문자열 + 캔버스) */
const TOY = (() => {
  const wheelSVG = (cx, cy, r, sq, col = '#e05a4f') => sq
    ? `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" rx="${r * .18}" fill="${col}" stroke="#9e2f26" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="${r * .22}" fill="#5b3a1e"/>`
    : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}" stroke="#9e2f26" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="${r * .7}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-dasharray="6 6"/><circle cx="${cx}" cy="${cy}" r="${r * .22}" fill="#5b3a1e"/>`;
  /* 옆에서 본 상자 자동차 */
  function car(o = {}){ const s = o.s || 1, x = o.x || 300, y = o.y || 130, W = 300 * s, H = 100 * s, r = 36 * s;
    const gy = y + H / 2 + r * 2.15;          /* 땅 높이 */
    const wy = gy - r, bx = x - W / 2, by = y - H / 2;
    const xs = [bx + W * .2, bx + W * .8];
    let wy2 = [wy, wy], rot = 0;
    if(o.tilt){ wy2 = [wy, wy - 26 * s]; rot = -Math.atan2(0, 1); }
    let body = `<rect x="${bx}" y="${by}" width="${W}" height="${H}" rx="${12 * s}" fill="#d9a86c" stroke="#a77b4a" stroke-width="4"/>
      <line x1="${bx + 10 * s}" y1="${by + H * .32}" x2="${bx + W - 10 * s}" y2="${by + H * .32}" stroke="#c4925a" stroke-width="3" stroke-dasharray="10 8"/>
      <rect x="${bx + W * .62}" y="${by + 14 * s}" width="${W * .26}" height="${H * .42}" rx="${8 * s}" fill="#cfe7f7" stroke="#8fb8d8" stroke-width="3"/>`;
    let under = '', wheels = '', extra = '';
    xs.forEach((cx, k) => { const cy = (o.tilt ? wy2[k] : wy) + (o.rub ? -r * .55 : 0);
      /* 빨대(축받이): 몸통 바로 아래 붙은 고리 */
      const sy = by + H + 6 * s;
      under += `<rect x="${cx - 16 * s}" y="${by + H - 4 * s}" width="${32 * s}" height="${16 * s}" rx="${6 * s}" fill="#ffb3c9" stroke="#e0789a" stroke-width="3"/>`;
      if(o.tape){ for(let t = 0; t < (o.tape === 2 ? 4 : 1); t++) under += `<rect x="${cx - (o.tape === 2 ? 26 : 10) * s + t * 13 * s}" y="${by + H - 12 * s}" width="${8 * s}" height="${30 * s}" rx="2" fill="#fff" fill-opacity=".75" stroke="#9ab" stroke-width="2"/>`; }
      /* 축(꼬치): 빨대에서 바퀴 가운데까지 */
      under += `<line x1="${cx}" y1="${sy}" x2="${cx}" y2="${cy}" stroke="#b07a3a" stroke-width="${6 * s}" stroke-linecap="round"/>`;
      wheels += wheelSVG(cx, cy, r, o.wheel === 'square', k ? '#3d6fd0' : '#e05a4f').replace(/#9e2f26/g, k ? '#2a4f9a' : '#9e2f26');
      if(o.taped) extra += `<rect x="${cx - 8 * s}" y="${by + H - 10 * s}" width="${16 * s}" height="${H * .2 + r * 1.2}" rx="3" fill="#fff" fill-opacity=".8" stroke="#9ab" stroke-width="2" transform="rotate(${k ? 18 : -18} ${cx} ${cy})"/>`;
      if(o.rub) extra += `<path d="M${cx + r * .7} ${by + H - 6 * s} l${12 * s} -${10 * s} M${cx + r * .9} ${by + H + 4 * s} l${16 * s} -${4 * s}" stroke="#e03131" stroke-width="4" stroke-linecap="round"/>`;
    });
    let ground = `<line x1="${x - W * .75}" y1="${gy}" x2="${x + W * .75}" y2="${gy}" stroke="#b48a55" stroke-width="6" stroke-linecap="round"/>`;
    if(o.tilt) extra += `<path d="M${xs[1] - 10} ${gy - 4} l0 -${18 * s}" stroke="#e03131" stroke-width="3" stroke-dasharray="4 4"/><text x="${xs[1] + r + 6}" y="${gy - 8}" font-size="${20 * s}" fill="#e03131" font-family="Jua">떠 있어요</text>`;
    let lab = '';
    if(o.label){ const L = (tx, ty, ax, ay, t) => `<line x1="${tx}" y1="${ty}" x2="${ax}" y2="${ay}" stroke="#2a4f9a" stroke-width="2.5" stroke-dasharray="5 4"/><rect x="${tx - 68}" y="${ty - 20}" width="136" height="34" rx="10" fill="#fff" stroke="#2a4f9a" stroke-width="2.5"/><text x="${tx}" y="${ty + 5}" font-size="20" fill="#2a4f9a" text-anchor="middle" font-family="Jua">${t}</text>`;
      lab = L(x - W * .62, by + 4, bx + 20, by + 20, '몸통(상자)') + L(x - W * .62, gy - 10, xs[0] - r, wy, '바퀴(병뚜껑)') + L(x + W * .66, by + H + 4, xs[1] + 16 * s, by + H + 4, '축받이(빨대)') + L(x + W * .66, gy - 6, xs[1] + 3, wy + 10, '축(꼬치)'); }
    return ground + under + body + wheels + extra + lab; }

  /* 고무줄 기타 (위에서 본 모습) */
  function guitar(o = {}){ const s = o.s || 1, x = o.x || 300, y = o.y || 115, W = 300 * s, H = 170 * s, bx = x - W / 2, by = y - H / 2;
    let g = `<rect x="${bx}" y="${by}" width="${W}" height="${H}" rx="${18 * s}" fill="#d9a86c" stroke="#a77b4a" stroke-width="4"/>
      <ellipse cx="${x}" cy="${y}" rx="${56 * s}" ry="${42 * s}" fill="#5b3a1e"/>
      <rect x="${bx + 26 * s}" y="${by + 10 * s}" width="${12 * s}" height="${H - 20 * s}" rx="4" fill="#fff3dc" stroke="#c9a77a"/>
      <rect x="${bx + W - 38 * s}" y="${by + 10 * s}" width="${12 * s}" height="${H - 20 * s}" rx="4" fill="#fff3dc" stroke="#c9a77a"/>`;
    const n = o.sag != null ? 1 : 3;
    for(let i = 0; i < n; i++){ const yy = n === 1 ? y : by + H * (.3 + i * .2), sag = (o.sag || 0) * s;
      g += `<path d="M${bx + 32 * s} ${yy} Q${x} ${yy + sag * 2} ${bx + W - 32 * s} ${yy}" fill="none" stroke="${['#e8a33c', '#e06a5a', '#3d6fd0'][n === 1 ? (o.sag ? 0 : 2) : i]}" stroke-width="${6 * s}" stroke-linecap="round"/>`; }
    return g; }

  /* 흔드는 통 (속이 보이게) */
  function shaker(o = {}){ const s = o.s || 1, x = o.x || 300, y = o.y || 115, W = 120 * s, H = 170 * s, bx = x - W / 2, by = y - H / 2;
    let g = `<path d="M${bx} ${by} L${bx + W} ${by} L${bx + W - 14 * s} ${by + H} L${bx + 14 * s} ${by + H} Z" fill="#eaf4ff" fill-opacity=".9" stroke="#8fb8d8" stroke-width="4"/>
      <rect x="${bx - 6 * s}" y="${by - 14 * s}" width="${W + 12 * s}" height="${18 * s}" rx="6" fill="#3d6fd0"/>`;
    const fill = o.fill || 'cap';
    if(fill === 'cap' || fill === 'full'){ const pts = fill === 'full' ? 22 : 5; for(let i = 0; i < pts; i++){ const row = Math.floor(i / 4), col = i % 4;
      const cx = bx + 24 * s + col * 24 * s + (row % 2) * 10 * s, cy = by + H - 20 * s - row * 22 * s; if(cy < by + 8 * s) break;
      g += `<circle cx="${cx}" cy="${cy}" r="${10 * s}" fill="${['#e05a4f', '#ffc53d', '#4fd1ae', '#8fb8ff'][i % 4]}" stroke="#555" stroke-width="1.5"/>`; } }
    if(fill === 'cotton'){ for(let i = 0; i < 4; i++){ const cx = bx + 28 * s + (i % 2) * 52 * s, cy = by + H - 26 * s - Math.floor(i / 2) * 34 * s;
      g += `<g fill="#fff" stroke="#ccd" stroke-width="1.5"><circle cx="${cx}" cy="${cy}" r="${16 * s}"/><circle cx="${cx + 14 * s}" cy="${cy - 6 * s}" r="${13 * s}"/><circle cx="${cx - 10 * s}" cy="${cy - 8 * s}" r="${11 * s}"/></g>`; } }
    return g; }

  /* 캔버스용 자동차 (굴러가기 실험) — 원점: 비탈 위 지점, 땅은 y=40 */
  function drawCar(g, rot, free){ const r = 34, wy = 40 - r, W = 230, H = 80, by = wy - r - 10 - H;
    g.fillStyle = '#ffb3c9'; g.strokeStyle = '#e0789a'; g.lineWidth = 3;
    [-W * .3, W * .3].forEach(dx => { g.beginPath(); g.roundRect(dx - 15, by + H - 6, 30, 16, 6); g.fill(); g.stroke(); g.strokeStyle = '#b07a3a'; g.lineWidth = 7; g.beginPath(); g.moveTo(dx, by + H + 4); g.lineTo(dx, wy); g.stroke(); g.strokeStyle = '#e0789a'; g.lineWidth = 3; });
    g.fillStyle = '#d9a86c'; g.strokeStyle = '#a77b4a'; g.lineWidth = 4; g.beginPath(); g.roundRect(-W / 2, by, W, H, 12); g.fill(); g.stroke();
    g.fillStyle = '#cfe7f7'; g.strokeStyle = '#8fb8d8'; g.beginPath(); g.roundRect(W * .1, by + 12, W * .28, H * .45, 8); g.fill(); g.stroke();
    [-W * .3, W * .3].forEach((dx, k) => { g.save(); g.translate(dx, wy); g.rotate(rot);
      g.fillStyle = k ? '#3d6fd0' : '#e05a4f'; g.strokeStyle = k ? '#2a4f9a' : '#9e2f26'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill(); g.stroke();
      g.strokeStyle = '#fff'; g.lineWidth = 6; g.beginPath(); g.moveTo(-r * .7, 0); g.lineTo(r * .7, 0); g.moveTo(0, -r * .7); g.lineTo(0, r * .7); g.stroke();
      g.fillStyle = '#5b3a1e'; g.beginPath(); g.arc(0, 0, 7, 0, Math.PI * 2); g.fill(); g.restore();
      if(!free){ g.save(); g.fillStyle = 'rgba(255,255,255,.85)'; g.strokeStyle = '#9ab'; g.lineWidth = 2; g.translate(dx, wy); g.rotate(k ? .35 : -.35); g.fillRect(-9, -r - 30, 18, r + 26); g.strokeRect(-9, -r - 30, 18, r + 26); g.restore(); } });
  }
  return {car, guitar, shaker, drawCar};
})();
