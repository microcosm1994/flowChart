(function(w) {
	Array.prototype.indexOf = function(e) {
		// console.log(arguments);
		let t = this;
		let i = t.length;
		while (i-- > 0) {
			if (t[i] === e) {
				return i;
			}
		}
		return -1;
	};
	Array.prototype.clear = function() {
		// console.log(arguments);
		this.splice(0, this.length);
	};
	let a = [];
	let f = [];
	Function.prototype.push = function() {
		// console.log(arguments);
		a.push(arguments);
		f.push(this);
	};
	mt._e('load', function() {
		while (a.length > 0) {
			f.shift().apply(w, a.shift());
		}
	});
})(window);