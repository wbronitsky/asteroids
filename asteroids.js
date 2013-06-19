// MovingObject class

var Asteroids = (function(){
	function MovingObject(x, y, dx, dy, maxX, maxY){
		var that = this;
		that.x = x;
		that.y = y;
		that.dx = dx;
		that.dy = dy;
		that.maxX = maxX;
		that.maxY = maxY;
	}

	MovingObject.prototype.updatePos = function(){
		var that = this;
		that.x = (that.x + that.dx) % that.maxX;
		that.y = (that.y + that.dy) % that.maxY;
		that.x = that.x < 0 ? that.maxX : that.x;
		that.y = that.y < 0 ? that.maxY : that.y;
	}

	MovingObject.prototype.offScreen = function(xdim, ydim){
		var that = this;
		return that.x >= xdim || that.y >= ydim ||
				that.x < 0 || that.y < 0;
	}

	// Asteroid class

	function Asteroid(x, y, dx, dy){
		MovingObject.apply(this, arguments);
		this.radius = 20;
	}
	Asteroid.prototype = new MovingObject();

	Asteroid.randomAsteroid = function (maxX, maxY, maxD){
		return new Asteroid(
			maxX * Math.random(),
			maxY * Math.random(),
			plusOrMinus() * maxD * Math.random(),
			plusOrMinus() * maxD * Math.random(),
			maxX,
			maxY
			);
	};

	Asteroid.prototype.draw = function(ctx) {
		var that = this;

		ctx.fillStyle = "blue";
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


	// Ship class

	function Ship(x, y, dx, dy, maxX, maxY){
		MovingObject.apply(this, arguments);
		this.angle = 3 * Math.PI/2;
	};
	Ship.prototype = new MovingObject();

	Ship.prototype.draw = function(ctx) {
		var that = this;

		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.arc(
			that.x,
			that.y,
			10,
			Math.PI * (5/4) + that.angle,
			Math.PI * (3/4) + that.angle,
			false
		);

		ctx.fill();
	};


	Ship.prototype.isHit = function(asteroids) {
		var that = this;
		var shipRadius = 10; // Math.pow(2 * Math.pow(12.5, 2), 0.5);
		var ax, ay, distance, sumOfRadii;

		return _.any(asteroids, function(asteroid) {
			ax = asteroid.x;
			ay = asteroid.y;
			var distance = Math.pow(
				(Math.pow((ax - that.x), 2) + Math.pow((ay - that.y), 2)),
				0.5
			);

			sumOfRadii = asteroid.radius + shipRadius;

			return distance < sumOfRadii;
		});
	};

	Ship.prototype.power = function(angle) {
		var that = this;
		that.dx += Math.cos(angle)/500;
		that.dy += Math.sin(angle)/500;
	};

	Ship.prototype.rotate = function(angle) {
		var that = this;
		that.angle += angle;
	};

	Ship.prototype.fireBullet = function(bulletArray) {
		var that = this;
		var bullet = new Bullet(that);
		bulletArray.push(bullet);
	};

	//Bullet class

	function Bullet(ship) {
		var that = this;
		that.angle = ship.angle;
		that.x = ship.x;
		that.y = ship.y;
		that.dx = ship.dx + Math.cos(that.angle)*10;
		that.dy = ship.dy + Math.sin(that.angle)*10;
		that.maxX = ship.maxX;
		that.maxY = ship.maxY;
	}
	Bullet.prototype = new MovingObject();

	Bullet.prototype.draw = function(ctx) {
		var that = this;

		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(
			that.x,
			that.y,
			2,
			0,
			2 * Math.PI,
			false
		);

		ctx.fill();
	};

	Bullet.prototype.updatePos = function(){
		var that = this;
		that.x = (that.x + that.dx);
		that.y = (that.y + that.dy);
	};

	Bullet.prototype.isHit = function(asteroids, game) {
		var that = this;
		var bulletRadius = 2;
		var ax, ay, distance, sumOfRadii;

		_.each(asteroids, function(asteroid, idx) {
			ax = asteroid.x;
			ay = asteroid.y;
			var distance = Math.pow(
				(Math.pow((ax - that.x), 2) + Math.pow((ay - that.y), 2)),
				0.5
			);

			sumOfRadii = asteroid.radius + bulletRadius;

			if (distance < sumOfRadii) {
				if (asteroid.radius > 5){
					_.times(3, function(){
						var oldAstRadius = asteroid.radius
						var distance = Math.random();
						var ast = new Asteroid(
																	 asteroid.x + Math.cos(distance) * 10,
																	 asteroid.y + Math.sin(distance) * 10,
																 	 asteroid.dx * 2 * Math.random(),
																 	 asteroid.dy * 2 * Math.random(),
																 	 game.xDim,
																 	 game.yDim);
						ast.radius = oldAstRadius/2;
						game.asteroids.push(ast);
						console.log(game.asteroids.length);
					})
				};
				game.points += 10;
				delete asteroids[idx];
				return true;
			};
		});
		return false;
	};


	// Game class

	function Game(xDim, yDim, numAsteroids){
		var that = this;
		var maxD = 2;
		that.points = 0;

		that.xDim = xDim;
		that.yDim = yDim;

		that.asteroids = [];
		that.bullets = [];
		for (var i = 0; i < numAsteroids; i++){
			that.asteroids.push(Asteroid.randomAsteroid(xDim, yDim, maxD));
		};

		that.ship = new Ship(xDim/2, yDim/2, 0, 0, xDim, yDim);
	};

	Game.prototype.update = function() {
		var that = this;

		_.each(that.asteroids, function(asteroid){
			asteroid.updatePos();
		});
		that.ship.updatePos();
		_.each(that.bullets, function(bullet){
			bullet.updatePos();
		});
	};

	Game.prototype.draw = function(ctx) {
		var that = this;
		ctx.clearRect(0, 0, that.xDim, that.yDim);

		ctx.fillStyle = "white";
		ctx.font = "bold 18px Futura";
		ctx.fillText("" + that.points, 10, 20);
		that.ship.draw(ctx);
		_.each(that.asteroids, function(asteroid) {
			// console.log(asteroid);
			asteroid.draw(ctx);
		});
		_.each(that.bullets, function(bullet) {
			bullet.draw(ctx);
		});
	};

	Game.prototype.start = function(canvas) {
		var ctx = canvas.getContext('2d');

		var that = this;
		var loop = window.setInterval(function (){
			// Key bindinds
			key('up', function(event, handler){
				that.ship.power(that.ship.angle);
			});
			key('right', function(event, handler){
				that.ship.rotate(0.003);
			});
			key('left', function(event, handler){
				that.ship.rotate(-0.003);
			});
			key('space', function(event, handler){
				that.ship.fireBullet(that.bullets);
			});

			_.each(that.bullets, function(bullet, idx) {
				if (bullet.offScreen(that.xDim, that.yDim) ||
						bullet.isHit(that.asteroids, that)){
					delete that.bullets[idx];
				};
			});
			that.update();
			// _.each(that.asteroids, function(asteroid, idx, list){
			// 	if (asteroid.offScreen(that.xDim, that.yDim)){
			// 		delete that.asteroids[idx];
			// 	};
			// });
			if (that.ship.isHit(that.asteroids)) {
				clearInterval(loop);
				alert(":::GAME OVER:::");
				console.log("You've been hit!")
			};
			if (_.all(that.asteroids, function(asteroid){asteroid === null})) {
				clearInterval(loop);
				alert("YOU WIN");
				console.log("Winner")
			}
			that.draw(ctx);
		}, 32);
	};

	var plusOrMinus = function (){
		if (Math.random() > .5){
			return 1;
		} else {
			return -1;
		};
	};

	return {
		Asteroid: Asteroid,
		Game: Game
	};
})();


var canvas = document.getElementById('canvas_id');
canvas.style.backgroundColor = "black";
new Asteroids.Game(500, 375, 10).start(canvas);

