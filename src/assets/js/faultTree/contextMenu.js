import go from 'gojs'
import control from './control'
import {$axios} from '../interceptors'
import $store from '../../../store/index'

const co = new control()
export default function (diagram, cfg) {
  const $ = go.GraphObject.make
  return function (key) {
    let ret = $(go.Adornment, 'Vertical')
    if (cfg.editable) {
      ret.add($('ContextMenuButton', $(go.TextBlock, '编辑'), {
        click : function(e, o) {
          let d = o.part.data ? o.part.data : o;
          if (d.key) {
            // 更新当前节点信息到vuex
            $store.commit('modalData', d)
            // 打开弹框
            $store.commit('modal', true)
            // 弹框信息
            $store.commit('modalInfo', {
              title: '编辑节点',
              name: 'put'
            })
        }
      }
      }))
      ret.add($('ContextMenuButton', $(go.TextBlock, '新节点'), {
        click : function(e, o) {
          let d = o.part.data ? o.part.data : d;
          if (d.key) {
            // 更新当前节点信息到vuex
            $store.commit('modalData', d)
            // 打开弹框
            $store.commit('modal', true)
            // 弹框信息
            $store.commit('modalInfo', {
              title: '添加节点',
              name: 'addNode'
            })
          }
        }
      }))
      ret.add($('ContextMenuButton', $(go.TextBlock, '新连接'), {
        click : function(e, o) {
          let d = o.part.data ? o.part.data : o;
          if (d.key) {
            // 更新当前节点信息到vuex
            $store.commit('modalData', d)
            // 打开弹框
            $store.commit('modal', true)
            // 弹框信息
            $store.commit('modalInfo', {
              title: '添加连接',
              name: 'addLink'
            })
          }
        }
      }));
      ret.add($('ContextMenuButton', $(go.TextBlock, '删除'), {
        click : function(e, o) {
          let d = o.part.data ? o.part.data : o;
          if (d.key) {
            co.del(d)
          }
        }
      }))
    }
    return ret
  }
}
