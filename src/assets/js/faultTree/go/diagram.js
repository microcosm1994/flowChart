import go from 'gojs'
import template from './template'
import contextMenu from './contextMenu'
import cfg from './cfg'

const $ = go.GraphObject.make

// 初始化流程图实例对象
export default function diagram (element) {
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
