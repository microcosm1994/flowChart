(function(w) {
	function Colors() {
	}
	Colors.prototype = {
		'0.0' : [ '#FF0000','#00FF00'],
		$ : function(o) {
      console.log(o);
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
