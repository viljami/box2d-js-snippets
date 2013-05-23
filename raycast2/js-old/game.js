/**
 *   This file contains
 *     - All the setup of the game
 */
define([
	'box2d-simple',
	'utils/gameLoop',
	'utils/controls',
],
function   ( b2, GameLoop, Controls ) {
	console.log( "loading Game..." );
	
	function updateGameObjects () {
		
	}
	function updatePhysics () {
		b2.step( GameLoop.getDeltaTime() );
	}
	function draw() {
		b2.world.DrawDebugData();
	}
	
	return { 
		init: function () { 
			console.log("initialize App... ") 
			b2.init({
                context: document.getElementsByTagName('canvas')[0].getContext('2d'),
                debug: true,
                scale: 32,
                alpha: 0.3,
                sleep: true,
                gravity: {x: 0, y: 5 }
            });
			
			b2.create.box({ x: 7, y: 10, w: 5, h:  0.1, static: true });
			b2.create.circle({ x: 6, y: 3, r: 1, static: false });
			b2.create.circle({ x: 6.05, y: 5, r: 0.5, static: false });
			
			for( var i = 0; i < 3; i++ ) {
				var sing = Math.random() < 0.5 ? -1 : 1;
				b2.create.polygon({
					x: 5 + i, y: 2, 
					vertices: [
						new b2.b2Vec2(0, 0),
						new b2.b2Vec2(0, sing ), 
						new b2.b2Vec2(sing, 0)],
					static: false
				});
			}
			
			b2.create.polygon({ 
				x: 6, y: 6, 
				vertices: [ 
					new b2.b2Vec2(0, 0),
					new b2.b2Vec2(4, 0), 
					new b2.b2Vec2(4, -1), 
					new b2.b2Vec2(0, -0.2), 
					new b2.b2Vec2(-4, -1), 
					new b2.b2Vec2(-4, 0)],
				static: true
			});
			
		} ,
		start: function () {
			GameLoop.run(function () {
				updateGameObjects();
				updatePhysics();
				draw();
			});
		}
	};
});
