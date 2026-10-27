/* 차시 마지막 화면에 '처음 화면으로' 단추 — 앱 안(iframe)이면 앱 첫 화면으로, 따로 열었으면 index.html 로 */
(() => {
  function goHome(){
    if(window.parent && window.parent !== window){ try{ window.parent.postMessage({type:'go-home'}, '*'); return; }catch(e){} }
    location.href = '../../index.html';
  }
  window.goHome = goHome;
  function add(){
    const all = document.querySelectorAll('section.slide'); const last = all[all.length - 1];
    if(!last || last.querySelector('.homeBtn')) return;
    const b = document.createElement('button'); b.className = 'homeBtn'; b.type = 'button';
    b.innerHTML = '<img src="../shared/icons/house.png" alt="">처음 화면으로';
    b.onclick = e => { e.stopPropagation(); goHome(); };
    last.appendChild(b);
    const st = document.createElement('style');
    st.textContent = '.homeBtn{position:absolute;left:36px;bottom:26px;z-index:5;display:flex;align-items:center;gap:10px;font-family:var(--head,"Jua"),sans-serif;font-size:26px;color:#2d3a7c;background:#fff;border:4px solid #ffc94d;border-radius:999px;padding:8px 24px 8px 14px;box-shadow:0 6px 0 #e0a92a;cursor:pointer}'
      + '.homeBtn img{width:40px;height:40px;object-fit:contain}.homeBtn:hover{transform:translateY(-2px)}.homeBtn:active{transform:translateY(3px);box-shadow:0 2px 0 #e0a92a}';
    document.head.appendChild(st);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();
