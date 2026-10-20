/* 활동지 바로 인쇄: 숨은 틀에 활동지를 불러와 글꼴·그림이 다 뜨면 인쇄 창을 열어요.
   수업 화면에서 <button onclick="printSheet('worksheet.html')"> 처럼 써요. 틀을 쓸 수 없으면 새 창으로 열고 바로 인쇄해요. */
function printSheet(url){ let f = document.getElementById('printFrame'); if(f) f.remove();
  f = document.createElement('iframe'); f.id = 'printFrame'; f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
  f.onload = async () => { try{ const w = f.contentWindow, d = w.document;
      await d.fonts.ready; await Promise.all([...d.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
      w.focus(); w.print(); }catch(e){ window.open(url + '#print', '_blank'); } };
  f.src = url; document.body.appendChild(f); }
