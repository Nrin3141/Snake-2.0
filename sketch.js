var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var scl;
var posX;
var posY;
var velX;
var velY;
var applePosX;
var applePosY;
var gameState = 'running';
var ResumeButton = document.createElement('BUTTON');
var scoreboard = document.createElement('p');
var counter;
var snakeArray;
var toggleFullscreenButton;
let direction = 'down';
let buttonSeal = 'false';
scoreboard.id = 'scoreBoard';
document.body.appendChild(scoreboard);
ResumeButton.innerHTML = 'Resume!';
ResumeButton.id = 'resumeButton';
ResumeButton.addEventListener('click',function(){
  snakeControls('menuButtonPressed');
});

document.addEventListener('onload', loadGame());
window.addEventListener('resize', function(){canvasResize()});
window.setInterval(draw, 100);
document.body.addEventListener('keydown',function(event){
  snakeControls(event.key);
})


function loadGame(gameOver){
  if (gameOver != 'true'){
    snakeArray = [];
    posX = posY = 0;
  }
  else {
    snakeArray = snakeArray.slice(-4);
  }
  counter = velX = velY = 0;
  canvasResize();
  generateNewApple();

}


function canvasResize(){

  if (window.innerHeight <= window.innerWidth){
    canvas.height = window.innerHeight*0.9-(window.innerHeight*0.9)%10;
    scl = canvas.height/10;
    let v = 0;
    while (scl*v < window.innerWidth*0.9){
      v++;
      canvas.width = scl*v;
  }
}
  else {
    canvas.width = window.innerWidth*0.9-(window.innerWidth*0.9)%10;
    scl = canvas.width/10;
    let v = 0;
    while (scl*v < window.innerHeight*0.9){
      v++;
      canvas.height = scl*v;
  }

  }

  generateNewApple();
}


function collisionCheck(){
  if (posX === applePosX && posY === applePosY){
    counter += 1;
    generateNewApple();
  }
}

function generateNewApple(which){
  let savedApplePosX = applePosX;
  let savedApplePosY = applePosY;
  applePosX = Math.floor(Math.random()*canvas.width/scl)*scl;
  applePosY = Math.floor(Math.random()*canvas.height/scl)*scl;
  if (snakeArray.length && snakeArray.length > 3){
    for (j=0; j<snakeArray.length; j++){
    if (applePosY === 0 || applePosX === savedApplePosX
        && applePosY === applePosY || applePosX === snakeArray[j][0]
        && applePosY === snakeArray[j][1]){
        generateNewApple();
    }
  }
  }
}


function draw(){
  buttonSeal = 'false';
  if (gameState === 'stopped') {
  ctx.fillStyle = 'grey';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  }
  else {
  ctx.fillStyle = 'rgb(180,210,230)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'yellow';
  ctx.fillRect(applePosX, applePosY, scl*0.9, scl*0.9);
  ctx.fillStyle = 'brown';
  ctx.fillRect(applePosX+scl*0.9/2-scl/20, applePosY-scl/5, scl/10, scl/5);
  ctx.fillStyle = 'green';
  ctx.fillRect(applePosX+scl*0.9/2+scl/20, applePosY-scl/10, scl/5, scl/10);
  posX += velX;
  posY += velY;
  if (posX > canvas.width-scl){
    posX = 0;
  }
  if (posX < 0){
    posX = canvas.width-scl;
  }
  if (posY > canvas.height-scl){
    posY = 0;
  }
  if (posY < 0){
    posY = canvas.height-scl;
  }
  collisionCheck();
  scoreboard.innerHTML = 'Score: ' + counter;

  for (i=0;i<snakeArray.length;i++){
  if (posX === snakeArray[i][0] && posY === snakeArray[i][1] && velX+velY != 0){
    scoreboard.innerHTML = 'You LOST - Your score was: ' + counter;
    stopGame('true');
    }
  }

  //using current velocity to give every snake segment a direction
  if(velX === -scl){
    direction = 'left';
  }
  if(velY === -scl){
    direction = 'up';
  }
  if(velX === scl){
    direction = 'right'
  }
  if(velY === scl){
    direction = 'down';
  }

  //snakeBody generation
  snakeArray.push([posX, posY, direction]);
  if (snakeArray.length > counter+4){
    snakeArray = snakeArray.slice(1);
  }

  //painting the snake
  for(i=1;i<snakeArray.length;i++){
    if (gameState != 'stopped'){
      whatToDraw (i, snakeArray[i-1][2], snakeArray[i][2]);
    }
}
}
}

//deciding which parts of the snake need to be drawn
function whatToDraw(arrayIndex, direction1, direction2){
paintHead();
  if (arrayIndex-1 === 0){
    paintTail();
  }
  if (direction1 != direction2 && arrayIndex != 1){
    paintCorner();
  }
  else {
    if (arrayIndex-1 != 0 && velX + velY != 0){
      paintNormal(arrayIndex);
    }
  }
}

//painting the head
function paintHead(){
  ctx.fillStyle = 'rgb(50,150,50)';
  ctx.fillRect(snakeArray[snakeArray.length-1][0], snakeArray[snakeArray.length-1][1], scl, scl);
  ctx.fillStyle = 'black';
  let unit = scl*0.2; //smaller scale unit to prevent a lot more numbers in code
  switch (snakeArray[snakeArray.length-1][2]){
    case 'left':
    ctx.fillRect(snakeArray[snakeArray.length-1][0]+0.3*scl, snakeArray[snakeArray.length-1][1], unit, unit);
    ctx.fillRect(snakeArray[snakeArray.length-1][0]+0.3*scl, snakeArray[snakeArray.length-1][1]+0.8*scl, unit, unit);
    ctx.fillStyle = 'rgb(150,50,70)';
    ctx.beginPath()
    ctx.moveTo(snakeArray[snakeArray.length-1][0], snakeArray[snakeArray.length-1][1]+scl/2-unit/2);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]-scl/2, snakeArray[snakeArray.length-1][1]+scl/2-unit/2);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]-2*scl/3, snakeArray[snakeArray.length-1][1]+1.5*unit);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]-scl/2-0.1*unit, snakeArray[snakeArray.length-1][1]+scl/2-unit/2+0.2*unit);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]-2*scl/3, snakeArray[snakeArray.length-1][1]+3*unit);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]-scl/2, snakeArray[snakeArray.length-1][1]+scl/2);
    ctx.lineTo(snakeArray[snakeArray.length-1][0], snakeArray[snakeArray.length-1][1]+scl/2);
    ctx.fill();
    break;
    case 'right':
    ctx.fillRect(snakeArray[snakeArray.length-1][0]+scl/2, snakeArray[snakeArray.length-1][1], scl*0.2, scl*0.2);
    ctx.fillRect(snakeArray[snakeArray.length-1][0]+scl/2, snakeArray[snakeArray.length-1][1]+0.8*scl, scl*0.2, scl*0.2);
    ctx.fillStyle = 'rgb(150,50,70)';
    ctx.beginPath()
    ctx.moveTo(snakeArray[snakeArray.length-1][0]+scl, snakeArray[snakeArray.length-1][1]+scl/2-unit/2);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+3*scl/2, snakeArray[snakeArray.length-1][1]+scl/2-unit/2);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+3*scl/2+(scl/2-scl/3), snakeArray[snakeArray.length-1][1]+1.5*unit);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+3*scl/2+0.1*unit, snakeArray[snakeArray.length-1][1]+scl/2-unit/2+0.2*unit);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+3*scl/2+(scl/2-scl/3), snakeArray[snakeArray.length-1][1]+3*unit);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+3*scl/2, snakeArray[snakeArray.length-1][1]+scl/2);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+scl, snakeArray[snakeArray.length-1][1]+scl/2);
    ctx.fill();
    break;
    case 'up':
    ctx.fillRect(snakeArray[snakeArray.length-1][0], snakeArray[snakeArray.length-1][1]+0.3*scl, scl*0.2, scl*0.2);
    ctx.fillRect(snakeArray[snakeArray.length-1][0]+0.8*scl, snakeArray[snakeArray.length-1][1]+0.3*scl, scl*0.2, scl*0.2);
    ctx.fillStyle = 'rgb(150,50,70)';
    ctx.beginPath()
    ctx.moveTo(snakeArray[snakeArray.length-1][0]+scl/2-unit/2, snakeArray[snakeArray.length-1][1]);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+scl/2-unit/2, snakeArray[snakeArray.length-1][1]-scl/2);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+1.5*unit, snakeArray[snakeArray.length-1][1]-2*scl/3);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+scl/2-unit/2+0.2*unit, snakeArray[snakeArray.length-1][1]-scl/2-0.1*unit);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+3*unit, snakeArray[snakeArray.length-1][1]-2*scl/3);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+scl/2, snakeArray[snakeArray.length-1][1]-scl/2);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+scl/2, snakeArray[snakeArray.length-1][1]);
    ctx.fill();
    break;
    case 'down':
    ctx.fillRect(snakeArray[snakeArray.length-1][0], snakeArray[snakeArray.length-1][1]+0.5*scl, scl*0.2, scl*0.2);
    ctx.fillRect(snakeArray[snakeArray.length-1][0]+0.8*scl, snakeArray[snakeArray.length-1][1]+0.5*scl, scl*0.2, scl*0.2);
    ctx.fillStyle = 'rgb(150,50,70)';
    ctx.beginPath()
    ctx.moveTo(snakeArray[snakeArray.length-1][0]+scl/2-unit/2, snakeArray[snakeArray.length-1][1]+scl);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+scl/2-unit/2, snakeArray[snakeArray.length-1][1]+3*scl/2);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+1.5*unit, snakeArray[snakeArray.length-1][1]+3*scl/2+(scl/2-scl/3));
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+scl/2-unit/2+0.2*unit, snakeArray[snakeArray.length-1][1]+3*scl/2+0.1*unit);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+3*unit, snakeArray[snakeArray.length-1][1]+3*scl/2+(scl/2-scl/3));
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+scl/2, snakeArray[snakeArray.length-1][1]+3*scl/2);
    ctx.lineTo(snakeArray[snakeArray.length-1][0]+scl/2, snakeArray[snakeArray.length-1][1]+scl);
    ctx.fill();
    break;
}
}

//painting the body
function paintNormal(){
  ctx.fillStyle = 'rgb(50,150,50)';
  ctx.fillRect(snakeArray[i-1][0], snakeArray[i-1][1], scl, scl);
}

//painting the tail
function paintTail(){
  ctx.fillStyle = 'rgb(50,150,50)';
    switch (snakeArray[1][2]){
      case 'left':
      ctx.beginPath();
      ctx.moveTo(snakeArray[0][0], snakeArray[i-1][1]);
      ctx.lineTo(snakeArray[0][0]+2*scl, snakeArray[i-1][1]+scl/2);
      ctx.lineTo(snakeArray[0][0], snakeArray[i-1][1]+scl);
      ctx.fill();
      break;
      case 'right':
      ctx.beginPath();
      ctx.moveTo(snakeArray[0][0]+scl, snakeArray[i-1][1]);
      ctx.lineTo(snakeArray[0][0]-scl, snakeArray[i-1][1]+scl/2);
      ctx.lineTo(snakeArray[0][0]+scl, snakeArray[i-1][1]+scl);
      ctx.fill();
      break;
      case 'up':
      ctx.beginPath();
      ctx.moveTo(snakeArray[0][0], snakeArray[i-1][1]);
      ctx.lineTo(snakeArray[0][0]+scl/2, snakeArray[i-1][1]+2*scl);
      ctx.lineTo(snakeArray[0][0]+scl, snakeArray[i-1][1]);
      ctx.fill();
      break;
      case 'down':
      ctx.beginPath();
      ctx.moveTo(snakeArray[0][0], snakeArray[i-1][1]+scl);
      ctx.lineTo(snakeArray[0][0]+scl/2, snakeArray[i-1][1]-scl);
      ctx.lineTo(snakeArray[0][0]+scl, snakeArray[i-1][1]+scl);
      ctx.fill();
      break;
     }
}



//painting the corners
function paintCorner(){
  ctx.fillStyle = 'rgb(50,150,50)';
    switch (snakeArray[i][2]){ //caseSwitch do decide which direction the triangle for the corner needs to be facing
      case 'left':
      if (snakeArray[i-1][2] === 'down'){
        ctx.beginPath();
        ctx.moveTo(snakeArray[i-1][0], snakeArray[i-1][1]);
        ctx.lineTo(snakeArray[i-1][0]+scl, snakeArray[i-1][1]);
        ctx.lineTo(snakeArray[i-1][0], snakeArray[i-1][1]+scl);
        ctx.fill();
      }
      else if (snakeArray[i-1][2] === 'up'){
        ctx.beginPath();
        ctx.moveTo(snakeArray[i-1][0], snakeArray[i-1][1]);
        ctx.lineTo(snakeArray[i-1][0], snakeArray[i-1][1]+scl);
        ctx.lineTo(snakeArray[i-1][0]+scl, snakeArray[i-1][1]+scl);
        ctx.fill();
      };
      break;
      case 'down':
      if (snakeArray[i-1][2] === 'left'){
        ctx.beginPath();
        ctx.moveTo(snakeArray[i-1][0], snakeArray[i-1][1]+scl);
        ctx.lineTo(snakeArray[i-1][0]+scl, snakeArray[i-1][1]+scl);
        ctx.lineTo(snakeArray[i-1][0]+scl, snakeArray[i-1][1]);
        ctx.fill();
      }
      else if (snakeArray[i-1][2] === 'right'){
        ctx.beginPath();
        ctx.moveTo(snakeArray[i-1][0], snakeArray[i-1][1]);
        ctx.lineTo(snakeArray[i-1][0], snakeArray[i-1][1]+scl);
        ctx.lineTo(snakeArray[i-1][0]+scl, snakeArray[i-1][1]+scl);
        ctx.fill();
      };
      break;
      case 'right':
      if (snakeArray[i-1][2] === 'down'){
        ctx.beginPath();
        ctx.moveTo(snakeArray[i-1][0], snakeArray[i-1][1]);
        ctx.lineTo(snakeArray[i-1][0]+scl, snakeArray[i-1][1]);
        ctx.lineTo(snakeArray[i-1][0]+scl, snakeArray[i-1][1]+scl);
        ctx.fill();
      }
      else if (snakeArray[i-1][2] === 'up'){
        ctx.beginPath();
        ctx.moveTo(snakeArray[i-1][0], snakeArray[i-1][1]+scl);
        ctx.lineTo(snakeArray[i-1][0]+scl, snakeArray[i-1][1]+scl);
        ctx.lineTo(snakeArray[i-1][0]+scl, snakeArray[i-1][1]);
        ctx.fill();
      }
      break;
      case 'up':
      if (snakeArray[i-1][2] === 'left'){
        ctx.beginPath();
        ctx.moveTo(snakeArray[i-1][0], snakeArray[i-1][1]);
        ctx.lineTo(snakeArray[i-1][0]+scl, snakeArray[i-1][1]);
        ctx.lineTo(snakeArray[i-1][0]+scl, snakeArray[i-1][1]+scl);
        ctx.fill();
      }
      else if (snakeArray[i-1][2] === 'right'){
        ctx.beginPath();
        ctx.moveTo(snakeArray[i-1][0], snakeArray[i-1][1]);
        ctx.lineTo(snakeArray[i-1][0], snakeArray[i-1][1]+scl);
        ctx.lineTo(snakeArray[i-1][0]+scl, snakeArray[i-1][1]);
        ctx.fill();
      }
      break;

  }
}

//handling button and mouse presses -> the game Controls
function snakeControls(whichButton){
  if (gameState === 'running' && posX >= 0 && posY >= 0 && posX <= canvas.width && posY <= canvas.height && buttonSeal === 'false'){
      switch (whichButton){
        case ' ':
        stopGame();
        break;
        case 'a':
        if (velX === scl){}
        else {
          velX = -scl;
          velY = 0;
        }
        break;
        case 'd':
        if (velX === -scl){}
        else {
        velX = scl;
        velY = 0;
        }
        break;
        case 'w':
        if (velY === scl){}
        else {
        velX = 0;
        velY = -scl;
        }
        break;
        case 's':
        if (velY === -scl){}
        else {
        velX = 0;
        velY = scl;
        }
        break;
        case 'ArrowUp':
        if (velY === scl){}
        else {
        velX = 0;
        velY = -scl;
        }
        break;
        case 'ArrowDown':
        if (velY === -scl){}
        else {
        velX = 0;
        velY = scl;
        }
        break;
        case 'ArrowLeft':
        if (velX === scl){}
        else {
        velX = -scl;
        velY = 0;
        }
        break;
        case 'ArrowRight':
        if (velX === -scl){}
        else {
        velX = scl;
        velY = 0;
        }
        break;
    }
    buttonSeal = 'true'; //the buttonSeal prevents negative consequences of button-spamming
   }

  else if (whichButton === ' ' || whichButton === 'menuButtonPressed'){
    stopGame();
  }
}

//stopping the game -> either by gameOver or by pauseButton
function stopGame(gameOver){
  if (gameState === 'stopped'){
    posX = savedPosX;
    posY = savedPosY;
    switch (snakeArray[snakeArray.length-1][2]){
      case 'left':
      velX = -scl;
      break;
      case 'right':
      velX = scl;
      break;
      case 'up':
      velY = -scl;
      break;
      case 'down':
      velY = scl;
      break;
    }
    document.body.removeChild(ResumeButton);
    if (is_touch_device()){
      document.body.appendChild(LeftButton);
      document.body.appendChild(RightButton);
      document.body.appendChild(DownButton);
      document.body.appendChild(UpButton);
    }
    gameState = 'running';
}
  else {
    savedPosX = posX;
    savedPosY = posY;
    velX = 0;
    velY = 0;
    if (is_touch_device()){
      document.body.removeChild(LeftButton);
      document.body.removeChild(RightButton);
      document.body.removeChild(DownButton);
      document.body.removeChild(UpButton);
    }
    document.body.appendChild(ResumeButton);
    gameState = 'stopped';
  }
  if (gameOver === 'true'){
    loadGame(gameOver);
  }
}


//adding all the buttons and event Listeners to the DOM
if (is_touch_device()){
  var LeftButton = document.createElement('BUTTON');
  var RightButton = document.createElement('BUTTON');
  var UpButton = document.createElement('BUTTON');
  var DownButton = document.createElement('BUTTON');
  document.body.appendChild(LeftButton);
  document.body.appendChild(RightButton);
  document.body.appendChild(UpButton);
  document.body.appendChild(DownButton);
  LeftButton.innerHTML = 'A';
  RightButton.innerHTML = 'D';
  UpButton.innerHTML = 'W';
  DownButton.innerHTML = 'S';

  LeftButton.className = 'moveButtons';
  RightButton.className = 'moveButtons';
  UpButton.className = 'moveButtons';
  DownButton.className = 'moveButtons';

  LeftButton.id = 'leftButton';
  RightButton.id = 'rightButton';
  UpButton.id = 'UpButton';
  DownButton.id = 'DownButton';

  LeftButton.addEventListener('pointerdown', function(){
    snakeControls('a');
  });
  RightButton.addEventListener('pointerdown', function(){
    snakeControls('d');
  });
  UpButton.addEventListener('pointerdown', function(){
    snakeControls('w');
  });
  DownButton.addEventListener('pointerdown', function(){
    snakeControls('s');
  });
}


function is_touch_device() {
 return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}

/*function toggleFullscreen(ele) {
    if(ele.requestFullscreen) {
      ele.requestFullscreen();
    } else if(ele.mozRequestFullScreen) {
      ele.mozRequestFullScreen();
    } else if(ele.msRequestFullscreen) {
      ele.msRequestFullscreen();
    } else if(ele.webkitRequestFullscreen) {
      ele.webkitRequestFullscreen();
    }
}*/
function toggleFullScreen() {
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
}
toggleFullscreenButton = document.createElement('BUTTON');
toggleFullscreenButton.innerHTML = 'Go Fullscreen!';
toggleFullscreenButton.id = 'fullScreenButton';
document.getElementById('container2').appendChild(toggleFullscreenButton);
toggleFullscreenButton.addEventListener('pointerdown', function(){
  toggleFullScreen(document.documentElement);
});
