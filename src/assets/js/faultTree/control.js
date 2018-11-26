import $store from '../../../store/index'

export default class control{
  constructor () {
    this.diagram = null
  }
  // 添加根节点
  addRootNode (node) {
    let diagram = $store.state.diagram
    diagram.totalScore(node)
    diagram.startTransaction('addNode start');
    // 给新节点生成key
    diagram.model.makeNodeDataKeyUnique(node);
    // 添加节点
    diagram.model.addNodeData(node);
    // 更新实例对象到vuex
    $store.commit('diagram', diagram)
    // 保存json数据到vuex
    $store.commit('sourceCode', diagram.modelData())
  }
  // 添加节点
  addNode (node, form) {
    let diagram = $store.state.diagram
    diagram.totalScore(form)
    diagram.startTransaction('addNode start');
    // 给新节点生成key
    diagram.model.makeNodeDataKeyUnique(form);
    // 添加节点
    diagram.model.addNodeData(form);
    // 与父节点建立连接
    diagram.model.addLinkData({
      from : node.key,
      to : form.key,
      uid: node.uid,
      weight: 1,
      order: 1,
      createTime: '',
      updateTime: Date.now(),
      deleted: 0
    });
    // 更新节点
    diagram.updateNodeByKey(node.key);
    diagram.commitTransaction('addNode commit');
    // 更新实例对象到vuex
    this.diagram = diagram
    $store.commit('diagram', diagram)
    // 保存json数据到vuex
    $store.commit('sourceCode', diagram.modelData())
  }
  // 添加连接
  addLink (form) {
    let diagram = $store.state.diagram
    diagram.startTransaction('addLink start')
    // 建立新的连接
    diagram.model.addLinkData(form)
    // 更新
    diagram.updateLinkByData(form)
    diagram.commitTransaction('addLink commit')
    // 更新实例对象到vuex
    $store.commit('diagram', diagram)
    // 保存json数据到vuex
    $store.commit('sourceCode', diagram.modelData())
  }
  // 编辑
  put (form) {
    let diagram = $store.state.diagram
    diagram.totalScore(form)
    // 更新节点
    diagram.updateNodeByKey(form.key);
    diagram.updateNodeDataByKey(form);
    // 保存json数据到vuex
    $store.commit('sourceCode', diagram.modelData())
    $store.commit('modal', false)
  }
  // 编辑连接
  linkput (form) {
    let diagram = $store.state.diagram
    diagram.totalScore(form)
    // 更新节点
    diagram.updateLinkByData(form);
    // 保存json数据到vuex
    $store.commit('sourceCode', diagram.modelData())
    $store.commit('modal', false)
  }
  // 删除节点
  del (form) {
    let diagram = $store.state.diagram
    diagram.removeObj(form)
    // 保存json数据到vuex
    $store.commit('sourceCode', diagram.modelData())
  }
  // 删除连接
  linkRemove (form) {
    let diagram = $store.state.diagram
    diagram.removeLink(form)
    // 保存json数据到vuex
    $store.commit('sourceCode', diagram.modelData())
  }
}
