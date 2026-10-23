/* 이모티콘 글자를 Canva 그림(icons/이름.png)이나 간단한 그림(SVG)으로 바꿔요.
   화면에 새로 생기는 글자(타자기, 문제 카드 등)도 저절로 바뀌어요. */
(function(){
  const BASE = document.currentScript.src.replace(/[^/]*$/, '') + 'icons/';
  const N = {
    '🔐':'lockkey','🚪':'door','🚨':'siren','🎯':'target','🔍':'search','🔎':'search','👀':'eyes','👁':'eyes','🃏':'cards','🎴':'cards',
    '🤫':'shush','⏱':'stopwatch','⏰':'stopwatch','⏳':'stopwatch','🎉':'party','☔':'umbrella','☂':'umbrella','🌂':'umbrella','💭':'thought',
    '💡':'bulb','📮':'mail','💌':'mail','🖨':'printer','🎤':'mic','🎙':'mic','🎲':'dice','🗝':'key','🔑':'key','🕵':'detective',
    '📗':'book','📘':'book','📖':'book','📚':'book','📔':'book','📒':'notepad','📝':'notepad','🗒':'notepad','😱':'surprised','😮':'surprised',
    '🏆':'trophy','👉':'pointright','👆':'pointup','☝':'pointup','🖍':'crayon','⭐':'star','🌟':'star','📺':'tv','🔇':'mute','🔊':'speaker','📣':'speaker',
    '😣':'troubled','😫':'troubled','😟':'troubled','😵':'troubled','🙍':'sadperson','😅':'sweat','✏':'pencil','✍':'pencil','🖊':'pencil',
    '🎬':'clapper','🔒':'lock','🔓':'unlock','🔀':'cycle','🔄':'cycle','🔁':'cycle','🎁':'gift','✂':'scissors','🧴':'lotion','🧺':'basket',
    '⚖':'scale','🧑‍⚖':'judge','🔨':'hammer','🧙':'wizard','🏃':'runner','🚶':'runner','🧳':'suitcase','💬':'speech','🗣':'speech',
    '🎨':'palette','📄':'paper','📰':'paper','🥛':'milk','👫':'friends','👥':'friends','💦':'water','💧':'water','✈':'airplane','⛰':'mountain',
    '🏕':'tent','🍜':'bowl','🍲':'bowl','🥣':'bowl','🏫':'school','🌅':'sunrise','🌳':'tree','🤝':'handshake','✋':'hand','🖐':'hand','🤚':'hand',
    '👍':'thumbsup','👎':'thumbsdown','🙆':'okpose','🙅':'xpose','🧍':'lineup','🙈':'seenoevil','🏙':'city','🚀':'rocket','🔭':'telescope',
    '👂':'ear','👃':'nose','🚫':'no','☀':'sun','🤔':'thinking','📏':'ruler','📐':'ruler','🪨':'rock','🪞':'mirror','🕳':'hole','🧽':'sponge',
    '✨':'sparkle','🔔':'bell','🧊':'ice','🦓':'zebra','🪶':'feather','🌵':'cactus','🪵':'wood','🔢':'numbers','🪄':'wand','🧪':'flask',
    '🔬':'microscope','🌈':'rainbow','☕':'mug','🪮':'comb','🧱':'brick','🥤':'papercup','🧋':'cup','🎗':'tape','🪝':'hook','🔗':'link','🎛':'knobs','🎚':'slider',
    '🧦':'sock','🍼':'babybottle','🫖':'teapot','🧃':'juicebox','🐙':'octopus','🚗':'car','🚙':'car','🔘':'bottlecap','🪟':'window','📎':'clip',
    '🧲':'magnet','🗂':'folder','🗄':'folder','🫧':'bubbles','🎾':'ball','🛞':'wheel','🧸':'teddy','🌀':'swirl','✊':'fist','🛡':'shield',
    '😀':'happy','😊':'happy','😄':'happy','😐':'neutral','🏪':'shop','🌍':'globe','🌏':'globe','🔦':'flashlight','🌧':'rain','🧤':'gloves',
    '🪑':'chair','🙋':'raisehand','🪙':'coin','🏠':'house','🏡':'house','🪀':'ball','🏛':'column','📸':'camera','📦':'box','🧻':'tissue','🥚':'egg','🔧':'wrench',
    '🛠':'toolbox','🤖':'robot','🧩':'puzzle','⚠':'warning','💥':'boom','🎭':'masks','📥':'tray','🧹':'broom','👟':'sneaker','🎀':'ribbon',
    '🌬':'wind','🗑':'trash','🧢':'cap','🦷':'tooth','🎰':'gacha','🧶':'yarn','🖼':'frame','🧑‍🦽':'wheelchair','👶':'baby','👵':'elder','👴':'elder',
    '🛍':'shopbag','🦯':'cane','🧼':'soap','🤲':'palms','📱':'phone','👤':'person','🛗':'elevator','🚌':'bus','📍':'pin','📌':'pin','👓':'glasses',
    '🗺':'map','🗳':'ballot','🏷':'tag','🚰':'tap','♻':'recycle','🔥':'fire','🗓':'calendar','📊':'chart','🙌':'cheer','💍':'ring','🦒':'giraffe',
    '🐛':'bug','🎺':'trumpet','🌸':'flower','🥁':'drum','🪇':'shaker','⛵':'boat','🎢':'coaster','🎸':'guitar','☁':'cloud','✌':'peace',
    '🥢':'chopsticks','🎵':'note','🌱':'sprout','🧒':'child','🩹':'bandaid','🦺':'vest','🎒':'backpack','🔺':'triangle','🌉':'bridge','⭕':'ocircle','❌':'xmark',
    '❓':'question','❔':'question','✅':'check','🧑':'child','👦':'child','👧':'child'
  };
  // 간단한 표시(재생·화살표·색 동그라미 등)는 그림 대신 깔끔한 SVG 로
  const sv = (b, vb = '0 0 24 24') => `<svg class="emi" viewBox="${vb}" aria-hidden="true">${b}</svg>`;
  const dot = c => sv(`<circle cx="12" cy="12" r="9" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/>`);
  const sq = c => sv(`<rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/>`);
  const ar = d => sv(`<path d="${d}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`);
  const SV = {
    '▶': sv('<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>'), '◀': sv('<path d="M17 4.5v15L5 12z" fill="currentColor"/>'),
    '⏸': sv('<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>'),
    '⏭': sv('<path d="M4 5v14l9-7zM12 5v14l8-7z" fill="currentColor"/>'), '⏮': sv('<path d="M20 5v14l-9-7zM12 5v14l-8-7z" fill="currentColor"/>'),
    '✔': ar('M4.5 12.5l5 5 10-11'), '↔': ar('M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4'), '⬆': ar('M12 20V4M6 10l6-6 6 6'), '⬇': ar('M12 4v16M6 14l6 6 6-6'),
    '↗': ar('M6 18L18 6M9 6h9v9'), '〰': ar('M2 12c3-5 5-5 7 0s4 5 7 0 4-5 6 0'), '➰': ar('M3 16c5 0 8-3 8-7a3 3 0 1 0-3 3c4 0 9 4 13 4'),
    '⚪': dot('#ffffff'), '🔴': dot('#ef5350'), '🔵': dot('#42a5f5'), '🟢': dot('#66bb6a'), '🟡': dot('#ffd54f'), '🟠': dot('#ffa726'),
    '🟦': sq('#42a5f5'), '🟨': sq('#ffd54f'), '⬜': sq('#ffffff'), '🔷': sv('<path d="M12 2.5l9 9.5-9 9.5-9-9.5z" fill="#42a5f5" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/>')
  };
  const RE = /(?:\p{Extended_Pictographic}|[⭐⭕⬜⬆⬇↔↗〰➰✅❌❓❔✔⏱⏸⏭⏮])️?(?:‍\p{Extended_Pictographic}️?)*/gu;
  const key = e => e.replace(/️/g, '');
  const html = e => { const k = key(e); if(SV[k]) return SV[k]; if(N[k]) return `<img class="emi" src="${BASE + N[k]}.png" alt="">`;
    if(k.includes('‍')){ const f = k.split('‍')[0]; if(N[f]) return `<img class="emi" src="${BASE + N[f]}.png" alt="">`; }
    console.warn('그림 없는 이모티콘', e, [...e].map(c => c.codePointAt(0).toString(16))); return null; };
  const SKIP = /^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION|TITLE|SVG|CANVAS)$/i;
  function fix(root){
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: t => {
      for(let p = t.parentNode; p && p !== document; p = p.parentNode) if(SKIP.test(p.nodeName) || p.isContentEditable) return NodeFilter.FILTER_REJECT;
      RE.lastIndex = 0; return RE.test(t.data) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP; } });
    const list = []; while(w.nextNode()) list.push(w.currentNode);
    for(const t of list){ let out = '', last = 0, changed = false; RE.lastIndex = 0;
      t.data.replace(RE, (m, i) => { const h = html(m); const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
        out += esc(t.data.slice(last, i)) + (h || esc(m)); last = i + m.length; if(h) changed = true; return m; });
      if(!changed) continue; out += t.data.slice(last).replace(/&/g, '&amp;').replace(/</g, '&lt;');
      const span = document.createElement('span'); span.innerHTML = out; t.replaceWith(...span.childNodes); }
  }
  const st = document.createElement('style');
  st.textContent = "img.emi{display:inline-block!important;height:1.15em!important;width:auto!important;max-width:1.6em!important;min-width:0!important;aspect-ratio:auto!important;object-fit:contain!important;vertical-align:-.22em;margin:0 .04em!important;padding:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:none!important;flex:none}" +
    "svg.emi{width:1em!important;height:1em!important;max-width:none!important;transform:none!important;flex:none;display:inline-block;vertical-align:-.12em}" +
    ".emo img.emi{height:1em!important;max-width:1.3em!important;vertical-align:0}";
  document.head.appendChild(st);
  const run = () => { fix(document.body); new MutationObserver(ms => { for(const m of ms){
      if(m.type === 'characterData'){ if(m.target.parentNode) fix(m.target.parentNode); }
      else m.addedNodes.forEach(n => { if(n.nodeType === 3){ if(n.parentNode) fix(n.parentNode); } else if(n.nodeType === 1) fix(n); }); } })
    .observe(document.body, { childList: true, subtree: true, characterData: true }); };
  if(document.body) run(); else document.addEventListener('DOMContentLoaded', run);
  window.EMOJI_FIX = fix;
})();
