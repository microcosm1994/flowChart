let myDiagram;
(function(w, cfg) {
	// console.log(arguments);
	let $ = go.GraphObject.make;
	let id = 'myDiagramDiv';
	// def digram with node template
	let diagram = myDiagram = $(go.Diagram, id, {
		initialContentAlignment : go.Spot.Center,
		// initialAutoScale: go.Diagram.UniformToFill,
		// autoScale: go.Diagram.UniformToFill,
		layout : $(go.TreeLayout, {
			angle : 90,// display from left to right
			// alternateAngle : 90,
			// treeStyle : go.TreeLayout.StyleAlternating,
			// alignment : go.TreeLayout.AlignmentCenterChildren,
			// alternateAlignment : go.TreeLayout.AlignmentCenterChildren,
			layerSpacing : 30
		}),
		'toolManager.mouseWheelBehavior' : go.ToolManager.WheelZoom,
		// 'toolManager.hoverDelay' : 200,
		'draggingTool.dragsTree' : true,
		'undoManager.isEnabled' : true,
		// 'grid.visible' : false,
		allowCopy : cfg.editable,
		allowDelete : cfg.editable,
		// allowMove : true,
		allowDrop : true
	});// other properties are set by the layout function
	cfg.contextMenu = contextMenu(diagram, cfg);
	diagram.nodeTemplate = nodeTemplate(cfg);
	diagram.linkTemplate = linkTemplate();
	if (cfg.grid) {
		diagram.grid = $(go.Panel, 'Grid', {
			gridCellSize : new go.Size(50, 50)
		}, $(go.Shape, 'LineH', {
			stroke : 'lightgray'
		}), $(go.Shape, 'LineV', {
			stroke : 'lightgray'
		}));
	}
	w.$.getJSON('./json/faultTree.json', null, function(jsonData) {
		iniModelFromJson(diagram, jsonData);
	});
	w.dialog = new Dialog(diagram);
}).push(window, {
	editable : true,
	grid : false
});
