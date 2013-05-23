define([
	'jquery'
], 
function ( $ ) {
	var keys = {
		up: { keyCode: 38, isDown: false },
		left: { keyCode: 37, isDown: false },
		right: { keyCode: 39, isDown: false },
		down: { keyCode: 40, isDown: false },
		space: { keyCode: 32, isDown: false },
		reset: { keyCode: 82, isDown: false }
	};

	var keyDown = function(e) {
		switch( e.keyCode ) {
			case keys.up.keyCode:
				keys.up.isDown = true;
				break;
			case keys.down.keyCode:
				keys.down.isDown = true;
				break;
			case keys.left.keyCode:
				keys.left.isDown = true;
				break;
			case keys.right.keyCode:
				keys.right.isDown = true;
				break;
			case keys.reset.keyCode:
				keys.reset.isDown = true;
				break;
			case keys.space.keyCode:
				keys.space.isDown = true;
				e.preventDefault();
				break;
		}
		//e.preventDefault();
	};
	keyDown = keyDown.bind( this );
	$(document.body).keydown( keyDown );
	
	var keyUp = function(e) {
		switch( e.keyCode ) {
			case keys.up.keyCode:
				keys.up.isDown = false;
				break;
			case keys.down.keyCode:
				keys.down.isDown = false;
				break;
			case keys.left.keyCode:
				keys.left.isDown = false;
				break;
			case keys.right.keyCode:
				keys.right.isDown = false;
				break;
			case keys.reset.keyCode:
				keys.reset.isDown = false;
				break;
			case keys.space.keyCode:
				keys.space.isDown = false;
				e.preventDefault();
				break;
		}
		//e.preventDefault();
	};
	keyUp = keyUp.bind( this );
	$(document.body).keyup( keyUp );
	
	return keys;
});
