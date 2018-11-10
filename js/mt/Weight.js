(function(w) {
	function Weight() {
	}
	Weight.prototype = {
		weight0 : [ '1.0', '2.0','3.0','4.0','5.0' ],
        weight1 : [ '1.0', '2.0','3.0','4.0','5.0' ],
        weight2 : [ '1.0', '2.0','3.0','4.0','5.0' ],
		$ : function(o) {
      console.log(o);
      if (typeof o == 'object') {
				o = o.value;
			}
			if (typeof o == 'string') {
				o = this[o];
			}
			if (typeof o == 'undefined') {
				o = this.weight0;
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
	w.weight = new Weight();
})(window);
