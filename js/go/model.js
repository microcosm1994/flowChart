(function(w, elementDefault) {
	function modelFromJson(diagram, model, Model) {
		// console.log(arguments);
		switch (typeof (model)) {
		case 'string':
			diagram.model = go.Model.fromJson(model);
			break;
		case 'object':
			if (!Model)
				Model = go.GraphLinksModel;
			diagram.model = go.GraphObject.make(Model, model);
			break;
		case 'undefined':
			let element = mt.$(elementDefault);
			if (element) {
				diagram.model = go.Model.fromJson(element.value);
			}
			break;
		default:
			console.log(model);
			return;
		}
		diagram.initialPosition = go.Point.parse(diagram.model.modelData.position);// load position
	}
	function prepareModel(diagram, model) {
		// console.log(arguments);
		diagram.weight = model.weight;
		delete model.weight;// Error: "Trying to set undefined property "weight" on object: GraphLinksModel"
		// console.log(diagram.weight);
		diagram.colors = model.colors;
		delete model.colors;// Error: "Trying to set undefined property "colors" on object: GraphLinksModel"
		// console.log(diagram.colors);
		let a = model.nodeDataArray;
		for (let i = 0; i < a.length; i++) {
			diagram.totalScore(a[i]);
		}
	}
	w.iniModelFromJson = function(diagram, model, Model) {
		// console.log(arguments);
		prepareModel(diagram, model);
		modelFromJson(diagram, model, Model);
	};
	w.setModelFromJson = function(diagram, model, Model) {
		// console.log(arguments);
		prepareModel(diagram, model);
		// FIXME Change not within a transaction: !d isTreeLeaf: 6 old: false new: true
		// diagram.startTransaction('setModelFromJson');
		modelFromJson(diagram, model, Model);
		// diagram.commitTransaction('setModelFromJson');
	};
	w.getModelToJson = function(diagram, element) {
		diagram.isModified = false;
		diagram.model.modelData.position = go.Point.stringify(diagram.position);// save position
		ret = diagram.modelJson();
		element = mt.$(element);
		if (!element) {
			element = mt.$(elementDefault);
		}
		if (element) {
			element.value = ret;
		}
		return ret;
	};
})(window, '#mySavedModel');
