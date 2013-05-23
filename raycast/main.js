function init() {
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
	fixDef.shape = new b2PolygonShape();
	fixDef.shape.SetAsArray([new b2Vec2(1,-1), new b2Vec2(1,1), new b2Vec2(-1,1), new b2Vec2(-1,-1)]);
	world.CreateBody(bodyDef).CreateFixture(fixDef);

	/*
	for(var i = 0; i < 10; ++i) {
	if(Math.random() > 0.5) {
	   fixDef.shape = new b2PolygonShape;
	   fixDef.shape.SetAsArray( [ new b2Vec2(0,0),new b2Vec2(1,0),new b2Vec2(0,1) ]
		 //    Math.random() + 0.1 //half width
		 // ,  Math.random() + 0.1 //half height
	   );
	} else {
	   fixDef.shape = new b2CircleShape(
		  Math.random() + 0.1 //radius
	   );
	}
	bodyDef.position.x = Math.random() * 10;
	bodyDef.position.y = Math.random() * 10;
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	}
	*/

	//setup debug draw
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
	debugDraw.SetDrawScale(30.0);
	debugDraw.SetFillAlpha(0.5);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);

	window.setInterval(update, 1000 / 60);

	//mouse

	var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
	var canvasPosition = getElementPosition(document.getElementById("canvas"));

	var p1 = -1,
		p2 = -1,
		splits = [];

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
		console.log( "Callback: ", point, fraction );
		// Only split the object when there is enough points to split it
		var index = -1;
		for( var i = 0; i < splits.length; i++ ) {
			if( splits[ i ].fixture === fixture ) {
				index = i;
				break;
			}
		}
		if( index != -1 ) {
			splitObj( splits[ index ].fixture.GetBody(), splits[ index ].enterPoints[0].Copy(), point.Copy() );
			splits.splice( index, 1 );
		} else {
			splits.push( {
				fixture: fixture,
				enterPoints: [ point.Copy() ]
			});
		}
		return 0;
	}

	function splitObj(bodyToSplit, point1, point2 ) {
		var originalFixture = bodyToSplit.GetFixtureList(),
			polygonShape = originalFixture.GetShape(),
			vertices = polygonShape.GetVertices(),
			vertexCount = polygonShape.GetVertexCount(),
            shape1Vertices = [], // [ b2Vec2 ] 
            shape2Vertices = [], // [ b2Vec2 ] 
            //var origUserData:userData=sliceBody.GetUserData().textureData,origUserDataId:int=origUserData.id,d:Number;
            newPolygonShape = new b2PolygonShape(),
            body,
            // RayCast gives points in World coordinates,
            // they need to be hanged to local for vertices points
            pointA = bodyToSplit.GetLocalPoint( point1 ),
            pointB = bodyToSplit.GetLocalPoint( point2 );

        shape1Vertices.push(pointA.Copy(), pointB.Copy());
        shape2Vertices.push(pointA.Copy(), pointB.Copy());

		console.log("Vertices: ", vertices, "re: ", arrangeClockwise( vertices ));

		for ( var i = 0; i < vertices.length; i++ ) {
			d = det( pointA.x, pointA.y, pointB.x, pointB.y, vertices[i].x, vertices[i].y );

			if ( d > 0 ) {
				shape1Vertices.push( vertices[i].Copy() );
			} else {
				shape2Vertices.push( vertices[i].Copy() );
			}
		}

		shape1Vertices = arrangeClockwise( shape1Vertices );
		shape2Vertices = arrangeClockwise( shape2Vertices );

		var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position = bodyToSplit.GetPosition();
        var fixtureDef = new b2FixtureDef();
        fixtureDef.density = originalFixture.GetDensity();
        fixtureDef.friction = originalFixture.GetFriction();
        fixtureDef.restitution = originalFixture.GetRestitution();

        world.DestroyBody( bodyToSplit );
        // Should test the area of the splitted ones, that they are big enough
        polygonShape.SetAsArray(shape1Vertices);
		fixtureDef.shape = polygonShape;
		//bodyDef.userData={assetName:"debris",textureData:new userData(origUserDataId,shape1Vertices,origUserData.texture)};
		//addChild(bodyDef.userData.textureData);
		//enterPointsVec[origUserDataId]=null;
		body = world.CreateBody( bodyDef );
		body.SetAngle( bodyToSplit.GetAngle() );
		body.CreateFixture( fixtureDef );

		polygonShape.SetAsArray(shape2Vertices);
		fixtureDef.shape = polygonShape;
		//bodyDef.userData={assetName:"debris",textureData:new userData(origUserDataId,shape1Vertices,origUserData.texture)};
		//addChild(bodyDef.userData.textureData);
		//enterPointsVec[origUserDataId]=null;
		body = world.CreateBody( bodyDef );
		body.SetAngle( bodyToSplit.GetAngle() );
		body.CreateFixture( fixtureDef );
	}

	function arrangeClockwise( array ) {
		// The algorithm is simple: 
		// First, it arranges all given points in ascending order, according to their x-coordinate.
		// Secondly, it takes the leftmost and rightmost points (lets call them C and D), and creates tempVec, where the points arranged in clockwise order will be stored.
		// Then, it iterates over the vertices vector, and uses the det() method I talked about earlier. It starts putting the points above CD from the beginning of the vector, and the points below CD from the end of the vector. 
		var n = array.length,
			d = null,
			i1 = 1,
			i2 = n-1;
		var tempVec = [],C,D;
		array.sort( comp1 );
		tempVec[0] = array[0];
		C = array[0];
		D = array[n-1];
		for (var i = 1; i < n-1; i++) {
			d = det( C.x, C.y, D.x, D.y, array[i].x, array[i].y );
			if ( d < 0 ) {
				tempVec[i1++]= array[i];
			}
			else {
				tempVec[i2--]= array[i];
			}
		}
		tempVec[i1] = array[n-1];
		return tempVec;
	}

	function comp1(a, b) {
		// This is a compare function, used in the arrangeClockwise() method - a fast way to arrange the points in ascending order, according to their x-coordinate.
		if ( a.x > b.x ) {
			return 1;
		}
		else if ( a.x < b.x ) {
			return -1;
		}
		return 0;
	}
	function comp2(a, b) {
		// This is a compare function, used in the arrangeClockwise() method - a fast way to arrange the points in ascending order, according to their x-coordinate.
		if ( a.x < b.x ) {
			return 1;
		}
		else if ( a.x > b.x ) {
			return -1;
		}
		return 0;
	}
	/**
	 * Returns Determinant Number
	 */
	function det(x1, y1, x2, y2, x3, y3) {
            // This is a function which finds the determinant of a 3x3 matrix.
            // If you studied matrices, you'd know that it returns a positive number if three given points are in clockwise order, negative if they are in anti-clockwise order and zero if they lie on the same line.
            // Another useful thing about determinants is that their absolute value is two times the face of the triangle, formed by the three given points.
            return x1*y2+x2*y3+x3*y1-y1*x2-y2*x3-y3*x1;
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
}

