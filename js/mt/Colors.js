(function(w) {
	function Colors() {
	}
	Colors.prototype = {
		red : [ '#770000', '#600000' ],
		blue : [ '#00A9C9', '#006699' ],
		green : [ '#79C900', '#2BA142' ],
		$ : function(o) {
			if (typeof o == 'object') {
				o = o.value;
			}
			if (typeof o == 'string') {
				o = this[o];
			}
			if (typeof o == 'undefined') {
				o = this.red;
			}
			if (mt.isArray(o)) {
				// console.log(o);
				o = go.GraphObject.make(go.Brush, 'Linear', {
					0 : o[0],
					1 : o[1],
				});
			}
			return o;
		}
	};
	w.colors = new Colors();
})(window);