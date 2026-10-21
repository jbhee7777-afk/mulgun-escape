# 이어서 작업하기 (2026-10-21 학교 → 집)

## 지금까지 된 것
- 전체 점검(24차시 모든 화면 넘기기·글자 넘침·활동지 겹침) 통과. 8차시 마술 쇼 화면에서 다음으로 안 넘어가던 오류 고침.
- 1~24차시 수업 화면·활동지·예시 답안·PDF 완료, GitHub main 에 올라가 있어요.
- 20·24차시 사진도 넣었어요(위키미디어, CREDITS.md). 사진 받는 법: 크롬(자동 다운로드 허용됨)에서 upload.wikimedia.org 페이지를 열고 commons API(`origin=*`)로 찾아 blob 으로 내려받기 → Downloads 에서 stage.
- 21~24차시 놀잇감 그림은 `lessons/shared/toys.js`(TOY.car/guitar/shaker/drawCar). 21차시 굴러가기 실험(비탈)·소리 실험(WebAudio 고무줄 기타·흔드는 통). 24차시는 paperbridge.js 로 8차시 다시 보기.
- 17차시 불편함 지도는 그 컴퓨터 브라우저에 저장(localStorage `mg17map`) → 18차시 첫 화면·문제 뽑기에 이어져요. 19차시 모둠 작전·전후 결과는 `mg19ops`.
- 단계 카드(.st) 위쪽 여백을 늘려 번호 동그라미가 글자를 가리지 않게 고쳤어요(kit.css, 9차시 이후 전체).
- 8차시: 동전 실험을 물리 계산 영상으로(`lessons/shared/paperbridge.js`, `materials/08/종이 다리 동전 실험 영상.webm`), 동전이 안정적으로 올라가는 모양 4가지(평평·ㄷ자 홈통·⊓자 다리·병풍).
- 방 문 그림(Canva): 3번 `lessons/10/img/door3.jpg`, 4번 `lessons/15/img/door4.jpg`, 5번 `lessons/20/img/door5.jpg`.
  Canva 디자인 "2번 방 스토리북 문 배경"(DAHYgmVzrIA)에 문 그림 페이지가 모여 있어요.

## 남은 일
1. **이모티콘 그림을 Canva 그림으로 바꾸기 (진행 중)** — 아이콘은 `lessons/shared/icons/이름.png`(Canva 스티커 시트를 잘라 만듦).
   - 끝: 3·5·6·7·8·9·20·21차시 전부, 4·10·16차시 일부 (flask, scale, wand, sneaker, basket, oxpad, mannequin, target, box, pencil, umbrella, shop, tophat, column, robot, trophy)
   - Canva에 만들어 둔 시트(아직 못 받음): MAHYpHyqzTI → mic, masks, gacha, ballot, gloves, fingertip, glasses, map
   - 더 만들 시트: scissors, notepad, stopwatch, chart, toolbox, vest, star, cycle / triangle, bridge, wrench, lineup(줄 선 아이들) + 9차시 딱풀 단계 그림 4장
   - 바꾸는 스크립트: 아이콘 파일을 넣은 뒤 각 차시의 `<div class="ic emo" style="font-size:96px">이모지</div>` 를 `<img class="ic" src="../shared/icons/이름.png" alt="">` 로.
2. 전체 학생 입장 점검(불가능하거나 이해 안 되는 부분 없는지).

## 만드는 방식 (9차시부터)
- 공용: `lessons/shared/kit.css`, `kit.js`(점수판·타이머·문제 번호), `sheet.css`(활동지), `print.js`(인쇄·예시 답안 `#answer`), `print-sheet.js`.
- 차시 폴더: `lessons/NN/index.html`, `worksheet.html`(예시 답안은 `class="ex"`), `img/worksheet_preview.png`.
- `materials/NN/links.txt` 에 `▶ N차시 수업 시작하기 | lessons/NN/index.html | 수업`, 그리고 `활동지_….pdf`, `예시 답안_….pdf`.
- 물건 사진: 위키미디어 공용(학교 컴퓨터 크롬에서 받아 오기: 자동 다운로드 허용 필요) → `lessons/shared/photos/이름.jpg`, 출처는 `CREDITS.md` 에 한 줄씩.

## 선생님 원칙
- 예시 답안 항상 · 활동은 차시마다 다르게 · 모둠마다 2문제 이상 · 인쇄 시 빈 쪽 없게
- 물건은 실제 사진, 캐릭터·아이콘은 Canva 그림
- 실험·그림은 물리적으로 맞게, 규칙은 아주 단계적으로, 40분, 준비물 적게(필요하면 앞 차시에 예고)
- 맞다/틀리다보다 좋은 점·걱정되는 점·이렇게 하면? 처럼 열린 생각
