(function(w, $, id) {
	// takes a property change on either isTreeLeaf or isTreeExpanded and selects the correct image to use
	function imageConverter(prop, picture) {
		let node = picture.part;
		if (node.isTreeLeaf) {
			return "img/document.png";
		} else {
			if (node.isTreeExpanded) {
				return "img/openFolder.png";
			} else {
				return "img/closedFolder.png";
			}
		}
	}
	let diagram = $(go.Diagram, id, {
		allowMove : false,
		allowCopy : false,
		allowDelete : false,
		allowHorizontalScroll : false,
		layout : $(go.TreeLayout, {
			alignment : go.TreeLayout.AlignmentStart,
			angle : 0,
			compaction : go.TreeLayout.CompactionNone,
			layerSpacing : 16,
			layerSpacingParentOverlap : 1,
			nodeIndentPastParent : 1.0,
			nodeSpacing : 0,
			setsPortSpot : false,
			setsChildPortSpot : false
		})
	});
	diagram.nodeTemplate = $(go.Node, { // no Adornment: instead change panel background color by binding to Node.isSelected
		selectionAdorned : false,
		// a custom function to allow expanding/collapsing on double-click
		// this uses similar logic to a TreeExpanderButton
		doubleClick : function(e, node) {
			let cmd = diagram.commandHandler;
			if (node.isTreeExpanded) {
				if (!cmd.canCollapseTree(node))
					return;
			} else {
				if (!cmd.canExpandTree(node))
					return;
			}
			e.handled = true;
			if (node.isTreeExpanded) {
				cmd.collapseTree(node);
			} else {
				cmd.expandTree(node);
			}
		}
	}, $("TreeExpanderButton", {
		width : 14,
		"ButtonBorder.fill" : "#FFF",
		"ButtonBorder.stroke" : null,
		"_buttonFillOver" : "rgba(0,128,255,0.25)",
		"_buttonStrokeOver" : null
	}), $(go.Panel, "Horizontal", {
		position : new go.Point(16, 0)
	}, new go.Binding("background", "isSelected", function(s) {
		return (s ? "lightblue" : "white");
	}).ofObject(), $(go.Picture, {
		width : 18,
		height : 18,
		margin : new go.Margin(0, 4, 0, 0),
		imageStretch : go.GraphObject.Uniform
	}, new go.Binding("source", "isTreeExpanded", imageConverter).ofObject(), new go.Binding("source", "isTreeLeaf", imageConverter).ofObject()), $(go.TextBlock, {
		font : '9pt Verdana, sans-serif'
	}, new go.Binding("text", "title"))));
	// without lines
	diagram.linkTemplate = $(go.Link);
	// load tree view
	w.$.getJSON("./json/treeView.json", function(jsonData) {
		iniModelFromJson(diagram, jsonData, go.TreeModel);
	});
}).push(window, go.GraphObject.make, 'treeView');