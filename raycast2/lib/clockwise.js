define([ 'lib/determinant' ], function ( det ) {
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

	return function arrangeClockwise( array ) {
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
	};
});