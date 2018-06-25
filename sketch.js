var myRec = new p5.SpeechRec(); // new P5.SpeechRec object
myRec.continuous = true; // do continuous recognition
myRec.interimResults = true; // allow partial recognition (faster, less accurate)

  myRec.onResult = parseResult; // recognition callback
  myRec.onEnd = parseEnd; // recognition callback
  console.log('*** STARTED LISTENING ***');
  myRec.start(); // start engine

  var ship;
  var asteroid = [];
  var lasers = [];

  
  function setup() {
    createCanvas(500, 500);
    ship = new Ship();
    for ( var i = 0; i < 7; i++ ) {
      asteroid.push(new Asteroid());
    }
  }
  
  function draw() {
    if (ship.shipLife <= 0) {
      console.log('☹ YOU LOSE, ★ = '+ship.shipPoints);
    } else {
    background(0);
    ship.render();
    ship.turn();
    ship.update();
    ship.edges();

    for ( var i = 0; i < asteroid.length; i++ ) {
      if (ship.hits(asteroid[i])) {
        ship.shipLife--;
        console.log('♥ = ' + ship.shipLife);
      }
      asteroid[i].render();
      asteroid[i].update();
      asteroid[i].edges();
    }
  
    for ( var i = lasers.length-1; i >= 0; i-- ) {
      lasers[i].render();
      lasers[i].update();
      if (lasers[i].offscreen()) {
        lasers.splice(i, 1);   
      } else {
        for ( var j = asteroid.length-1; j >= 0; j-- ) {
          if(lasers[i].hits(asteroid[j])) {
            if (asteroid[j].r > 10 ) {
              var newAsteroids = asteroid[j].breakup();
              asteroid = asteroid.concat(newAsteroids);
              ship.shipPoints = ship.shipPoints + 10;
              ship.shipLife = ship.shipLife + 5;
              console.log('HITTED, ★ = '+ship.shipPoints);
            } else {
              //
            }
            asteroid.splice(j, 1);
            lasers.splice(i, 1);
            break;
          }
        }
      }
    }
  }
}

  function keyReleased() {
    ship.setRotation(0);
    ship.boosting(false);
  }

  function parseEnd() {
    ship.setRotation(0);
    ship.boosting(false);
    console.log('*** ENDED LISTENING ***');
    myRec.start(); 
    console.log('*** STARTED LISTENING ***');
  }
  
  function keyPressed() {
    if (key == ' ') {
      lasers.push(new Laser(ship.pos, ship.heading));
    } else if (keyCode == RIGHT_ARROW) {
      ship.setRotation(0.1);
    } else if ( keyCode == LEFT_ARROW) {
      ship.setRotation(-0.1)
    } else if ( keyCode == UP_ARROW ) {
      ship.boosting(true);
    }
  }
  
function parseResult()
{
  console.log(myRec.resultString);

  var mostrecentword = myRec.resultString.split(' ').pop();
  if(mostrecentword.indexOf("fire")!==-1) {
    lasers.push(new Laser(ship.pos, ship.heading));
  }
  else if(mostrecentword.indexOf("right")!==-1) {
    ship.setRotation(0.02);
  }
  else if(mostrecentword.indexOf("left")!==-1) {
    ship.setRotation(-0.02)
  }
  else if(mostrecentword.indexOf("stop")!==-1) {
    ship.setRotation(0);
    ship.boosting(false);
  }
  else if(mostrecentword.indexOf("go")!==-1) {
    ship.boosting(true);
  }
  else if(mostrecentword.indexOf("again")!==-1) {
    ship.shipLife = 100;
    ship.shipPoints = 0;
    asteroid = [];
    for ( var i = 0; i < 7; i++ ) {
      asteroid.push(new Asteroid());
    }
  }
}