<template>
  <el-tabs type="card" size="small">
    <el-tab-pane label="视图">
      <el-row :gutter="20">
        <el-col :span="12">
          <h1 style="text-align: center">故障树编辑</h1>
        </el-col>
        <el-col :span="12">
          <div style="text-align: center">
            <el-button icon="el-icon-refresh" size="mini" type="primary">刷新</el-button>
            <el-button icon="el-icon-plus" size="mini" type="primary">新建</el-button>
            <el-button size="mini" type="primary">保存</el-button>
            <el-button size="mini" type="primary">截图</el-button>
            <el-button icon="el-icon-info" size="mini" type="primary">帮助</el-button>
          </div>
        </el-col>
      </el-row>
      <div id="faultTree" :style="{width: '100%', height: height + 'px', 'margin-top': '10px'}"></div>
    </el-tab-pane>
    <el-tab-pane label="源码">
      <el-row :gutter="20">
        <el-col :span="14">
          <h1 style="text-align: center">Json编辑器</h1>
        </el-col>
        <el-col :span="10">
          <div style="text-align: center;">
            <el-dropdown @command="switchType">
              <el-button size="mini" type="primary">
                编辑器模式：{{editorMode}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="text">text</el-dropdown-item>
                <el-dropdown-item command="form">form</el-dropdown-item>
                <el-dropdown-item command="tree">tree</el-dropdown-item>
                <el-dropdown-item command="view">view</el-dropdown-item>
                <el-dropdown-item command="code">code</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button @click="refresh" size="mini" icon="el-icon-refresh" type="primary">刷新</el-button>
            <el-button @click="save" size="mini" type="primary">保存</el-button>
          </div>
        </el-col>
      </el-row>
      <div id="jsoneditor" :style="{width: '100%', height: height + 'px', 'margin-top': '10px'}"></div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    name: 'FTA',
    data () {
      return {
        height: 0,
        Editor: null,
        editorMode: 'text',
        code: '',
      }
    },
    watch: {
      editorMode: function (n, o) {
        this.Editor.setMode(n) // 切换编辑器模式
      }
    },
    created () {
      this.height = this.setHeight(155)
      console.log(this.height);
    },
    mounted () {
      this.init()
    },
    methods: {
      // 设置高度
      setHeight (h) {
        const windowHeight = document.body.clientHeight
        return windowHeight - h - 0
      },
      // 初始化流程图
      init () {
        // 获取流程图数据
        this.$http.get('http://localhost:8080/static/json/faultTree.json').then((response) => {
          if (response.status === 200) {
            let jsonData = response.data
            let diagram = this.$diagrams.diagram('faultTree')
            diagram = this.$diagrams.model.iniModelFromJson(diagram, jsonData)
            this.code = diagram.modelData()
            this.editor(this.code, this.editorMode)
          }
        })
      },
      editor (json, mode) {
        let container = document.getElementById('jsoneditor')
        let options = {
          mode: mode,
          indentation: 2,
          search: true
        }
        let editor = new this.$jsoneditor(container, options)
        this.Editor = editor
        editor.set(json)
      },
      // 切换编辑器模式
      switchType (text) {
        this.editorMode = text
      },
      // 刷新
      refresh () {
        this.Editor.set(this.code)
      },
      // 保存
      save () {
        // 要保存的json(编辑器中的json)
        let code = this.Editor.get()
        console.log(code);
      }
    }
  }
</script>
