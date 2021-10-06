const canvas = document.getElementById("jsCanvas");
const context = canvas.getContext("2d");  // context는 캔버스 안에서 픽셀을 다룸
const colors = document.getElementsByClassName("controls__color");
const range = document.querySelector("#jsRange");
const mode = document.querySelector("#jsMode");
const saveBtn = document.querySelector("#jsSave");
const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 350;

let painting = false;
let filling = false;

// 실제로 픽셀 사이즈를 줘야함 (CSS랑 별개)
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

context.fillStyle = "white";  // 초기 배경색 설정
context.fillRect(0, 0, canvas.width, canvas.height) // 0, 0부터 캔버스 사이즈까지 컬러를 채움
// 첫 번째 색을 검정색으로 설정
context.strokeStyle = INITIAL_COLOR;  // strokeStyle은 그리는 선들이 갖는 컬러
context.lineWidth = 2.5;          // 선의 너비

function stopPainting() {
  painting = false;
}

function startPainting() {
  painting = true;
}

function onMouseMove(event) {
  // offset은 canvas 부분과 관련있는 값임
  // client는 윈도우에서 좌표를 얻는데 오프셋은 캔버스 안에서의 좌표를 얻음
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    context.beginPath();    // 마우스를 클릭하지 않고 움직였을때는 path를 시작함
    context.moveTo(x, y);   // path를 만들면 마우스의 x, y 좌표로 path를 옮기는 것
  } else {
    context.lineTo(x, y);   // lineTo는 path의 이전 위치에서 현재 위치까지 선이 만들어짐 (색을 아직 안들어감)
    context.stroke();
  }
}

// Array.from() 메서드는 object로부터 Array를 만듬
// console.log(Array.from(colors));
// console.log(colors);

function handleColorClick(event) {
  // const color = event.target.style.backgroundColor;
  // html에 인라인으로 css 설정하지 않고 외부 css파일로 배경 설정시 이벤트에 값이 안들어감 때문에 window.getComputedStyle(event.target).backgroundColor 이런식으로 값을 가져와야함
  // getComputedStyle() 메소드는 인자로 전달받은 엘리먼트에 최종적으로 적용된 모든 CSS 속성 값을 담은 객체를 반환한다.
  const color = window.getComputedStyle(event.target).backgroundColor;  // 외부 css 값 가져오기!
  context.strokeStyle = color;
  context.fillStyle = context.strokeStyle;
}

function handleRangeChange(event) {
  const size = event.target.value;
  context.lineWidth = size;
}

function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "Paint";
  }
}

function handleCanvasClick() {
  if (filling) {
    context.fillRect(0, 0, canvas.width, canvas.height) // 0, 0부터 캔버스 사이즈까지 컬러를 채움
  }
}

function handleCM(event) {
  event.preventDefault();
}

function handleSaveClick() {
  // 1. canvas의 데이터를 image로 얻기 
  const image = canvas.toDataURL(); // Default가 png 이기 때문에 안적으면 png로 저장됨 
  const link = document.createElement("a");
  link.href = image; // href는 url이 되어야 함
  link.download = "Paint[🎨}"  // download는 anchor(a) 태그의 attribute인데 href 대신 사용가능 url로 가지않고 url를 다운로드 하라고 지시하는것
  link.click();
}


if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick)
  canvas.addEventListener("contextmenu", handleCM)  // 우클릭 했을때 메뉴 안나오게하기 
  canvas.addEventListener("touchstart", startPainting)
  canvas.addEventListener("touchend", stopPainting)
  canvas.addEventListener("touchmove", onMouseMove)
}

Array.from(colors).forEach(color =>
  color.addEventListener("click", handleColorClick)
);

range.addEventListener("input", handleRangeChange) // range 이벤트는 input에 반응
mode.addEventListener("click", handleModeClick);
saveBtn.addEventListener("click", handleSaveClick)