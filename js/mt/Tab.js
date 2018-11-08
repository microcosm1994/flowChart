function Tab(a) {
	// console.log(arguments);
	// console.log(this);
	a = mt.$children(a);
	mt.assertFunction(this.on);
	mt.assertFunction(this.off);
	let t = this;
	t.a = [];
	let o;
	for (let i = a.length - 1; i >= 0; i--) {
		o = a[i];
		t.off(o);
		t.a.push(o);
	}
	if (o) {
		t.on(o);
		t.c = o;
	}
}
Tab.prototype = {
	click : function(dst) {
		let src = this;
		let len = Math.min(src.a.length, dst.a.length);
		for (let i = len - 1; i >= 0; i--) {
			(function(s, d) {
				mt._e('click', function() {
					src.tab(s);
					dst.tab(d);
				}, s);
			})(src.a[i], dst.a[i]);
		}
	},
	tab : function(o) {
		// console.log(arguments);
		// console.log(this);
		let t = this;
		if (mt.isNumber(o)) {// compatible with index number
			o = t.a[o];
		} else {
			o = mt.$(o);
		}
		if (t.c != o) {
			if (t.c) {
				t.off(t.c);
				t.c = null;
			}
			if (o) {
				t.on(o);
				t.c = o;
			}
		}
		return o;
	}
};
function TabCss(a, on, off) {
	this.css = {
		on : on ? on : 'on',
		off : off ? off : 'off'
	};
	Tab.call(this, a);
}
mt.ext(TabCss, Tab, {
	on : function(o) {
		o.className = this.css.on;
	},
	off : function(o) {
		o.className = this.css.off;
	}
});
function TabDisplay(a, display) {
	Tab.call(this, a);
}
mt.ext(TabDisplay, Tab, {
	on : function(o) {
		o.style.display = o.display;
	},
	off : function(o) {
		o.display = o.style.display;
		o.style.display = 'none';
	}
});