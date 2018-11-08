(function(editable) {
	// console.log(arguments);
	let diagram = myDiagram;// go diagram
	diagram.addDiagramListener("ObjectDoubleClicked", function(e) {
		if (editable) {
			dialog.set(e.subject.part);
		} else {
			dialog.get(e.subject.part);
		}
	});
	diagram.modelData = function() {
		let o = JSON.parse(this.model.toJson());
    delete o['class'];
		return o;
	};
	diagram.modelJson = function() {
		return JSON.stringify(this.modelData());
	};
}).push(true);
