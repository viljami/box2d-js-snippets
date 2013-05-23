define([
	'vendor/box2d',
	'lib/splitPolygon',
	'lib/userData'
	], function ( Box2D, splitObj, UserData ) {
	return function () {
		var b2Vec2 = Box2D.Common.Math.b2Vec2,
			b2AABB = Box2D.Collision.b2AABB,
			b2BodyDef = Box2D.Dynamics.b2BodyDef,
			b2Body = Box2D.Dynamics.b2Body,
			b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
			b2Fixture = Box2D.Dynamics.b2Fixture,
			b2World = Box2D.Dynamics.b2World,
			b2MassData = Box2D.Collision.Shapes.b2MassData,
			b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
			b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
			b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
			b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

		var world = new b2World(
			new b2Vec2(0, 10),	//gravity
			true                 //allow sleep
		);

		var fixDef = new b2FixtureDef();
		fixDef.density = 1.0;
		fixDef.friction = 0.5;
		fixDef.restitution = 0.2;

		var bodyDef = new b2BodyDef();

		//create ground
		bodyDef.type = b2Body.b2_staticBody;
		fixDef.shape = new b2PolygonShape();
		fixDef.shape.SetAsBox(20, 2);
		bodyDef.position.Set(10, 400 / 30 + 1.8);
		world.CreateBody(bodyDef).CreateFixture(fixDef);
		bodyDef.position.Set(10, -1.8);
		world.CreateBody(bodyDef).CreateFixture(fixDef);
		fixDef.shape.SetAsBox(2, 14);
		bodyDef.position.Set(-1.8, 13);
		world.CreateBody(bodyDef).CreateFixture(fixDef);
		bodyDef.position.Set(21.8, 13);
		world.CreateBody(bodyDef).CreateFixture(fixDef);

		//create some objects
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.Set( 8, 4);
		bodyDef.userData = new UserData();
		fixDef.shape = new b2PolygonShape();
		fixDef.shape.SetAsArray([new b2Vec2(1, -1), new b2Vec2(1, 1), new b2Vec2(-1, 1), new b2Vec2(-1, -1)]);
		world.CreateBody(bodyDef).CreateFixture( fixDef );

		//setup debug draw
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(document.getElementById( "canvas" ).getContext( "2d" ));
		debugDraw.SetDrawScale( 30.0 );
		debugDraw.SetFillAlpha( 0.5 );
		debugDraw.SetLineThickness( 1.0 );
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		world.SetDebugDraw(debugDraw);

		window.setInterval(update, 1000 / 60);

		//mouse

		var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
		var canvasPosition = getElementPosition(document.getElementById("canvas"));

		var p1 = -1,
			p2 = -1,
			splits = {};

		function mouseStart ( e ) {
			console.log( "Start: ", e );
			var mouseX = (e.clientX - canvasPosition.x) / 30,
				mouseY = (e.clientY - canvasPosition.y) / 30;
			p1 = new b2Vec2( mouseX, mouseY );
		}

		function mouseEnd ( e ) {
			console.log( "End: ", e );
			var mouseX = e.clientX / 30,
				mouseY = e.clientY / 30;
			p2 = new b2Vec2( mouseX, mouseY );
			console.log( "p1: ", p1, "p2: ", p2 );
			// One enter point is got at a time. So we need to get point both ways
			world.RayCast( rayCastCallback, p1, p2 );
			world.RayCast( rayCastCallback, p2, p1 );
		}

		function rayCastCallback(fixture, point, normal, fraction) {
			// Only split the object when there is enough points to split it
			if( fixture.GetBody().GetUserData() ) {
				console.log( 'Splits + userdata', splits, fixture.GetBody().GetUserData() );
				if( !_.isObject( splits[ fixture.GetBody().GetUserData().getId() ]) ) {
					splits[ fixture.GetBody().GetUserData().getId() ] = {
						enterPoint1: point.Copy()
					};
				} else {
					splitObj( fixture.GetBody(), splits[ fixture.GetBody().GetUserData().getId() ].enterPoint1.Copy(), point.Copy(), world );
				}
			}
			return 0;
		}

		document.addEventListener("mousedown", mouseStart);
		document.addEventListener("mouseup", mouseEnd);

		var ctx = document.getElementById("canvas").getContext("2d");

		function update() {
			world.Step(1 / 60, 10, 10);
			world.DrawDebugData();
			world.ClearForces();

			if( p1 !== null && p2 !== null) {
				ctx.beginPath();
				ctx.strokeStyle = '#ff0000';
				ctx.moveTo( p1.x *30, p1.y *30);
				ctx.lineTo( p2.x *30, p2.y *30);
				ctx.stroke();
				ctx.closePath();
			}
		}

		//helpers

		//http://js-tut.aardon.de/js-tut/tutorial/position.html
		function getElementPosition(element) {
			var elem=element, tagname="", x=0, y=0;

			while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
				y += elem.offsetTop;
				x += elem.offsetLeft;
				tagname = elem.tagName.toUpperCase();

				if(tagname == "BODY")
					elem=0;

				if(typeof(elem) == "object") {
					if(typeof(elem.offsetParent) == "object")
						elem = elem.offsetParent;
					}
				}

			return {x: x, y: y};
		}
	};
});
