import go from 'gojs'
import contextMenu from './contextMenu'
import cfg from './cfg'

const $ = go.GraphObject.make
const id = 'myDiagramDiv'
let diagram = $(go.Diagram, id, {
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
export default {
  diagram: diagram
}
