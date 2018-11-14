<template>
  <el-tabs type="card" size="small">
    <el-tab-pane label="视图">
      <div class="btn-box" style="text-align: center">
        <el-button @click="viewRefresh" icon="el-icon-refresh" size="mini" type="primary">刷新</el-button>
        <el-button @click="save" size="mini" type="primary">保存</el-button>
        <el-button @click="weight" size="mini" type="primary">权重</el-button>
        <el-button @click="rootNode" size="mini" type="primary">新建</el-button>
        <el-button @click="screenshot" size="mini" type="primary">截图</el-button>
        <el-input-number size="mini" v-model="viewSize" @change="handleChange"  :min="1" :step="1" label="%"></el-input-number>
        <el-button icon="el-icon-info" size="mini" type="primary">帮助</el-button>
      </div>
      <div id="faultTree" :style="{width: '100%', height: height + 'px', 'margin-top': '10px',}"></div>
    </el-tab-pane>
    <el-tab-pane label="源码">
      <div class="btn-box" style="text-align: center;">
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
          </el-dropdown-menu>
        </el-dropdown>
        <el-button @click="codeRefresh" size="mini" icon="el-icon-refresh" type="primary">刷新</el-button>
        <el-button @click="save" size="mini" type="primary">保存</el-button>
      </div>
      <div id="jsoneditor" :style="{width: '100%', height: height + 'px', 'margin-top': '10px'}"></div>
    </el-tab-pane>
    <!--弹框-->
    <!--使用v-if是为了销毁动态组件-->
    <el-dialog
      v-if="modal.switch"
      :title="modal.title"
      :visible.sync="modal.switch"
      width="40%"
      center>
      <component v-bind:is="modal.name"></component>
    </el-dialog>
  </el-tabs>
</template>

<script>
  import compute from './modal/compute'
  import addNode from './modal/addNode'
  import addLink from './modal/addLink'
  import put from './modal/put'
  import get from './modal/get'
  import remove from './modal/remove'
  import screenshot from './modal/screenshot'
  import weight from './modal/weight'
  import rootNode from './modal/rootNode'
  export default {
    name: 'FTA',
    data () {
      return {
        diagram: null, // 流程图实例
        height: 0, // 高度
        Editor: null, // json编辑器实例
        editorMode: 'view', // 编辑器模式
        code: '', // json源码
        viewSize: 0
      }
    },
    created () {
      // 在创建vue实例时获取高度
      this.height = this.setHeight(110)
    },
    computed: {
      modal: function () {
        return this.$store.state.modal
      },
      sourceCode: function () {
        return this.$store.state.sourceCode
      }
    },
    watch: {
      // 监听编辑器的模式
      editorMode: function (n, o) {
        this.Editor.setMode(n) // 切换编辑器模式
      },
      // 监听流程图json数据的变化
      sourceCode: function (n, o) {
        // 更新json编辑器中的数据
        this.Editor.update(n)
      }
    },
    components: {
      compute,
      addNode,
      addLink,
      put,
      get,
      remove,
      screenshot,
      weight,
      rootNode
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
        //http://localhost:8081/static/json/faultTree.json
        this.$http.get('/9001/tree/load').then((response) => {
          if (response.status === 200) {
            let jsonData = response.data.d
            // 创建流程图实例
            let diagram = new this.$diagrams('faultTree').diagram;
            // 初始化流程图
            diagram = diagram.init(diagram, jsonData)
            // 保存json数据到vuex
            this.$store.commit('sourceCode', diagram.modelData());
            // Json编辑器
            this.editor(this.sourceCode, this.editorMode)
            // 保存实力对象到vuex
            this.diagram = diagram;
            this.$store.commit('diagram', diagram)
          }
        })
      },
      // Json编辑器
      editor (json, mode) {
        let container = document.getElementById('jsoneditor');
        let options = {
          mode: mode,
          indentation: 2,
          search: true,
        };
        let editor = new this.$jsoneditor(container, options);
        this.Editor = editor;
        editor.set(json)
      },
      // 切换编辑器模式
      switchType (text) {
        this.editorMode = text
      },
      // view刷新
      viewRefresh () {
        let diagram = this.diagram;
        // 获取流程图数据
        this.$http.post('/9001/tree/load').then((response) => {
          if (response.status === 200) {
            let jsonData = response.data.d
            diagram = diagram.init(diagram, jsonData);
            // 保存json数据到vuex
            this.$store.commit('sourceCode', diagram.modelData())
            // 更新json编辑器中的数据
            this.Editor.update(jsonData)
            // 保存实力对象到vuex
            this.$store.commit('diagram', diagram)
          }
        })
      },
      // code刷新
      codeRefresh () {
        this.Editor.set(this.code)
      },
      // 保存
      save () {
        // 要保存的json(编辑器中的json)
        let code = this.Editor.get()
        // 删除数据中的updateTime和createTime
        for (let key in code) {
          if (Object.keys(code[key]).length > 0) {
            for (let i = 0; i < code[key].length; i++) {
              let item = code[key][i]
              delete item.createTime
              delete item.updateTime
            }
          }
        }
        console.log(code);
        this.$http.post('api/tree/save', code).then((response) => {
          if (response.status === 200) {
            this.$message({
              message: '数据保存成功',
              type: 'success'
            });
          }
        })
      },
      // 截图
      screenshot() {
        this.$store.commit('modal', {
          title: '截图',
          name: 'screenshot',
          switch: true
        })
      },
      // 权重
      weight() {
            this.$store.commit("modal",{
            title:"权重",
            name:"weight",
            switch:true
          })
      },
      // 新建根节点
      rootNode() {
          this.$store.commit("modal",{
          title:'新建根节点',
          name:'rootNode',
          switch:true
        })
      },
      //
      handleChange(value) {
        let diagram = this.diagram;
        diagram.onmousewheel = function () {
          alert(value);
        }

        diagram.scale = value;
        diagram.allowZoom = false;
        diagram.allowHorizontalScroll = true;
        console.log(value);
      }
    }
  }
</script>

<style>
  @import "../assets/css/Fta.css";
</style>
