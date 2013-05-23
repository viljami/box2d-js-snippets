define([

], function () {
	var isRunning = false;
		currentTime = 0,
		deltaTime = 0,
		_requestAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
                        window.oRequestAnimationFrame;
	
	function getCurrentTime() {
		return new Date().getTime()/1000.0;
	}
	
	function gameLoop ( deltaTime ) { 
	};
	
	function mainLoop() {
		var oldTime = currentTime;
		currentTime = getCurrentTime();
		deltaTime = currentTime - oldTime;
		deltaTime = Math.min(0.1, deltaTime);
		
		gameLoop(deltaTime);

		if ( isRunning ) {
			_requestAnimFrame(mainLoop);
		}
	}
	
	return {
		getDeltaTime: function () {
			return deltaTime;
		},
		getCurrenTime: function () {
			return currentTime;
		},
		stop: function () {
			isRunning = false;
		},
		run: function ( gameLoopFunction ) {
			isRunning = true;
			gameLoop = gameLoopFunction;
			mainLoop();
		}
	};
});
