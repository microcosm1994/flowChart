import go from 'gojs'
import mt from '../mt/mt'

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
    let fontSize = cfg.fontSize;
    let margin = cfg.margin;
    let ret = $(go.Panel, 'Auto', {
        name : 'BODY',
        portId : ''
      }, $(go.Shape, 'RoundedRectangle', {
        fill : "yellow",
        stroke : null
      }, new go.Binding('fill', 'score', function(score) {
        let num = score;
        let c = 190/100*num;
        let co = [0,0,0];
        if (num > 60) {
          co[1] = parseInt(c);
          co[2] = parseInt(255-c);
        }else if (num < 60) {
          co[0] = parseInt(255-c);
          co[2] = parseInt(c);
        }else {
          co[2] = parseInt(255);
        }
        return 'rgb('+co.join(',')+')';
      }))
      , $(go.TextBlock, {
        margin : new go.Margin(margin, margin, fontSize + margin * 2, margin),
        stroke : cfg.stroke,
        font : cfg.font,
      }, new go.Binding('text', 'title')));
    ret.add($(go.TextBlock, {
      margin : new go.Margin(fontSize + margin * 2, margin, margin, margin),
      stroke : cfg.stroke,
      font : cfg.font,
    }, new go.Binding('text', 'score')));
    if (cfg.contextMenu) {
      ret.bind(new go.Binding('contextMenu', 'key', cfg.contextMenu));
    }
    return ret;
  },
  toolTip: function () {
    return $(go.Adornment, 'Auto', $(go.Shape, 'RoundedRectangle', {
      fill : '#FFFFCC',
      stroke : null
    }), $(go.TextBlock, {
      margin : 4
    }, new go.Binding('text', 'remark'), {
      width : 200,
      wrap : go.TextBlock.WrapFit,
      isMultiline : true
    }));
  },
  nodeTemplate: function (cfg) {
    let self = this
    cfg = cfg ? cfg : {};
    mt.extend({
      font : 'bold 12px Arial, Helvetica, sans-serif, Segoe UI',
      fontSize : 12,
      margin : 10,
      stroke : '#fff'
    }, cfg);
    return $(go.Node, 'Spot', {
      selectionObjectName : 'BODY',
      toolTip : self.toolTip()
    }, self.nodeBody(cfg));
  },
  linkTemplate: function (cfg, shape) {
    cfg = cfg ? cfg : {};
    mt.extend({
      routing : go.Link.Orthogonal, // smooth
      layerName : 'Background',
      selectable : true,
      corner : 20,
      curviness : 0
    }, cfg);
    shape = shape ? shape : {};
    mt.extend({
      toArrow : 'standard',
      stroke : '#fff',
      fill : '#fff',
      strokeWidth : 1.5
    }, shape);
    return $(go.Link, cfg, $(go.Shape, shape));
  }
}
