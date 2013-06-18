// MovingObject class

var Asteroids = (function(){
	function MovingObject(x, y, dx, dy){
		var that = this;
		that.x = x;
		that.y = y;
		that.dx = dx;
		that.dy = dy;
	}

	MovingObject.prototype.updatePos = function(){
		var that = this;
		that.x = that.x + that.dx;
		that.y = that.y + that.dy;
	}

	MovingObject.prototype.offScreen = function(xdim, ydim){
		var that = this;
		return that.x >= xdim || that.y >= ydim ||
				that.x < 0 || that.y < 0;
	}

	// Asteroid class

	function Asteroid(x, y, dx, dy){
		MovingObject.apply(this, arguments);
		this.radius = 10;
	}
	Asteroid.prototype = new MovingObject;

	Asteroid.randomAsteroid = function (maxX, maxY, maxD){
		return new Asteroid(
			maxX * Math.random(),
			maxY * Math.random(),
			maxD * Math.random(),
			maxD * Math.random()
			);
	};

	Asteroid.prototype.draw = function(ctx) {
		var that = this;

		ctx.fillStyle = "orange";
		ctx.beginPath();
		ctx.arc(
			that.x,
			that.y,
			that.radius,
			0,
			2 * Math.PI,
			false
		);

		ctx.fill();
	};


	// Game class

	function Game(xDim, yDim, numAsteroids){
		var that = this;
		var maxD = 10;

		that.xDim = xDim;
		that.yDim = yDim;

		that.asteroids = [];
		for (var i = 0; i < numAsteroids; i++){
			that.asteroids.push(Asteroid.randomAsteroid(xDim, yDim, maxD));
		}
	}

	Game.prototype.update = function() {
		var that = this;

		_.each(that.asteroids, function(asteroid){
			asteroid.updatePos();
		});
	};

	Game.prototype.draw = function(ctx) {
		var that = this;
		ctx.clearRect(0, 0, that.xDim, that.yDim);

		_.each(that.asteroids, function(asteroid) {
			console.log(asteroid);
			asteroid.draw(ctx);
		});
	};

	// Write Game.prototype.start(canvas)
	Game.prototype.start = function(canvas) {
		var ctx = canvas.getContext('2d');

		var that = this;
		window.setInterval(function (){
			that.update();
			_.each(that.asteroids, function(asteroid, idx, list){
				if (asteroid.offScreen(that.xDim, that.yDim)){
					delete that.asteroids[idx];
				};
			});
			that.draw(ctx);
		}, 32);
	};

	return {
		Asteroid: Asteroid,
		Game: Game
	}
})();


var canvas = document.getElementById('canvas_id');
new Asteroids.Game(500, 375, 1).start(canvas);

// var game = new Game(500, 375, 10).start(canvas);











// @all To clear up some confusion: the only element in your html page will be a <canvas> element with a width and a height. You can use javascript (document.getElementById('myCanvasElsId')) to grab the canvas element so you can get its context and all the other good stuff. The rest of your application will happen in javascript and interact with the canvas element (no jQuery involved)

// Game.prototype.start = function (canvasEl) {
//   // get a 2d canvas drawing context. The canvas API lets us call
//   // a `getContext` method on a cnvas DOM element.
//   var ctx = canvasEl.getContext("2d");
//
//   // render at 60 FPS
//   var that = this;
//   window.setInterval(function () {
//     that.render(ctx);
//   }, 1000);
// };
//
// $(function () {
//   var canvas = $("<canvas width='" + 500 +
//                  "' height='" + 500 + "'></canvas>");
//   $('body').append(canvas);
//
//   // `canvas.get(0)` unwraps the jQuery'd DOM element;
//   new Circles.Game(500, 500, 10).start(canvas.get(0));
// });