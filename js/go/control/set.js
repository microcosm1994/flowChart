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
	diagram.updateLinkByData = function(o) {
		o = o.data ? o.data : o;
		o = this.findLinkForData(o);
		this.startTransaction("start set");
		o.updateTargetBindings();
		this.commitTransaction("end set");
	};
}).push(true);