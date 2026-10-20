/* 인쇄용 활동지 공용: 화면에 ‘인쇄하기’ 단추를 띄우고(인쇄물에는 안 나와요), 주소 끝이 #print 이면 열자마자 인쇄 창을 열어요. */
(function(){
  const st = document.createElement('style');
  st.textContent = '#printBtn{position:fixed;right:18px;top:18px;z-index:9;font-family:Jua,"Malgun Gothic",sans-serif;font-size:18px;background:#ffc53d;color:#5a3d00;border:none;border-radius:14px;padding:12px 20px;box-shadow:0 4px 0 #d79e12;cursor:pointer}@media print{#printBtn{display:none}}';
  document.head.appendChild(st);
  const b = document.createElement('button'); b.id = 'printBtn'; b.textContent = '🖨️ 인쇄하기'; b.onclick = () => window.print(); document.body.appendChild(b);
  if(location.hash === '#print') addEventListener('load', () => document.fonts.ready.then(() => setTimeout(() => window.print(), 300)));
})();
