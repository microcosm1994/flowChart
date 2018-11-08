<template>
  <el-tabs type="card" size="small">
    <el-tab-pane label="视图">
      <div id="myDiagramDiv" style="width:100%;height:600px;"></div>
    </el-tab-pane>
    <el-tab-pane label="源码">源码</el-tab-pane>
  </el-tabs>
</template>

<script>
  import go from 'gojs'
  import template from '../assets/js/go/template'
  import contextMenu from '../assets/js/go/contextMenu'
  // import Dialog from '../assets/js/mt/Dialog'
  import model from '../assets/js/go/model'
  import cfg from '../assets/js/go/cfg'
  const $ = go.GraphObject.make
  export default {
    name: 'FTA',
    data () {
      return {
        msg: '',
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        // html元素ID
        const id = 'myDiagramDiv'
        // 初始化流程图实例对象
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
        cfg.contextMenu = contextMenu(diagram, cfg)
        diagram.nodeTemplate = template.nodeTemplate(cfg)
        diagram.linkTemplate = template.linkTemplate()
        if (cfg.grid) {
          diagram.grid = $(go.Panel, 'Grid', {
            gridCellSize : new go.Size(50, 50)
          }, $(go.Shape, 'LineH', {
            stroke : 'lightgray'
          }), $(go.Shape, 'LineV', {
            stroke : 'lightgray'
          }));
        }
        // 获取流程图数据
        this.$http.get('http://localhost:8081/static/json/faultTree.json').then((response) => {
          console.log(response)
          let jsonData = response.data
          model.iniModelFromJson(diagram, jsonData)
        })
        // window.dialog = new Dialog(diagram)
      },
    }
  }
</script>
