define([], function () {
	var count = 0;

	function getId() {
		return this.id;
	}

	return function () {
		this.id = count;
		count++;

		this.getId = getId.bind( this );
	};
});