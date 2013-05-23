define([
	'vendor/box2d',
	'lib/clockwise',
	'lib/determinant',
	'lib/userData'
	], function ( Box2D, clockwise, det, UserData ) {
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

	return function splitObj(bodyToSplit, point1, point2, world ) {
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

		for ( var i = 0; i < vertices.length; i++ ) {
			d = det( pointA.x, pointA.y, pointB.x, pointB.y, vertices[i].x, vertices[i].y );

			if ( d > 0 ) {
				shape1Vertices.push( vertices[i].Copy() );
			} else {
				shape2Vertices.push( vertices[i].Copy() );
			}
		}

		shape1Vertices = clockwise( shape1Vertices );
		shape2Vertices = clockwise( shape2Vertices );

		var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.userData = new UserData();
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
	};
});