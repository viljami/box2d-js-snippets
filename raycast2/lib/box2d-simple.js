define([
	'box2d'
], function ( ) {
	console.log( 'loading box2d-simple... ', Box2D);
	/*
	  Goal is to make box2D fast to add to a limejs project.
	  21.12.2012
	*/
	var b2World = Box2D.Dynamics.b2World
	, b2Vec2 = Box2D.Common.Math.b2Vec2
	, b2AABB = Box2D.Collision.b2AABB
	, b2BodyDef = Box2D.Dynamics.b2BodyDef
	, b2Body = Box2D.Dynamics.b2Body
	, b2FixtureDef = Box2D.Dynamics.b2FixtureDef
	, b2Fixture = Box2D.Dynamics.b2Fixture
	, b2MassData = Box2D.Collision.Shapes.b2MassData
	, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
	, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
	, b2DebugDraw = Box2D.Dynamics.b2DebugDraw
	, b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef
	, b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
	, b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef
	, b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
	, b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef
	, b2WorldManifold = Box2D.Collision.b2WorldManifold;

	var box2d = {
		b2Vec2: b2Vec2,
		b2WorldManifold: b2WorldManifold,
		
		world: null,
		scale: 32,
		context: null,
		_ballFixDef: null,
		_boxFixDef: null,
		_polyFixDef: null,
		_bodyDef: null,
		init: function ( options ) {
			// TODO: options check
			if(!options) {
				options = {
					context: document.getElementsByTagName('canvas')[0].getContext('2d'),
					debug: true,
					scale: 32,
					alpha: 0.3,
					sleep: true,
					gravity: {x: 0, y: 0 }
				};
			}
			this.context = options.context;
			box2d.world = new b2World(
				new b2Vec2(options.gravity.x, options.gravity.y )       // gravity
				, options.sleep                  // allow sleep
			);

			box2d.world.SetContactListener( new box2d._contactListener() );

			box2d.scale = options.scale;
			
			box2d._boxFixDef = new b2FixtureDef();	// box  fixture definition
			box2d._boxFixDef.shape = new b2PolygonShape();
			box2d._polyFixDef = new b2FixtureDef();
			box2d._polyFixDef.shape = new b2PolygonShape();
			box2d._ballFixDef = new b2FixtureDef();	// ball fixture definition
			box2d._ballFixDef.shape = new b2CircleShape();
			box2d._boxFixDef.density = box2d._ballFixDef.density = box2d._polyFixDef.density = 1;

			box2d._bodyDef = new b2BodyDef();
			box2d._bodyDef.type = b2Body.b2_staticBody;



			if (options.debug) {
				var debugDraw = new Box2D.Dynamics.b2DebugDraw();
				debugDraw.SetSprite( options.context );
				debugDraw.SetDrawScale( options.scale );
				debugDraw.SetFillAlpha( options.alpha );
				debugDraw.SetLineThickness( 1.0 );
				debugDraw.SetFlags( b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit );
				box2d.world.SetDebugDraw( debugDraw );
			}

			return this.world;
		},
		step: function ( dt ) {
			box2d.world.Step( dt, 3);
			box2d.world.ClearForces();
		},
		create: {
			circle: function ( o ) {
				box2d._ballFixDef.shape.SetRadius( o.r );
				box2d._ballFixDef.density = o.density || 1;
				box2d._bodyDef.position.Set( o.x, o.y );

				if( !o ) {
					box2d._bodyDef.type = b2Body.b2_dynamicBody;
				} else {
					if( !o.static ) {
						box2d._bodyDef.type = b2Body.b2_dynamicBody
					} else {
						box2d._bodyDef.type = b2Body.b2_staticBody;
					}
				}

				var body = box2d.world.CreateBody( box2d._bodyDef );
				body.CreateFixture( box2d._ballFixDef );
								box2d._bodyDef.position.Set( o.x + o.r, o.y + o.r);
				body.CreateFixture( box2d._ballFixDef );
				
				
				body.beginContact = null;

				return body;
			},
			box: function( o ) {
				box2d._boxFixDef.shape.SetAsBox( o.w, o.h );
				box2d._bodyDef.position.Set( o.x, o.y );

				if( !o ) {
					box2d._bodyDef.type = b2Body.b2_dynamicBody;
				} else {
					if( !o.static ) {
						box2d._bodyDef.type = b2Body.b2_dynamicBody
					} else {
						box2d._bodyDef.type = b2Body.b2_staticBody;
					}
				}

				var body = box2d.world.CreateBody( box2d._bodyDef );
				body.CreateFixture( box2d._boxFixDef );
				
				body.beginContact = null;
				
				return body;
			},
			polygon: function( o ) {
				box2d._polyFixDef.shape = new b2PolygonShape(); // array of b2Vec2s
				box2d._polyFixDef.shape.SetAsArray( o.vertices );
				box2d._bodyDef.position.Set( o.x, o.y );

				if( !o ) {
					box2d._bodyDef.type = b2Body.b2_dynamicBody;
				} else {
					if( !o.static ) {
						box2d._bodyDef.type = b2Body.b2_dynamicBody;
					} else {
						box2d._bodyDef.type = b2Body.b2_staticBody;
					}
				}

				var body = box2d.world.CreateBody( box2d._bodyDef );
				body.CreateFixture( box2d._polyFixDef );
				
				body.beginContact = null;
				
				return body;
			},
			joint: function ( o ) {
				var jointDef = new b2PrismaticJointDef();

				jointDef.Initialize(o.bodyA, o.bodyB, new b2Vec2(0,0), new b2Vec2(0,0) );
				jointDef.lowerTranslation = -5.0;
				jointDef.upperTranslation = 2.5;
				jointDef.enableLimit = true;
				jointDef.maxMotorForce = 1.0;
				jointDef.motorSpeed = 0.0;
				jointDef.enableMotor = false;
				jointDef.collideConnected = o.collide || false;
				box2d.world.CreateJoint( jointDef );
			},
			distanceJoint: function ( o ) {
				var jointDef = new b2DistanceJointDef();

				jointDef.Initialize(o.bodyA, o.bodyB, o.centerA, o.centerB );
				/*
				jointDef.lowerTranslation = 0.0;
				jointDef.upperTranslation = 0.0;
				jointDef.enableLimit = true;
				jointDef.maxMotorForce = 0.0;
				jointDef.motorSpeed = 0.0;
				jointDef.enableMotor = false;
				*/
				jointDef.frequencyHz = 0.0;
				jointDef.dampingRatio = 0.0;
				jointDef.collideConnected = o.collide || false;
				box2d.world.CreateJoint( jointDef );
			},
			revoluteJoint: function ( o ) {
				var jointDef = new b2RevoluteJointDef();

				jointDef.Initialize(o.bodyA, o.bodyB, o.centerA, o.centerB );
				//jointDef.lowerTranslation = -5.0;
				//jointDef.upperTranslation = 2.5;
				jointDef.lowerAngle = o.lowerAngle || -0.25 * Math.PI;
				jointDef.upperAngle = o.upperAngle || 0.25 * Math.PI;
				jointDef.enableLimit = true;
				jointDef.maxMotorForce = 10.0;
				jointDef.maxMotorTorque = 10.0;
				jointDef.motorSpeed = -10.0;
				jointDef.enableMotor = true; //false;
				jointDef.collideConnected = o.collide || false;;
				box2d.world.CreateJoint( jointDef );
			}
		},
		_contactListener: function () {
			this.BeginContact = function (contact) {
				contact.GetFixtureA().GetBody().beginContact = contact;
				contact.GetFixtureB().GetBody().beginContact = contact;
			};
			this.EndContact = function (contact) {
				if( !contact.GetFixtureA().GetBody().ground && !contact.GetFixtureB().GetBody().ground ) {
					contact.GetFixtureA().GetBody().endContact = true;
					contact.GetFixtureB().GetBody().endContact = true;
				}
			};
			this.PreSolve = function (contact, oldManifold) {};
			this.PostSolve = function (contact, impulse) {};
		}
	};
	var f= true;
	/*
	 this.draw = function() {
		 ctx.save();
		 ctx.translate(this.x * SCALE, this.y * SCALE);
		 ctx.rotate(this.angle);
		 ctx.translate(-(this.x) * SCALE, -(this.y) * SCALE);
		 ctx.fillStyle = this.color;
		 ctx.fillRect(
			 (this.x-(this.width / 2)) * SCALE,
			 (this.y-(this.height / 2)) * SCALE,
			 this.width * SCALE,
			 this.height * SCALE
		 );
		 ctx.restore();
	 };
		*/
		
	return box2d;
});
