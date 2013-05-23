requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
		vendor: '../vendor',
        lib: '../lib'
    },
    shim: {
		'vendor/underscore-min': {
            exports: '_'
        },
        'vendor/jquery-min': {
			exports: '$'
        },
        'vendor/box2d': {
			exports: 'Box2D'
        }
    }
});

// Start the main app logic.
requirejs([ 'vendor/underscore-min', 'vendor/jquery-min', 'app' ],
function( _, $, App ) {
	$(function () {
		App();
	});
});
