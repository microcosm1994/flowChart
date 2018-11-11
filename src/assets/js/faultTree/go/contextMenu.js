import go from 'gojs'
import $store from '../../../../store/index'

export default function (diagram, cfg) {
  const $ = go.GraphObject.make
  return function (key) {
    let ret = $(go.Adornment, 'Vertical')
    if (cfg.editable) {
      ret.add($('ContextMenuButton', $(go.TextBlock, '计算'), {
        click : function(e, o) {
          let d = o.part.data ? o.part.data : o;
          if (d.key) {
            // 节点分数
            let compute = {
              score0: d.score0,
              score1: d.score1,
              score2: d.score2,
              score3: d.score3
            }
            $store.commit('compute', compute)
            // 打开弹框
            $store.commit('modal', {
              title: '计算',
              name: 'compute',
              switch: true
            })
          }
        }
      }))
      ret.add($('ContextMenuButton', $(go.TextBlock, '编辑'), {
        click : function(e, o) {
          let d = o.part.data ? o.part.data : o;
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
      }
      }))
      ret.add($('ContextMenuButton', $(go.TextBlock, '新节点'), {
        click : function(e, o) {
          let d = o.part.data ? o.part.data : d;
          if (d.key) {
            // 更新当前节点信息到vuex
            $store.commit('currentnNode', d)
            // 打开弹框
            $store.commit('modal', {
              title: '添加节点',
              name: 'addNode',
              switch: true
            })
          }
        }
      }))
      ret.add($('ContextMenuButton', $(go.TextBlock, '新连接'), {
        click : function(e, o) {
          let d = o.part.data ? o.part.data : o;
          if (d.key) {
            // 保存当前节点到vuex
            $store.commit('currentnNode', d)
            // 打开弹框
            $store.commit('modal', {
              title: '添加连接',
              name: 'addLink',
              switch: true
            })
          }
        }
      }));
      ret.add($('ContextMenuButton', $(go.TextBlock, '删除'), {
        click : function(e, o) {
          let d = o.part.data ? o.part.data : o;
          if (d.key) {
            // 更新当前节点信息到vuex
            $store.commit('currentnNode', d)
            // 打开弹框
            $store.commit('modal', {
              title: '确认删除此节点？',
              name: 'remove',
              switch: true
            })
          }
        }
      }))
    } else {
      ret.add($('ContextMenuButton', $(go.TextBlock, '详情'), {
        click : function(e, o) {
          let d = o.part.data ? o.part.data : o;
          if (d.key) {
            // 更新当前节点信息到vuex
            $store.commit('currentnNode', d)
            // 打开弹框
            $store.commit('modal', {
              title: '查看节点',
              name: 'get',
              switch: true
            })
          }
        }
      }))
    }
    return ret
  }
}
