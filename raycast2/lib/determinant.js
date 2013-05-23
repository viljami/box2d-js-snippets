define([], function () {
	return function det(x1, y1, x2, y2, x3, y3) {
		// This is a function which finds the determinant of a 3x3 matrix.
		// If you studied matrices, you'd know that it returns a positive number if three given points are in clockwise order, negative if they are in anti-clockwise order and zero if they lie on the same line.
		// Another useful thing about determinants is that their absolute value is two times the face of the triangle, formed by the three given points.
		return x1*y2+x2*y3+x3*y1-y1*x2-y2*x3-y3*x1;
	};
});