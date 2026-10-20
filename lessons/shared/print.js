/* 인쇄용 활동지 공용
   - 화면에 ‘인쇄하기’·‘예시 답안’ 단추를 띄워요(인쇄물에는 안 나와요).
   - 주소 끝에 #answer 가 있으면 예시 답안(.ex)을 빨간 글씨로 보여 주고 ‘예시 답안’ 도장을 찍어요.
   - 주소 끝에 #print 가 있으면 열자마자 인쇄 창을 열어요(#answer#print 처럼 함께 써도 돼요).
   - 인쇄할 때 빈 종이가 끼지 않게: 장(.page)마다 1mm 줄이고, 마지막 장 뒤에는 쪽을 넘기지 않아요. */
(function(){
  const answer = location.hash.includes('answer');
  if(answer) document.documentElement.classList.add('answer');
  const pg = document.querySelector('.page'), mm = pg ? Math.round(pg.getBoundingClientRect().height * 25.4 / 96) : 297;
  const st = document.createElement('style');
  st.textContent = `.ex{display:none}
.answer .ex{display:revert;color:#e03131;font-family:'Gowun Dodum','Malgun Gothic',sans-serif;font-weight:700}
.answer img.ex{display:block}
.answer .exbox{position:absolute;inset:6mm 2mm 9mm;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1mm;z-index:2;font-size:11pt;line-height:1.35;text-align:center}
.exbox img{max-width:80%;max-height:75%;object-fit:contain}
.answer .nohint::before,.answer .nohint::after{content:none !important}
.answer .exstamp{display:flex}
.exstamp{display:none;position:absolute;right:7mm;top:46mm;z-index:5;align-items:center;justify-content:center;width:26mm;height:26mm;border-radius:50%;border:1mm solid #e03131;color:#e03131;font-family:Jua,'Malgun Gothic',sans-serif;font-size:11pt;line-height:1.25;text-align:center;transform:rotate(-12deg);background:rgba(255,255,255,.75)}
#sheetBtns{position:fixed;right:18px;top:18px;z-index:9;display:flex;gap:8px}
#sheetBtns button{font-family:Jua,'Malgun Gothic',sans-serif;font-size:18px;border:none;border-radius:14px;padding:12px 18px;cursor:pointer;background:#ffc53d;color:#5a3d00;box-shadow:0 4px 0 #d79e12}
#sheetBtns button.ans{background:#fff;color:#e03131;box-shadow:0 4px 0 #f0b3b3}
@media print{#sheetBtns{display:none}
  html,body{height:auto !important;margin:0 !important;padding:0 !important;background:none !important}
  .page{height:${mm - 1}mm !important;margin:0 !important;break-after:page;page-break-after:always}
  .page:last-of-type{break-after:auto;page-break-after:auto}}`;
  document.head.appendChild(st);
  /* 예시 답안 도장: 장마다 하나 */
  document.querySelectorAll('.page').forEach(p => { if(p.querySelector('.ex')){ const s = document.createElement('div'); s.className = 'exstamp'; s.innerHTML = '예시<br>답안<br><small style="font-size:9pt">선생님용</small>'; p.appendChild(s); } });
  const box = document.createElement('nav'); box.id = 'sheetBtns'; /* div 가 아니어야 .page:last-of-type 이 그대로 맞아요 */
  const pb = document.createElement('button'); pb.textContent = '🖨️ 인쇄하기'; pb.onclick = () => window.print(); box.appendChild(pb);
  if(document.querySelector('.ex')){ const ab = document.createElement('button'); ab.className = 'ans';
    ab.textContent = answer ? '📄 빈 활동지 보기' : '📗 예시 답안 보기';
    ab.onclick = () => { location.hash = answer ? '' : 'answer'; location.reload(); }; box.appendChild(ab); }
  document.body.appendChild(box);
  if(location.hash.includes('print')) addEventListener('load', () => document.fonts.ready.then(() => setTimeout(() => window.print(), 300)));
})();
