import go from 'gojs'
import template from './template'
import contextMenu from './contextMenu'
import cfg from './cfg'

const $ = go.GraphObject.make

// 初始化流程图实例对象
export default function diagram (element) {
  let copied = null
  let diagram = $(go.Diagram, element, {
    initialContentAlignment: go.Spot.Center,
    layout: $(go.TreeLayout, {
      angle: 90,
      layerSpacing: 30
    }),
    'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom,
    // 'toolManager.hoverDelay' : 200,
    'draggingTool.dragsTree': true,
    'undoManager.isEnabled': true,
    // 'grid.visible' : false,
    allowCopy: cfg.editable,
    allowDelete: cfg.editable,
    // allowMove : true,
    allowDrop: true
  })
  cfg.contextMenu = contextMenu(diagram, cfg)
  diagram.nodeTemplate = template.nodeTemplate(cfg)
  diagram.linkTemplate = template.linkTemplate()
  diagram.addDiagramListener("ObjectDoubleClicked", function(e) {
    dialog.set(e.subject.part);
  });
  // 源码（JSON）
  diagram.modelData = function() {
    let o = JSON.parse(diagram.model.toJson());
    delete o['class'];
    return o;
  };
  // 源码（字符串JSON）
  diagram.modelJson = function() {
    return JSON.stringify(diagram.modelData());
  };
  // 更新节点
  diagram.updateNodeByKey = function(o) {
    o = o.data ? o.data : o;
    o = o.key ? o.key : o;
    o = this.findNodeForKey(o);
    diagram.startTransaction("start set");
    o.updateTargetBindings();
    diagram.commitTransaction("end set");
  };
  // 总分
  diagram.totalScore = function(o) {
    o = o.data ? o.data : o;
    let w = this.weight;
    o.score = o.score0 * w[0] / 100 + o.score1 * w[1] / 100 + o.score2 * w[2] / 100 + o.score3 * w[3] / 100;
  };
  // 更新连接
  diagram.updateLinkByData = function(o) {
    o = o.data ? o.data : o;
    let n = this.findLinkForData(o);
    diagram.startTransaction("start set");
    n.updateTargetBindings();
    diagram.commitTransaction("end set");
  };
  diagram.addDiagramListener("ClipboardChanged", function(e) {// Ctrl-C

    copied = diagram.selection.first();

  });
  go.CommandHandler.prototype.pasteSelection = function() {// Ctrl-V

    diagram.copyTree(copied, diagram.selection.first());
  };
  diagram.cloneNodeData = function(src) {
    // console.log(arguments);
    src = src.data ? src.data : src;
    let ret = {};
    for ( let n in src) {
      ret[n] = src[n];
    }
    // delete ret.key;
    delete ret.__gohashid;
    diagram.model.makeNodeDataKeyUnique(ret);
    return ret;
  };
  diagram.copyNode = function(src, dst) {
    // console.log(arguments);
    if (src && dst) {
      diagram.startTransaction('copyNode');
      copyNode(src, dst);
      diagram.commitTransaction('copyNode');
    }
  };
  diagram.copyTree = function(src, p) {
    if (src && p) {
      diagram.startTransaction('copyTree');
      let dst = copyNode(src, p);
      let chainKeySet = new Set;
      chainKeySet.add(dst.data.key);
      diagram.copyChildren(src, dst, chainKeySet);
      diagram.commitTransaction('copyTree');
    }
  };
  diagram.copyChildren = function(src, p, chainKeySet) {
    // top for no repeat
    // console.log(arguments);
    let a = [];
    let it = src.findTreeChildrenNodes();// get children links
    while (it.next()) {// now iterate through them and clear out the boss information
      let toNode = it.value;
      if (chainKeySet.has(toNode.data.key)) {
        // console.log(toNode.data.key);
      } else {
        a.push(toNode);
      }
    }
    while (a.length > 0) {// remove all children
      let src2 = a.pop();
      let dst = copyNode(src2, p);
      let dstKey = dst.data.key;
      chainKeySet.add(dstKey);
      diagram.copyChildren(src2, dst, chainKeySet);
      chainKeySet['delete'](dstKey);
    }
  };
  if (cfg.grid) {
    diagram.grid = $(go.Panel, 'Grid', {
      gridCellSize : new go.Size(50, 50)
    }, $(go.Shape, 'LineH', {
      stroke : 'lightgray'
    }), $(go.Shape, 'LineV', {
      stroke : 'lightgray'
    }));
  }
  return diagram
}
