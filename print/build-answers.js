// 교사용 정답지 만들기: 각 차시 수업 화면의 문제 자료를 그대로 읽어 print/answers.html 과 materials/NN/교사용 정답지 PDF 를 만들어요.
// 문제를 고친 뒤 다시 돌리면 정답지도 함께 바뀌어요.  사용: node print/build-answers.js
const fs = require('fs'), path = require('path'), {pathToFileURL} = require('url');
const {chromium} = require(process.env.PW || 'C:/Users/USER/soomun-harbor/node_modules/playwright-core');
const ROOT = path.resolve(__dirname, '..');
const NN = n => String(n).padStart(2, '0');
const V = {1:['OBJS', 'CARDS'], 2:['DETECT', 'PAIRS'], 3:['OBJ', 'FAMS', 'COURT', 'CHOOSE'], 4:['OBJ', 'MIME', 'CMP', 'LINE'], 5:['OBJ', 'ZOOM', 'BOARDS'], 6:['OBJ', 'ERASE', 'STATIONS', 'DESIGN'],
  7:['MAT', 'OBJ', 'TESTS', 'ITEMS', 'LMAT', 'UMAT'], 8:['SHAPE', 'SECRET', 'LIFE'], 9:['ROBOT', 'PUZ'], 10:['BA', 'OX', 'IVQ', 'IV'], 11:['BINS', 'CLUES'], 12:['MAG', 'GQ', 'FO'], 13:['WAYS'], 14:[],
  15:['EXP', 'TRY', 'HARD'], 16:['KIND', 'SC'], 17:['SPOT', 'GL'], 18:['PRESET'], 19:['OPS'], 20:['MAT', 'NEED'], 21:['CQ'], 22:['OX', 'GUIDE'], 23:['FIX'], 24:[]};
const EMO = /(?:\p{Extended_Pictographic}|[\u2B50\u2B55])\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*\s*/gu;
const noEmo = s => String(s).replace(EMO, '').trim();
const br = s => String(s).replace(/<br\s*\/?>/g, ' ');
const T = (title, head, rows, opt = {}) => ({title, head, rows, ...opt});
const L = (title, items) => ({title, items}); // 번호 없는 짧은 목록

/* 차시마다 '문제 → 정답' 표로 바꿔요 */
const B = {
  1: d => [L('미션 1 · 사라진 물건을 찾아라', [`1라운드: <b>${d.OBJS.filter(o => o.r === 1).map(o => o.name).join(', ')}</b>`, `2라운드: <b>${d.OBJS.filter(o => o.r === 2).map(o => o.name).join(', ')}</b>`]),
    T('미션 2 · 만약 ○○이 없다면? (카드 번호는 뽑을 때마다 같아요)', ['번호', '사라진 물건', '표현할 모습'], d.CARDS.map((c, i) => [i + 1, `<b>${c[1]}</b>`, c[2]]))],
  2: d => [T('미션 2 · 이유 탐정 추리 게임', ['번호', '정답', '태어난 이유'], d.DETECT.map((q, i) => [i + 1, `<b>${q.name}</b>`, q.r])),
    T('미션 3 · 이유 짝꿍 찾기', ['물건', '짝이 되는 불편함'], d.PAIRS.map(p => [`<b>${p[1]}</b>`, p[2]]))],
  3: d => [T('미션 1 · 하는 일 가족 찾기', ['상자(하는 일)', '들어갈 물건'], d.FAMS.map(f => [`<b>${f.job}</b>`, f.items.map(k => d.OBJ[k].n).join(', ')])),
    T('미션 2 · 물건 재판정 (판결은 언제나 “둘 다 필요해요”)', ['사건', '판결'], d.COURT.map(c => [`${d.OBJ[c.a].n} vs ${d.OBJ[c.b].n}`, c.v])),
    T('미션 3 · 모퉁이로 이동!', ['번호', '상황', '1번', '2번', '3번', '정답', '까닭'], d.CHOOSE.map((c, i) => [i + 1, c.t, ...c.o.map(k => d.OBJ[k].n), `<b>${c.a + 1}번 ${d.OBJ[c.o[c.a]].n}</b>`, c.r]), {small:1, note:'까닭이 그럴듯하면 다른 모퉁이도 인정해 주세요.'})],
  4: d => [T(`미션 1 · 옛날 물건 몸짓 퀴즈 (카드 ${d.MIME.length}장, 순서는 섞여서 나와요)`, ['물건', '몸짓 힌트'], d.MIME.map(m => [`<b>${d.OBJ[m[0]].n}</b>`, m[1]]), {two:1}),
    T('미션 2 · 변신 돋보기', ['옛날 → 오늘날', '하는 일', '생김새', '쓰는 방법', '왜 바뀌었을까?'], d.CMP.map(c => [`<b>${d.OBJ[c.a].n} → ${d.OBJ[c.b].n}</b>`, c.same, `${c.d[0][0]} → ${c.d[0][1]}`, `${c.d[1][0]} → ${c.d[1][1]}`, noEmo(c.w)]), {small:1}),
    T('미션 3 · 사람 줄서기 (왼쪽이 가장 옛날)', ['번호', '하는 일', '정답 순서', '어떻게 바뀌었나'], d.LINE.map((l, i) => [i + 1, l.job, `<b>${l.seq.map(k => d.OBJ[k].n).join(' → ')}</b>`, l.p]), {small:1})],
  5: d => [T('미션 1 · 확대 사진 퀴즈', ['번호', '정답', '어디를 보고 알 수 있나요'], d.ZOOM.map((z, i) => [i + 1, `<b>${d.OBJ[z.k].n}</b>`, z.f])),
    L('미션 3 · 교실 관찰 빙고 (정답은 교실마다 달라요. 그 칸의 특징이 있는 물건이면 모두 정답)', [d.BOARDS[0].map(b => b[1]).join(' · ')])],
  6: d => [T('미션 1 · 만약 이 부분이 없다면?', ['번호', '물건', '빨간 동그라미(이름)', '하는 일', '없으면'], d.ERASE.map((e, i) => [i + 1, d.OBJ[e.k].n, `<b>${e.f}</b>`, e.w, e.x]), {small:1}),
    T('미션 2 · 생김새 실험 스테이션', ['실험대', '알게 되는 것'], d.STATIONS.map(s => [`<b>${s.n}</b>`, s.a])),
    T('미션 3 · 물건 디자이너 (정답은 하나가 아니에요. 화면 예시)', ['번호', '불편한 일', '아이디어 예시', '핵심'], d.DESIGN.map((q, i) => [i + 1, q.p, q.ideas.map(x => noEmo(x[1])).join(', '), q.pt]), {small:1})],
  7: d => [T('미션 1 · 재료 실험 예상 결과 (○ 그래요 △ 조금 × 아니에요. 재료에 따라 다를 수 있어요)', ['실험', ...d.LMAT.map(m => d.MAT[m])], d.TESTS.map(t => [noEmo(t[1]), ...t[2].map(v => ({o:'○', t:'△', x:'×'})[v])])),
    T('미션 2 · 신기한 물건 가게 (열린 답이에요. 화면 예시)', ['번호', '물건', '좋은 점', '걱정되는 점', '이렇게 하면?'], d.ITEMS.map((t, i) => [i + 1, `<b>${d.MAT[t.m]} ${d.OBJ[t.o][0]}</b>${t.real ? ' (실제로 있음)' : ''}`, t.g, t.w, t.i]), {small:1}),
    L('미션 3 · 꼬마 우산 실험', ['보송보송했던 재료는 물이 스며들지 않는 <b>비닐과 포일</b>이에요. 종이·천도 기름을 먹이거나 코팅하면 비를 막을 수 있어요.'])],
  8: d => [L('미션 2 · 접기 실험', ['모둠마다 동전 수는 달라요. 대체로 <b>병풍 접기 → ㄷ자 홈통·⊓자 다리 → 평평하게</b> 순서로 많이 버텨요.']),
    T('종이가 튼튼해진 비밀', ['질문', '답'], d.SECRET.map(s => [`<b>${s[1]}</b>`, s[2]])),
    T('우리 주변의 튼튼한 종이', ['물건', '튼튼한 까닭'], d.LIFE.map(s => [`<b>${s[1]}</b>`, s[2]]))],
  9: d => [T('미션 1 · 로봇 선생님', ['번호', '할 일', '순서 (한 번에 한 가지씩)'], d.ROBOT.map((r, i) => [i + 1, `<b>${r.n}</b>`, r.s.map((s, k) => `${k + 1}. ${s}`).join(' ')]), {small:1}),
    T('미션 2 · 순서 퍼즐 릴레이', ['번호', '물건', '정답 순서'], d.PUZ.map((r, i) => [i + 1, `<b>${r.n}</b>`, r.s.map((s, k) => `${k + 1}. ${s}`).join(' ')]), {small:1})],
  10: d => [T('미션 1 · 전과 후 비교', ['번호', '전 → 후', '불편했던 점', '좋아진 점'], d.BA.map((b, i) => [i + 1, `<b>${b.a.n} → ${b.b.n}</b>`, b.u, b.g])),
    T('미션 2 · 불편함 OX 퀴즈', ['번호', '문제', '정답', '까닭'], d.OX.map((o, i) => [i + 1, o.q, `<b>${o.a}</b>`, o.w]), {small:1}),
    T('미션 3 · 발명가 인터뷰 (답 예시)', ['발명품', ...d.IVQ], d.IV.map(v => [`<b>${v.n}</b>`, ...v.a]), {small:1})],
  11: d => [T('미션 2 · 단서 분류 본부', ['번호', '단서', '정답 상자'], d.CLUES.map((c, i) => [i + 1, c[1], `<b>${d.BINS[c[2]][1]}</b>`]), {note:'까닭을 말하면 다른 상자도 인정해 주세요.'})],
  12: d => [T('미션 1 · 어떤 마법일까?', ['번호', '물건', '정답', '까닭'], d.GQ.map((g, i) => [i + 1, g.n, `<b>${d.MAG[g.m][1]}</b>`, g.w])),
    T('미션 2 · 마법 공장 도움 생각 (정답은 없어요. 막힐 때 예시)', ['물건', '더하기', '빼기', '바꾸기'], d.FO.map(f => [`<b>${f.n}</b>`, f.h.add, f.h.sub, f.h.chg]), {small:1})],
  13: d => [T('미션 1 · 지우개를 지키는 방법 6가지', ['번호', '방법', '마법', '재료', '만드는 법'], d.WAYS.map((w, i) => [i + 1, `<b>${w[1]}</b>`, noEmo(w[2]).replace(/^[＋－↻]\s*/, ''), w[3], w[4]]), {small:1}),
    L('미션 2·3 · 지우개 시험대와 투표', ['정답이 없어요. 별점 1등과 투표 1등이 다를 수 있고, 그 까닭을 이야기해 보는 것이 중요해요.'])],
  14: () => [L('미션 1 · 설계도 예시 (책가방 → 바퀴 정리 가방)', ['불편함: 책을 다 넣으면 너무 무겁고, 연필이 가방 속에서 굴러다녀요.', '마법: 바퀴 <b>더하기</b>, 칸막이 <b>더하기</b>, 천을 가볍게 <b>바꾸기</b>', '좋아진 점: 끌고 다녀서 어깨가 안 아프고, 물건을 칸마다 넣어요.']),
    L('미션 2·3 · 설계도 그리기와 전시회', ['정답이 없어요. 그림 실력보다 <b>바뀐 부분의 화살표 설명(2개 이상)</b>을 봐 주세요.', '칭찬 말 예시: “○○ 마법이 좋아요!” “화살표 설명이 알기 쉬워요!” “나도 이 물건을 쓰고 싶어요!”'])],
  15: d => [T('미션 1 · 다른 사람 되어 보기', ['체험', '과제', '어려운 까닭', '이런 사람이 어려워요', '이렇게 하면?'], d.TRY.map(t => [noEmo(d.EXP[t.e][1]), t.t, t.a, t.w, t.h]), {small:1}),
    T('미션 2 · 누가 어려울까? (숨은 카드. 다른 답도 까닭이 맞으면 정답)', ['물건', '어려운 사람과 까닭'], d.HARD.map(h => [`<b>${h.n}</b>`, h.c.map(c => `<b>${c[1]}</b>: ${c[2]}`).join(' ')]), {small:1})],
  16: d => [T('미션 1 · 친절한 짝 찾기', ['번호', '어려운 것', '정답(친절한 물건)', '친절한 까닭'], d.KIND.map((k, i) => [i + 1, k.a.n, `<b>${k.b.n}</b>`, k.s])),
    T('미션 2 · 생각 저울 (열린 답이에요. 화면 예시)', ['물건', '좋은 사람', '걱정되는 점', '이렇게 하면?'], d.SC.map(s => [`<b>${s.n}</b>`, s.g.join(', '), s.w.join(' '), s.i.join(' ')]), {small:1})],
  17: d => [T('미션 1 · 숨은 불편함 찾기 (그림 속 7곳)', ['번호', '찾을 곳', '누구에게', '까닭'], d.SPOT.map((s, i) => [i + 1, `<b>${s.t}</b>`, whoOf(s.g, d.GL), s.w])),
    L('미션 2·3 · 관찰 안경 탐험대, 불편함 지도', ['우리 교실마다 답이 달라요. “○○ 안경으로 보니 □□가 불편해요. 왜냐하면 △△ 때문이에요.”로 말하면 돼요.'])],
  18: d => [T('미션 1 · 브레인 릴레이 문제 (답은 여러 가지예요)', ['문제', '누구에게 어떤 불편함'], d.PRESET.map(p => [`<b>${p[1]}</b>`, p[2]])),
    T('해결 방법 예시', ['방법', '불편함', '해결'], [['새 물건 만들기', '통로에 가방이 있어요', '책상 옆 가방 고리를 달아요.'], ['새 물건 만들기', '문턱에 바퀴가 걸려요', '문턱 앞에 작은 경사판을 놓아요.'], ['자리 바꾸기', '밴드가 높은 곳에 있어요', '밴드를 낮은 칸으로 옮겨요.'], ['자리 바꾸기', '게시판이 너무 높아요', '작품을 눈높이 줄에 집게로 걸어요.'], ['표시 붙이기', '정수기의 뜨거운 물이 헷갈려요', '빨간 불꽃 그림 스티커를 붙여요.'], ['표시 붙이기', '분리수거 통이 헷갈려요', '통마다 물건 그림을 붙여요.']])],
  19: d => [T('미션 1·2 · 바꾸기 작전 (시험 방법과 바꾸는 순서)', ['작전', '누구를 위해', '시험', '바꾸는 방법'], d.OPS.map(o => [`<b>${o.n}</b>`, o.who, o.t, o.d.map((s, k) => `${k + 1}. ${s}`).join(' ')]), {small:1}),
    L('미션 3 · 비교 발표', ['결과는 모둠마다 달라요. 나빠져도 괜찮아요. “그래도 아쉬운 점”까지 말하게 해 주세요.'])],
  20: d => [T('미션 1 · 재료 탐정', ['재료', '특징', '이렇게 쓸 수 있어요'], d.MAT.map(m => [`<b>${m.n}</b>`, m.s.join(' '), m.b]), {small:1}),
    T('미션 2 · 어떤 재료가 좋을까? (까닭이 맞으면 다른 재료도 정답)', ['번호', '필요한 부분', '좋은 재료와 까닭'], d.NEED.map((q, i) => [i + 1, q.q, q.c.map(c => `<b>${c[1]}</b>: ${c[2]}`).join(' ')]), {small:1}),
    L('미션 3 · 휴지심 변신 놀이 예시', ['망원경, 마이크, 팔찌, 확성기, 기린 목, 로켓, 애벌레 몸, 나팔, 꽃 도장, 바퀴'])],
  21: d => [L('미션 1 · 비밀 실험실', ['굴러가기: <b>1번(축이 빨대 속에서 돌아요)</b>이 더 잘 굴러가요.', '고무줄 기타: <b>팽팽할수록</b> 빨리 떨려 높은 소리가 나요.', '흔드는 통: <b>병뚜껑</b>을 넣은 통이 가장 크고 또렷한 소리가 나요.']),
    T('미션 2 · 어느 쪽이 더 잘 될까?', ['번호', '문제', 'A', 'B', '정답', '까닭'], d.CQ.map((q, i) => [i + 1, q.q, q.an, q.bn, `<b>${q.ans}</b>`, q.w]), {small:1})],
  22: d => [T('미션 1 · 안전 약속 OX', ['번호', '문제', '정답', '까닭'], d.OX.map((o, i) => [i + 1, o.q, `<b>${o.a}</b>`, o.w])),
    T('미션 2 · 만들기 순서', ['놀잇감', '재료', '순서'], d.GUIDE.map(g => [`<b>${g.n}</b>`, g.mat.map(m => m[1]).join(', '), g.st.map((s, k) => `${k + 1}. ${s[0]}`).join(' ')]), {small:1})],
  23: d => [T('미션 1 · 고장 탐정', ['번호', '문제', '진짜 까닭', '까닭이 아닌 것', '고치는 법'], d.FIX.map((f, i) => [i + 1, f.q, `<b>${f.c.filter((_, k) => f.ok.includes(k)).join(', ')}</b>`, f.c.filter((_, k) => !f.ok.includes(k)).join(', '), f.h]), {small:1}),
    L('미션 2·3 · 다시 도전 고리', ['정답이 없어요. <b>시험 → 까닭 찾기 → 한 가지만 고치기 → 다시 시험</b> 순서를 지키는지 봐 주세요.'])],
  24: () => [L('미션 1 · 세모와 네모, 밀어 보면?', ['<b>네모</b>는 꼭짓점이 돌면서 찌그러져요. <b>세모</b>는 세 변의 길이가 그대로면 모양이 바뀌지 않아 단단히 버텨요.', '세모가 숨은 물건: 철교, 송전탑, 자전거 몸통, 골판지']),
    L('미션 2·3 · 종이 다리 챌린지', ['규칙: 책 사이 <b>20cm</b>, 종이 5장과 테이프만, 다리를 책에 붙이거나 바닥에 기둥을 세우면 안 돼요.', '튼튼하게 하는 방법: 더 접기, 겹치기, 말기, 세모 더하기, 끝을 길게', '기록은 모둠마다 달라요. 1차와 같은 공책을 같은 자리에 올려 비교해요.'])]
};
const whoOf = (g, GL) => GL.filter(x => g.includes(x[0])).map(x => x[1]).join(', ');

const ROOMS = [[1, 4, '#c98a00'], [5, 9, '#137f76'], [10, 14, '#d9603f'], [15, 19, '#c2457f'], [20, 24, '#3d6fd0']];
const roomOf = n => ROOMS.findIndex(r => n >= r[0] && n <= r[1]);
const cell = c => `<td>${br(c)}</td>`;
function secHTML(s){
  if(s.items) return `<h3>${s.title}</h3><ul>${s.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  const cls = [s.small ? 'sm' : '', s.two ? 'two' : ''].join(' ');
  if(s.two){ const h = Math.ceil(s.rows.length / 2), tb = r => `<table class="sm"><thead><tr>${s.head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${r.map(x => `<tr>${x.map(cell).join('')}</tr>`).join('')}</tbody></table>`;
    return `<h3>${s.title}</h3><div class="cols">${tb(s.rows.slice(0, h))}${tb(s.rows.slice(h))}</div>`; }
  return `<h3>${s.title}</h3><table class="${cls}"><thead><tr>${s.head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${s.rows.map(r => `<tr>${r.map(cell).join('')}</tr>`).join('')}</tbody></table>${s.note ? `<p class="note">${s.note}</p>` : ''}`;
}
(async () => {
  const b = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const out = [];
  for(let n = 1; n <= 24; n++){ const p = await b.newPage(); await p.goto(pathToFileURL(path.join(ROOT, 'lessons', NN(n), 'index.html')).href); await p.waitForTimeout(350);
    const d = {}; for(const k of V[n]) d[k] = await p.evaluate(k => JSON.parse(JSON.stringify(eval(k), (a, v) => typeof v === 'function' ? undefined : v)), k);
    const info = await p.evaluate(() => { const sl = [...document.querySelectorAll('.slide')].filter(s => /SECRET/.test(s.querySelector('.kicker')?.textContent || '')).pop(), c = sl.querySelector('.cipher').cloneNode(true);
      c.querySelectorAll('.blank').forEach(x => { const u = document.createElement('u'); u.textContent = x.textContent; x.replaceWith(u); });
      const t = [...document.querySelectorAll('.slide')].find(s => s.querySelector('h1,.title')); return {cipher:c.innerHTML.replace(/<br\s*\/?>/g, ' '), name:(document.title || '').trim(), chips:[...sl.querySelectorAll('.chip')].map(x => x.textContent)}; });
    await p.close();
    const name = (fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').match(new RegExp(`\\{n:${n},title:'([^']*)'`)) || [])[1] || '';
    const col = ROOMS[roomOf(n)][2];
    out.push(`<section class="sheet" id="c${n}" style="--c:${col}"><header><span class="no">${n}차시</span><b>${name}</b><em>교사용 정답지 · ${roomOf(n) + 1}번 방</em></header>
      ${B[n](d).map(secHTML).join('\n')}
      <h3>비밀 문장 (밑줄이 &lt;?&gt; 정답)</h3><p class="code">${info.cipher}</p></section>`); }
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>교사용 정답지</title>
<link rel="stylesheet" href="../lessons/fonts/jua.css"><link rel="stylesheet" href="../lessons/fonts/gowun-dodum.css">
<style>
@page{size:A4;margin:11mm 12mm}
*{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
body{font-family:'Gowun Dodum','Malgun Gothic',sans-serif;color:#222;background:#eee;font-size:10.5pt;line-height:1.42;word-break:keep-all}
#bar{position:sticky;top:0;z-index:5;background:#222;color:#fff;padding:8px 14px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-family:'Jua',sans-serif}
#bar select,#bar button{font:inherit;padding:5px 12px;border:0;background:#fff;color:#222;cursor:pointer}
#bar button{background:#ffd34d}
.sheet{background:#fff;width:186mm;margin:12px auto;padding:6mm}
header{display:flex;align-items:baseline;gap:3mm;border-bottom:1.2mm solid var(--c);padding-bottom:1.5mm;margin-bottom:2mm}
header .no{font-family:'Jua',sans-serif;font-size:21pt;color:var(--c)}
header b{font-family:'Jua',sans-serif;font-weight:400;font-size:15pt;flex:1}
header em{font-style:normal;font-size:9pt;color:#666}
h3{font-family:'Jua',sans-serif;font-weight:400;font-size:11.5pt;margin:3mm 0 1mm;color:var(--c);break-after:avoid}
table{width:100%;border-collapse:collapse;border-top:.5mm solid #222;border-bottom:.5mm solid #222}
th{font-family:'Jua',sans-serif;font-weight:400;text-align:left;background:#f1f1f1;padding:.8mm 1.5mm;border-bottom:.3mm solid #222;white-space:nowrap}
td{padding:.8mm 1.5mm;border-bottom:.15mm solid #bbb;vertical-align:top}
tr{break-inside:avoid}
td b{font-weight:700}
table.sm{font-size:9.2pt}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:3mm}
ul{list-style:none}li{padding:.4mm 0 .4mm 3mm;text-indent:-3mm}li::before{content:"· "}
.note{font-size:9pt;color:#555;margin-top:.8mm}
.code{border-left:1.2mm solid var(--c);padding:1mm 3mm;font-family:'Jua',sans-serif;font-size:11.5pt}
.code u{text-decoration-thickness:.5mm;color:var(--c)}
img.emi{height:1em!important}
@media print{body{background:#fff;font-size:10pt}#bar{display:none}.sheet{width:auto;margin:0;padding:0;break-after:page}.sheet:last-child{break-after:auto}}
</style></head><body>
<div id="bar">교사용 정답지 <select id="pick"><option value="0">1~24차시 전체</option>${Array.from({length:24}, (_, i) => `<option value="${i + 1}">${i + 1}차시</option>`).join('')}</select><button onclick="print()">이 정답지 인쇄</button></div>
${out.join('\n')}
<script>
const pick = document.getElementById('pick');
function show(){ const n = +(location.hash.replace('#', '')) || 0; pick.value = n; document.querySelectorAll('.sheet').forEach(s => { s.hidden = n && s.id !== 'c' + n; s.style.display = s.hidden ? 'none' : ''; }); scrollTo(0, 0); }
pick.onchange = () => { location.hash = pick.value === '0' ? '' : pick.value; show(); };
addEventListener('hashchange', show); show();
</script><script src="../lessons/shared/emoji.js"></script></body></html>`;
  const dest = path.join(ROOT, 'print', 'answers.html'); fs.writeFileSync(dest, html);
  const url = pathToFileURL(dest).href, pages = {};
  const pdf = async (hash, file) => { const p = await b.newPage(); await p.goto(url + hash); await p.reload(); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500); await p.emulateMedia({media:'print'});
    await p.pdf({path:file, preferCSSPageSize:true, printBackground:true}); await p.close(); return (fs.readFileSync(file, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length; };
  for(let n = 1; n <= 24; n++) pages[n] = await pdf('#' + n, path.join(ROOT, 'materials', NN(n), `교사용 정답지_${n}차시.pdf`));
  const all = await pdf('', path.join(ROOT, 'print', '교사용 정답지_1-24차시.pdf'));
  console.log('쪽수', JSON.stringify(pages), '전체', all); await b.close();
})();
