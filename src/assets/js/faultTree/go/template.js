import go from 'gojs'
import mt from '../mt/mt'
import $store from '../../../../store/index'

const $ = go.GraphObject.make

export default {
  nodeFillConverter: function (key) {
    switch (figure) {
      case 'AndGate':
        return $(go.Brush, 'Linear', {
          0: '#EA8100',
          1: '#C66D00',
          start: go.Spot.Right,
          end: go.Spot.Left
        });
      case 'OrGate':
        return $(go.Brush, 'Linear', {
          0: '#0058D3',
          1: '#004FB7',
          start: go.Spot.Right,
          end: go.Spot.Left
        });
      case 'Circle':
        return $(go.Brush, 'Linear', {
          0: '#009620',
          1: '#007717'
        });
      case 'Triangle':
        return $(go.Brush, 'Linear', {
          0: '#7A0099',
          1: '#63007F'
        });
      default:
      // return '#FFF';
    }
  },
  nodeBody: function (cfg) {
    let self = this
    let fontSize = cfg.fontSize;
    let margin = cfg.margin;
    let ret = $(go.Panel, 'Auto', {
        name: 'BODY',
        portId: ''
      }, $(go.Shape, 'RoundedRectangle', {
        fill: "yellow",
        stroke: null
      }, new go.Binding('fill', 'score', function (score) {
        let colors = $store.state.colors
        let color = colors[score]
        if (typeof color == 'undefined') {
          let a = [];
          for (let n in colors) {
            a.push(n - 0);
          }
          // 排序
          a.sort(function (x, y) {
            if (x < y) {
              return -1;
            } else if (x > y) {
              return 1;
            } else {
              return 0;
            }
          });
          // 已经有序了
          for (let i = 1; i < a.length; i++) {
            let score0 = a[i - 1];
            let score1 = a[i];
            if (score0 - 1 < score && score < score1 + 1) {
              let color0 = self.colorRgb(colors[score0])
              let color1 = self.colorRgb(colors[score1])
              // TODO 颜色由网页代码变成RGB数字
              // 线性插值公式
              color = [0, 0, 0]
              for (let k = 0; k < color.length; k++) {
                color[k] = Math.round(color0[k] + (color1[k] - color0[k]) * (score - score0) / (score1 - score0))
              }
              break;
            }
          }
        }
        color = self.colorRgb(color)
        color = color.join(',')
        // 返回rgb格式
        return 'rgb(' + color + ')'
      }))
      , $(go.TextBlock, {
        margin: new go.Margin(margin, margin, fontSize + margin * 2, margin),
        stroke: cfg.stroke,
        font: cfg.font,
      }, new go.Binding('text', 'title')));
    ret.add($(go.TextBlock, {
      margin: new go.Margin(fontSize + margin * 2, margin, margin, margin),
      stroke: cfg.stroke,
      font: cfg.font,
    }, new go.Binding('text', 'score')));
    if (cfg.contextMenu) {
      ret.bind(new go.Binding('contextMenu', 'key', cfg.contextMenu));
    }
    return ret;
  },
  toolTip: function () {
    return $(go.Adornment, 'Auto', $(go.Shape, 'RoundedRectangle', {
      fill: '#FFFFCC',
      stroke: null
    }), $(go.TextBlock, {
      margin: 4
    }, new go.Binding('text', 'remark'), {
      width: 200,
      wrap: go.TextBlock.WrapFit,
      isMultiline: true
    }));
  },
  nodeTemplate: function (cfg) {
    let self = this
    cfg = cfg ? cfg : {};
    mt.extend({
      font: 'bold 12px Arial, Helvetica, sans-serif, Segoe UI',
      fontSize: 12,
      margin: 10,
      stroke: '#fff'
    }, cfg);
    return $(go.Node, 'Spot', {
      selectionObjectName: 'BODY',
      toolTip: self.toolTip()
    }, self.nodeBody(cfg));
  },
  linkTemplate: function (cfg, shape) {
    cfg = cfg ? cfg : {};
    mt.extend({
      routing: go.Link.Orthogonal, // smooth
      layerName: 'Background',
      selectable: true,
      corner: 20,
      curviness: 0
    }, cfg);
    shape = shape ? shape : {};
    mt.extend({
      toArrow: 'standard',
      stroke: '#fff',
      fill: '#fff',
      strokeWidth: 1.5
    }, shape);
    return $(go.Link, cfg, $(go.Shape, shape));
  },
  /* RGB转16 */
  colorHex: function (that) {
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (/^(rgb|RGB)/.test(that)) {
      let aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
      let strHex = "#";
      for (let i = 0; i < aColor.length; i++) {
        let hex = Number(aColor[i]).toString(16);
        if (hex === "0") {
          hex += hex;
        }
        strHex += hex;
      }
      if (strHex.length !== 7) {
        strHex = that;
      }
      return strHex;
    } else if (reg.test(that)) {
      let aNum = that.replace(/#/, "").split("");
      if (aNum.length === 6) {
        return that;
      } else if (aNum.length === 3) {
        let numHex = "#";
        for (let i = 0; i < aNum.length; i += 1) {
          numHex += (aNum[i] + aNum[i]);
        }
        return numHex;
      }
    } else {
      return that;
    }
  },
  /* 16进制转RGB */
  colorRgb: function (sColor) {
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = "#";
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColorNew[1] = sColorNew[1] + 100
        sColor = sColorNew;
      }
//处理六位的颜色值
      let sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
      }
      // 改变颜色亮度
      for (let i = 0; i < sColorChange.length; i++) {
        if (sColorChange[i] > 200) {
          sColorChange[i] = 160
        }
        if (sColorChange[i] < 50) {
          sColorChange[i] = 50
        }
      }
      // 返回rgb数组
      return sColorChange
    } else {
      return sColor;
    }
  }
}
