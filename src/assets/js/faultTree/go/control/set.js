(function() {
	let diagram = myDiagram;
	diagram.updateNodeByKey = function(o) {
		o = o.data ? o.data : o;
		o = o.key ? o.key : o;
		o = this.findNodeForKey(o);
		this.startTransaction("start set");
		o.updateTargetBindings();
		this.commitTransaction("end set");
	};
	diagram.totalScore = function(o) {
		o = o.data ? o.data : o;
		let w = this.weight;
    o.score = o.score0 * w[0] / 100 + o.score1 * w[1] / 100 + o.score2 * w[2] / 100 + o.score3 * w[3] / 100;
	};
	diagram.updateLinkByData = function(o) {
		o = o.data ? o.data : o;
		o = this.findLinkForData(o);
		this.startTransaction("start set");
		o.updateTargetBindings();
		this.commitTransaction("end set");
	};
}).push(true);
