import go from 'gojs'
import template from './template'
import contextMenu from './contextMenu'
import cfg from './cfg'
import $store from '../../../../store/index'

const $ = go.GraphObject.make

// 初始化流程图实例对象
function diagram (element) {
  let self = this
  this.element = element
  this.copied = null
  this.options = {
    initialContentAlignment: go.Spot.Center,
    layout: $(go.TreeLayout, {
      angle: 90,
      layerSpacing: 30
    }),
    'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom,
    'draggingTool.dragsTree': true,
    'undoManager.isEnabled': true,
    // 'grid.visible' : false,
    allowCopy: cfg.editable,
    allowDelete: cfg.editable,
    // allowMove : true,
    allowDrop: true
  }
  // 创建流程图实例
  this.diagram = $(go.Diagram, element, this.options)
  cfg.contextMenu = contextMenu(this.diagram, cfg)
  if (cfg.grid) {
    this.diagram.grid = $(go.Panel, 'Grid', {
      gridCellSize : new go.Size(50, 50)
    }, $(go.Shape, 'LineH', {
      stroke : 'lightgray'
    }), $(go.Shape, 'LineV', {
      stroke : 'lightgray'
    }));
  }
  // 合并this.diagram与this.__proto__
  /* this.diagram === this*/
  Object.assign(this.diagram, this.__proto__)
  // 监听双击事件
  this.diagram.addDiagramListener("ObjectDoubleClicked", function(e) {
    let d = e.subject.part.data ? e.subject.part.data : e.subject.part;
    if (d.key) {
      // 更新当前节点信息到vuex
      $store.commit('currentnNode', d)
      // 打开弹框
      $store.commit('modal', {
        title: '编辑节点',
        name: 'put',
        switch: true
      })
    }
  })
  // Ctrl-C
  this.diagram.addDiagramListener("ClipboardChanged", function(e) {
    self.copied = self.diagram.selection.first()
  })
  // Ctrl-V
  go.CommandHandler.prototype.pasteSelection = function() {
    self.diagram.copyTree(self.copied, self.diagram.selection.first())
  }
}

diagram.prototype = {
  // 初始化流程图
  init: function (diagram, data, model) {
    /* diagram === this */
    diagram = this.prepareModel(data)
    switch (typeof (data)) {
      case 'string':
        diagram.model = go.Model.fromJson(data);
        break;
      case 'object':
        if (!model) model = go.GraphLinksModel;
        diagram.model = go.GraphObject.make(model, data);
        break;
      default:
        return;
    }
    diagram.initialPosition = go.Point.parse(diagram.model.modelData.position)
    diagram.nodeTemplate = template.nodeTemplate(cfg)
    diagram.linkTemplate = template.linkTemplate()
    Object.assign(this, diagram)
    return this
  },
  prepareModel: function (data) {
    this.weight = data.weight;
    this.colors = data.colors;
    delete data.colors;
    delete data.weight;
    let a = data.nodeDataArray;
    for (let i = 0; i < a.length; i++) {
      this.totalScore(a[i]);
    }
    return this
  },
  // 源码（JSON）
  modelData: function () {
    let o = JSON.parse(this.model.toJson());
    delete o['class'];
    return o;
  },
  // 源码（字符串JSON）
  modelJson: function () {
    return JSON.stringify(this.modelData());
  },
  // 更新节点
  updateNodeByKey: function(o) {
    o = o.data ? o.data : o;
    o = o.key ? o.key : o;
    o = this.findNodeForKey(o);
    this.startTransaction("start set");
    o.updateTargetBindings();
    this.commitTransaction("end set");
  },
  // 更新连接
  updateLinkByData: function (o) {
    o = o.data ? o.data : o;
    let n = this.findLinkForData(o);
    this.startTransaction("start set");
    n.updateTargetBindings();
    this.commitTransaction("end set");
  },
  // 总分
  totalScore: function (o) {
    o = o.data ? o.data : o;
    let w = this.weight;
    o.score = o.score0 * w[0] + o.score1 * w[1] + o.score2 * w[2] + o.score3 * w[3];
  },
  addLink: function (src, dst) {
    src = src.data ? src.data : src;
    src = src.key ? src.key : src;
    dst = dst.data ? dst.data : dst;
    dst = dst.key ? dst.key : dst;
    this.model.addLinkData({
      'from' : src,
      'to' : dst
    });
  },
  cloneNodeData: function (src) {
    src = src.data ? src.data : src;
    let ret = {};
    for ( let n in src) {
      ret[n] = src[n];
    }
    delete ret.key;
    delete ret.__gohashid;
    this.model.makeNodeDataKeyUnique(ret);
    return ret;
  },
  copyNode: function (src, dst) {
    let ret;
    if (src && dst) {
      let copied = this.cloneNodeData(src)
      // console.log(copied);
      this.model.addNodeData(copied)
      this.addLink(dst, copied)
      ret = this.findNodeForKey(copied.key)
    }
    return ret;
  },
  copyTree: function (src, p) {
    if (src && p) {
      this.startTransaction('copyTree');
      let dst = this.copyNode(src, p);
      let chainKeySet = new Set;
      chainKeySet.add(dst.data.key);
      this.copyChildren(src, dst, chainKeySet);
      this.commitTransaction('copyTree');
    }
  },
  copyChildren: function (src, p, chainKeySet) {
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
      let dst = this.copyNode(src2, p);
      let dstKey = dst.data.key;
      chainKeySet.add(dstKey);
      this.copyChildren(src2, dst, chainKeySet);
      chainKeySet['delete'](dstKey);
    }
  },
  // 移除节点
  removeObj: function (o) {
    this.startTransaction('remove');
    let d = o.data ? o.data : o;
    if (d.key) {// is node
      let k = d.key;
      o = this.findNodeForKey(k);
      let linkIn = o.findTreeParentLink();// get parent link
      if (linkIn) {// remove in link
        this.model.removeLinkData(linkIn.data);
      }
      // console.log(linkIn);
      this.removeNodeAndOutLinks(o);
    } else if (d.to) {// is link
      this.model.removeLinkData(d);
    }
    this.commitTransaction('remove');
  },
  removeNodeAndOutLinks: function (o) {
    this.model.removeNodeData(o.data);
    let it = o.findTreeChildrenLinks();
    let it2 = o.findTreeChildrenNodes();
    let outLinks = [];
    let outNodes = [];
    while (it.next() && it2.next()) {
      outLinks.push(it.value.data);
      outNodes.push(it2.value);
    }
    this.model.removeLinkDataCollection(outLinks);
    outLinks = []
    while (outNodes.length > 0) {
      let toNode = outNodes.pop();
      if (toNode.findTreeParentLink() == null) {
        this.removeNodeAndOutLinks(toNode);
      }
    }
  },
}

export default diagram
