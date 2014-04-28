/* James Thomas, jacthoma@ucsc.edu
 * main datascrute and sounds for the sequencer
 */
var kick = new Audio("sounds/02_KICK_2.wav");
var snare = new Audio("sounds/03_SNARE_1.wav");
var hat = new Audio("sounds/ClosedHat10.wav");
var shake = new Audio("sounds/shake.wav");
var bass = new Audio("sounds/808KickDrum3.wav");
// New Sounds
var bassDrum1 = new Audio("sounds/bassDrum1.wav");
var bassDrum3 = new Audio("sounds/bassDrum3.wav");
var bassDrum5 = new Audio("sounds/bassDrum5.wav");
// synth
var synth_A_ = new Audio("sounds/synth1_A_.wav");
var synth_C = new Audio("sounds/synth1_C.wav");
var synth_D = new Audio("sounds/synth1_D.wav");
var synth_E = new Audio("sounds/synth1_E.wav");
var synth_G = new Audio("sounds/synth1_G.wav");
var synth_A = new Audio("sounds/synth1_A.wav");
var synth_C2 = new Audio("sounds/synth1_C2.wav");
var synth_D2 = new Audio("sounds/synth1_D2.wav");
var synth_E2 = new Audio("sounds/synth1_E2.wav");

function Button(x, y, w, fill) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = this.w;
  this.fill = fill;
  this.active = false;
  this.play;
  this.sound;
  this.row;
}

Button.prototype.draw = function(ctx) {
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.x, this.y, this.w, this.h);
}

// Determine if a point is inside the button
Button.prototype.contains = function(mx, my) {
  return  ((this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my));
}

function Sequence(canvas, socket) {
  this.socket = socket;
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  this.update = false;
  // fix mouse coordinate problem
  var paddingLeft, paddingTop, borderLeft, borderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.paddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.paddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.borderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.borderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  // Correct for injected html
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;
  
  this.time = 0;
  this.column = 0;
  this.column_h = 16;
  this.play = true;
  this.buttons = [];
  this.actives = [];

  var self = this;
  
  // Don't allow elements to be selected
  canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

  //  event listener for mouse down
  canvas.addEventListener('mousedown', function(e) {
    var mouse = self.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var buttons = self.buttons;
    var actives = self.actives;
    var l = buttons.length;
    for (var i = l-1; i >= 0; i--) {
      if (buttons[i].contains(mx, my)) {
      	// Object Selected
        var mySel = buttons[i];

        this.update = true;

        self.selection = mySel;
        if(!mySel.active){
        	mySel.active = true;
          actives[i] = true;
        } else {
        	mySel.active = false;
          actives[i] = false;
        }
        socket.emit('send state', actives);
        return;
      }
    }
  }, true);

  this.selectionWidth = 2;  
  this.interval = 25;
  setInterval(function() { self.draw(); }, self.interval);
}
Sequence.prototype.addButton = function(button) {
  this.buttons.push(button);
  this.actives.push(false);
}
Sequence.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}
// socket it
Sequence.prototype.send = function(data) {
  socket.emit('send state', data);
}
Sequence.prototype.receive = function(data) { 
  this.actives = data;
}
// update the canvas
Sequence.prototype.draw = function() {
  var column_h = this.column_h;
  var ctx = this.ctx;
  var buttons = this.buttons;
  this.clear();

  if(this.play){
    this.time++;
    if(this.time == 5){
      this.time = 0;
    }
  }
  if(this.time == 0 && this.play){
    for(var i = (this.column * column_h); i < (this.column * column_h + column_h); i++){

      if(buttons[i].active){
        if(buttons[i].sound != null){
          if(!buttons[i].sound.paused){
            buttons[i].sound.pause();
            buttons[i].sound.currentTime = 0;
          }
          buttons[i].sound.play();
        }
      }

      buttons[i].play = true;

      if(this.column == 0){
        buttons[(buttons.length - column_h) + i].play = false;
      } else {
        buttons[i-column_h].play = false;
      }
    }

    this.column++;
  }
  if(this.column == 16){
    this.column = 0;
  }
  // draw all buttons
  var l = buttons.length;
  for (var i = 0; i < l; i++) {

    buttons[i].active = this.actives[i];

    if(buttons[i].active){
      if(buttons[i].play){
        buttons[i].fill = 'A500FF';
      } else {
        buttons[i].fill = 'orange';
      }
    } else if(buttons[i].play){
      buttons[i].fill = "grey";
    } else{ 
      buttons[i].fill = 'white';
    }
    buttons[i].draw(ctx);
  }
  if(this.update) {
    this.socket.emit('send state', this.actives);
  }
  this.update = false;
}

Sequence.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  
  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Fix padding issure
  offsetX += this.paddingLeft + this.borderLeft + this.htmlLeft;
  offsetY += this.paddingTop + this.borderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  return {x: mx, y: my};
}

Sequence.prototype.play_pause = function(){
  if(this.play){
    this.play = false;
  } else {
    this.play = true;
  }
}

Sequence.prototype.space = function(){
  if(this.play){
    this.play = false;
  } else {
    this.rewind();
    this.play = true;
  }
}

Sequence.prototype.rewind = function(){
  // Delete the current play head
  for(var i = 0; i < this.buttons.length; i++){
    if(this.buttons[i].play){
      this.buttons[i].play = false;
    }
  }

  this.time = 0;
  this.column = 0;
}

Sequence.prototype.refresh = function() {
  for(var i = 0; i < this.buttons.length; i++){
    this.actives[i] = false;
    //this.buttons[i].active = false;
  }
  this.socket.emit('send state', this.actives);
}

var sequence;
// Initialize the sequencer
function init(socket) {
  /* drums */
  sequence = new Sequence(document.getElementById('MainCanvas'), socket);
  for(var i = 0; i < 16; i++) {
  	for(var j = 0; j < 16; j++) { 
  		sequence.addButton(new Button(i*30,j*30,20,'white'));
  	}
  }
  for(var i = 0; i < sequence.buttons.length; i++){
    for(var j = 0; j <= sequence.column_h; j++){
      // drums
      if((i + j) % sequence.column_h == 0){
        sequence.buttons[i].row = j;
      }
      if(sequence.buttons[i].row == 1){
        sequence.buttons[i].sound = kick;
      }
      if(sequence.buttons[i].row == 2){
        sequence.buttons[i].sound = snare;
      }
      if(sequence.buttons[i].row == 3){
        sequence.buttons[i].sound = hat;
      }
      if(sequence.buttons[i].row == 4){
        sequence.buttons[i].sound = shake;
      }
      if(sequence.buttons[i].row == 5){
        sequence.buttons[i].sound = bassDrum1;
      }
      if(sequence.buttons[i].row == 6){
        sequence.buttons[i].sound = bassDrum3;
      }
      if(sequence.buttons[i].row == 7){
        sequence.buttons[i].sound = bassDrum5;
      }
      // synth
      if(sequence.buttons[i].row == 8){
        sequence.buttons[i].sound = synth_A_;
      }
      if(sequence.buttons[i].row == 9){
        sequence.buttons[i].sound = synth_C;
      }
      if(sequence.buttons[i].row == 10){
        sequence.buttons[i].sound = synth_D;
      }
      if(sequence.buttons[i].row == 11){
        sequence.buttons[i].sound = synth_E;
      }
      if(sequence.buttons[i].row == 12){
        sequence.buttons[i].sound = synth_G;
      }
      if(sequence.buttons[i].row == 13){
        sequence.buttons[i].sound = synth_A;
      }
      if(sequence.buttons[i].row == 14){
        sequence.buttons[i].sound = synth_C2;
      }
      if(sequence.buttons[i].row == 15){
        sequence.buttons[i].sound = synth_D2;
      }
      if(sequence.buttons[i].row == 16){
        sequence.buttons[i].sound = synth_E2;
      }

    }
  }
}
