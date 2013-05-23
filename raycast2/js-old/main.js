/**
 *  This file contains 
 *    - all the configuration of the whole application;
 */ 
requirejs.config({
	//baseUrl: 'js/',
    paths: {		
		box2d: '../../lib/box2d',		
		'box2d-simple': '../../lib/box2d-simple',
        jquery: '../../lib/jquery-min',
        lib: '../../lib'
    },
    shim: {
		 '../../lib/backbone-min': {
            deps: ['../../lib/underscore', '../../lib/jquery-min'],
            exports: 'Backbone'
        },
        '../../lib/underscore': {
            exports: '_'
        },
        '../../lib/box2d': { 
			exports: 'Box2D' 
        },
        '../../lib/box2d-simple': { 
            deps: [ '../../lib/box2d' ],
            exports: 'b2'
        }
	}
});

// Start the main app logic.
requirejs([
	'jquery',
	'app',
],
function   ( $, App ) {
	$('#enableJavaScript').remove();
    App.init();
});
