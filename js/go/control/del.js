(function() {
	// console.log(arguments);
	let diagram = myDiagram;// go diagram
	go.CommandHandler.prototype.deleteSelection = function() {
		dialog.del(diagram.selection.first());
		// diagram.removeObj(diagram.selection.first());
	};
	function removeNodeAndOutLinks(o) {
		diagram.model.removeNodeData(o.data);
		let it = o.findTreeChildrenLinks();
		let it2 = o.findTreeChildrenNodes();
		let outLinks = [];
		let outNodes = [];
		while (it.next() && it2.next()) {
			outLinks.push(it.value.data);
			outNodes.push(it2.value);
		}
		diagram.model.removeLinkDataCollection(outLinks);
		outLinks.clear();
		while (outNodes.length > 0) {
			let toNode = outNodes.pop();
			if (toNode.findTreeParentLink() == null) {
				removeNodeAndOutLinks(toNode);
			}
		}
	}
	diagram.removeObj = function(o) {
		diagram.startTransaction('remove');
		d = o.data ? o.data : o;
		if (d.key) {// is node
			let k = d.key;
			o = diagram.findNodeForKey(k);
			let linkIn = o.findTreeParentLink();// get parent link
			if (linkIn) {// remove in link
				diagram.model.removeLinkData(linkIn.data);
			}
			// console.log(linkIn);
			removeNodeAndOutLinks(o);
		} else if (d.to) {// is link
			diagram.model.removeLinkData(d);
		}
		diagram.commitTransaction('remove');
	};
}).push();
