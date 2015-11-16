var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {preload: preload, create: create, update: update});

var ufo;
var cursors;
var fireBalls;
var askToContinue;

function preload() {
  game.load.image('ufo', 'assets/ufo.png');
  game.load.image('fire', 'assets/red_ball.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = "#FFFFFF";
  
  var textStyle = {font: "32px Arial", fill: "#000000", align: "center"};
  askToContinue = game.add.text(game.world.centerX-300, 32, '', textStyle); 
  
  ufo = game.add.sprite(game.world.width / 2, 550, 'ufo');
  ufo.anchor.setTo(0.5);

  game.physics.arcade.enable(ufo);
  ufo.body.collideWorldBounds = true;

  fireBalls = game.add.group();
  fireBalls.enableBody = true;
  fireBalls.physicsBodyType = Phaser.Physics.ARCADE;

  for(var i = 0; i < 15; i++) {
    var fireBall = fireBalls.create(game.world.randomX, Math.random() * 500, 'fire');
    fireBall.name = "ball" + i;
    buildFireBall(fireBall);
  }

  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  game.physics.arcade.overlap(ufo, fireBalls, collisionHandle, null, this);
  
  ufo.body.velocity.setTo(0);
  
  if(cursors.left.isDown) {
    ufo.body.velocity.x = -250;
  }
  else if(cursors.right.isDown) {
    ufo.body.velocity.x = 250;
  }
  
  if(cursors.up.isDown) {
    ufo.body.velocity.y = -250;
  }
  else if(cursors.down.isDown) {
    ufo.body.velocity.y = 250;
  }
  
  if(game.physics.arcade.isPaused && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      resetGame();
  }
}

var collisionHandle = function(ufo, fireBalls) {
  game.physics.arcade.isPaused = true;
  askToContinue.setText("Press space to continue");
}

var resetGame = function() {
  ufo.reset(game.world.centerX, 550);

  for(var i = 0; i < fireBalls.length; i++) {
    var fireBall = fireBalls.getAt(i);
    fireBall.reset(game.world.randomX, Math.random() * 500);
    buildFireBall(fireBall);
  }

  game.physics.arcade.isPaused = false;
  askToContinue.setText('');
}

var buildFireBall = function(fireBall) {
  fireBall.body.collideWorldBounds = true;
  fireBall.body.maxVelocity.setTo(200);
  fireBall.body.bounce.setTo(1);
  fireBall.angle = game.rnd.angle();
  game.physics.arcade.velocityFromAngle(fireBall.angle, 500, fireBall.body.velocity);
}
