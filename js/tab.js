(function() {
	let nav;
	let tab;
	function resize() {
		// console.log(mt.h());
		if (nav && tab) {
			tab.style.height = (mt.h() - nav.clientHeight) + 'px';
		}
	}
	mt._e('resize', resize);
	mt._e('load', function() {
		nav = mt.$('.tab1');
		let tab1;
		if (nav) {
			// console.log(nav);
			tab1 = new TabCss(nav, 'on', 'off');
			// console.log(tab1);
		}
		tab = mt.$('.tab2');
		let tab2;
		if (tab) {
			// console.log(tab);
			tab2 = new TabDisplay(tab);
			// console.log(tab2);
		}
		if (tab1 && tab2) {
			tab1.click(tab2);
		}
		resize();
	});
})();