/**
 *  This file contains 
 *    - all the setup of the application
 */ 
define([
	'jquery',
	'game'
],
function   ( $, Game ) {
	console.log( "loading App..." );
	
	function onResize() {
		var canvas = $('#canvas')[0];
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	
	$(window).resize( onResize );
	
	return { 
		init: function () { 
			onResize();
			Game.init();
			Game.start();
		}
	};
});
