function contextMenu(diagram, cfg) {
	let $ = go.GraphObject.make;
	// console.log(arguments);
	return function(key) {// def context menu
		// console.log(arguments);
		let d = diagram.model.findNodeDataForKey(key);
		let ret = $(go.Adornment, 'Vertical');
		if (cfg.editable) {
			ret.add($('ContextMenuButton', $(go.TextBlock, '计算'), {
				click : function(e, obj) {
          dialog.compute(obj.part);
				}
			}));
			ret.add($('ContextMenuButton', $(go.TextBlock, '编辑'), {
				click : function(e, obj) {
					dialog.set(obj.part);
				}
			}));
			ret.add($('ContextMenuButton', $(go.TextBlock, '新节点'), {
				click : function(e, obj) {
					dialog.addNode(obj.part);
				}
			}));
			ret.add($('ContextMenuButton', $(go.TextBlock, '新连接'), {
				click : function(e, obj) {
					dialog.addLink(obj.part);
				}
			}));
			ret.add($('ContextMenuButton', $(go.TextBlock, '删除'), {
				click : function(e, obj) {
					dialog.del(obj.part);
				}
			}));
		} else {
			ret.add($('ContextMenuButton', $(go.TextBlock, '详情'), {
				click : function(e, obj) {
					dialog.get(obj.part);
				}
			}));
		}
		return ret;
	};
}
