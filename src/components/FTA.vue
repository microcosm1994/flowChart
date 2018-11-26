<template>
  <el-tabs type="card" size="small" @tab-click="tabChange">
    <el-tab-pane label="视图">
      <div class="btn-box" style="text-align: center">
        <el-button @click="rootNode" size="mini" type="primary">新建</el-button>
        <el-button @click="handleFullScreen" size="mini" type="primary">全屏</el-button>
        <el-button @click="handleexitFullScreen" size="mini" type="primary">正常</el-button>
        <el-button @click="screenshot" size="mini" type="primary">截图</el-button>
        <el-input-number size="mini" :value="scaleCode" @change="handleChange" :step="10" :min ="0" :max="1000" :precision="0">
        </el-input-number>
      </div>
      <div id="faultTree" ref="faultTree"
           :style="{width: '100%', height: height + 'px'}"></div>
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
      </div>
      <div id="jsoneditor" :style="{width: '100%', height: height + 'px'}"></div>
    </el-tab-pane>
    <!--弹框-->
    <!--使用v-if是为了销毁动态组件-->
    <el-dialog
      v-if="modal.switch"
      :title="modalInfo.title"
      :visible.sync="modal.switch"
      width="40%"
      center>
      <component v-bind:is="modalInfo.name"></component>
    </el-dialog>
  </el-tabs>
</template>

<script>
  // 节点
  const addNode = resolve=>require(['@/components/modal/addNode.vue'],resolve)
  const addLink = resolve=>require(['@/components/modal/addLink.vue'],resolve)
  const put = resolve=>require(['@/components/modal/put.vue'],resolve)
  const screenshot = resolve=>require(['@/components/modal/screenshot.vue'],resolve)
  const rootNode = resolve=>require(['@/components/modal/rootNode.vue'],resolve)

  export default {
    name: 'FTA',
    data() {
      return {
        diagram: null, // 流程图实例
        height: 0, // 高度
        Editor: null, // json编辑器实例
        editorMode: 'view', // 编辑器模式
        fullscreen: false,
      }
    },
    created() {
      // 在创建vue实例时获取高度
      this.height = this.setHeight(110)
    },
    computed: {
      modal: function () {
        return this.$store.state.modal
      },
      modalInfo: function () {
        return this.$store.state.modalInfo
      },
      sourceCode: function () {
        return this.$store.state.sourceCode
      },
      scaleCode: function () {
        return this.$store.state.scale
      },
      userConfig: function () {
        return this.$store.state.userConfig
      },
      colors: function () {
        return this.$store.state.colors
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
      },
      scaleCode: function (n, g) {
        this.$store.commit('scale', n)
      },
    },
    components: {
      addNode,
      addLink,
      put,
      screenshot,
      rootNode
    },
    mounted() {
      this.init()
      // Json编辑器
      this.editor(this.editorMode)
    },
    methods: {
      // 设置高度
      setHeight(h) {
        const windowHeight = document.body.clientHeight
        return windowHeight - h - 0
      },
      // 初始化流程图
      init() {
        // 获取流程图数据
        //http://localhost:8081/static/json/faultTree.json
        //this.$IP + '/tree/load'
        this.$http.get('http://localhost:8081/static/json/faultTree.json').then((response) => {
          if (response.status === 200) {
            this.$store.commit('userConfig', response.data.config)
            // 保存颜色
            this.$store.commit('colors', response.data.colors)
            let jsonData = response.data
            // 创建流程图实例
            let diagram = new this.$diagrams('faultTree', true).diagram;
            // 初始化流程图
            diagram = diagram.init(diagram, jsonData)
            // 保存实例对象到vuex
            this.diagram = diagram
            this.$store.commit('diagram', diagram)
          }
        })
      },
      // Json编辑器
      editor(mode) {
        let container = document.getElementById('jsoneditor');
        let options = {
          mode: mode,
          indentation: 2,
          search: true,
        };
        let editor = new this.$jsoneditor(container, options);
        this.Editor = editor;
      },
      // 切换编辑器模式
      switchType(text) {
        this.editorMode = text
      },
      // code刷新
      codeRefresh() {
        this.Editor.set(this.sourceCode)
      },
      // 截图
      screenshot() {
        // 打开弹框
        this.$store.commit('refs', this.$refs.faultTree)
        // 打开弹框
        this.$store.commit('modal', true)
        // 弹框信息
        this.$store.commit('modalInfo', {
          title: '截图',
          name: 'screenshot'
        })
      },
      // 新建根节点
      rootNode() {
        // 打开弹框
        this.$store.commit('modal', true)
        // 弹框信息
        this.$store.commit('modalInfo', {
          title: '新建根节点',
          name: 'rootNode'
        })
      },
      //缩放
      handleChange(value) {
        let diagram = this.diagram
        diagram.scale = value / 100
        this.$store.commit('scale', value)
      },
      // 切换tab栏
      tabChange (e) {
        let diagram = this.diagram;
        let code = this.Editor.get() // 获取json编辑器的数据
        if (e.paneName - 0 === 0) {
          code.config = this.userConfig
          code.colors = this.colors
          diagram = diagram.init(diagram, code) // 更新视图
        } else {
          this.Editor.set(diagram.modelData())
          // 更新json数据到vuex
          this.$store.commit('sourceCode', diagram.modelData())
        }
      },
      //全屏事件
      handleFullScreen() {
        // 在创建vue实例时获取高度
        this.height = this.setHeight(110)
        let element = document.documentElement;
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
        } else {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
          }
        }
        this.fullscreen = !this.fullscreen
      },
      handleexitFullScreen(){
        // 在创建vue实例时获取高度
        this.height = this.setHeight(110)
        let element = document.documentElement
        if(this.fullscreen){
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
        }
        this.fullscreen = !this.fullscreen
      }
    }
  }

</script>

<style>
  @import "../assets/css/Fta.css";
</style>
