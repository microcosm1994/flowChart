import go from 'gojs'
import mt from '../mt/mt'
import colors from '../mt/Colors'
const $ = go.GraphObject.make

console.log();
export default {
  nodeBody: function (cfg) {
    let bg = mt.$('#bg');
    let bg0 = colors.$(bg);
    let fontSize = cfg.fontSize;
    let margin = cfg.margin;
    let ret = $(go.Panel, 'Auto', {
        name : 'BODY',
        portId : ''
      }, $(go.Shape, 'RoundedRectangle', {
        fill : bg0,
        stroke : null
      }, new go.Binding('fill', 'bg', function(bg) {
        return colors.$(bg);
      }))//
      , $(go.TextBlock, {
        margin : new go.Margin(margin, margin, margin, margin),
        stroke : cfg.stroke,
        font : cfg.font
      }, new go.Binding('text', 'title')));
    if (cfg.contextMenu) {
      ret.bind(new go.Binding('contextMenu', 'key', cfg.contextMenu));
    }
    return ret;
  },
  toolTip: function() {
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
  nodeTemplate: function(cfg) {
    let self = this
    cfg = cfg ? cfg : {};
    mt.extend({
      font : 'bold 12px Arial, Helvetica, sans-serif, Segoe UI',
      fontSize : 12,
      margin : 10,
      stroke : '#FFF'
    }, cfg);
    let font = cfg.font;
    return $(go.Node, 'Spot', {
      selectionObjectName : 'BODY',
      toolTip : self.toolTip()
    }, self.nodeBody(cfg));
  },
  linkTemplate: function(cfg, shape) {
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
      stroke : '#666',
      fill : '#666',
      strokeWidth : 1.5
    }, shape);
    return $(go.Link, cfg, $(go.Shape, shape));
    // return $(go.Link, cfg, $(go.Shape, shape), $(go.TextBlock, {
    // margin : 4
    // }, new go.Binding('text', 'weight'), {
    // segmentOffset : new go.Point(0, 12),
    // wrap : go.TextBlock.WrapFit,
    // isMultiline : true
    // }));
  }
}
