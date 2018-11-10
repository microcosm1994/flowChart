(function(w, $) {
  w.nodeFillConverter = function(key) {
    let d = myDiagram.model.findNodeDataForKey(key);
    switch (figure) {
      case 'AndGate':
        return $(go.Brush, 'Linear', {
          0 : '#EA8100',
          1 : '#C66D00',
          start : go.Spot.Right,
          end : go.Spot.Left
        });
      case 'OrGate':
        return $(go.Brush, 'Linear', {
          0 : '#0058D3',
          1 : '#004FB7',
          start : go.Spot.Right,
          end : go.Spot.Left
        });
      case 'Circle':
        return $(go.Brush, 'Linear', {
          0 : '#009620',
          1 : '#007717'
        });
      case 'Triangle':
        return $(go.Brush, 'Linear', {
          0 : '#7A0099',
          1 : '#63007F'
        });
      default:
      // return '#FFF';
    }
  };
  w.nodeBody = function(cfg) {
    let bg = mt.$('#bg');
    // let bg0 = colors.$(bg);
    let fontSize = cfg.fontSize;
    let margin = cfg.margin;
    let digram = myDiagram;
    // console.log(bg0);
    console.log(myDiagram);
    let ret = $(go.Panel, 'Auto', {
        name : 'BODY',
        portId : ''
      }, $(go.Shape, 'RoundedRectangle', {
        fill : "yellow",
        stroke : null
      }, new go.Binding('fill', 'score', function(score) {
        let color = new Array(3);
        let num = score;
        let index;
        let c = 255/100*num;
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
        // let colors = digram.colors;
        // let color = colors[score];
        // if (typeof color == 'undefined') {
        //   let a = [];
        // 	for (let n in colors) {
        // 		a.push(n);
        // 	}
        // 	// 排序
        // 	a.sort(function(x, y) {
        // 		if (x < y) {
        // 			return -1;
        // 		} else if (x > y) {
        // 			return 1;
        // 		} else {
        // 			return 0;
        // 		}
        // 	});
        //   // 已经有序了
        // 	for (let i = 1; i < a.length; i++) {
        // 		let score0 = a[i - 1];
        // 		let score1 = a[i];
        //     if (score0 - 1 < score && score < score1) {
        //       let color0 = colors[score0];
        // 			let color1 = colors[score1];
        //       // TODO 颜色由网页代码变成RGB数字
        //       color0 = colorRgb(color0[0])
        //       color1 = colorRgb(color1[0])
        // 			// 线性插值公式
        // 			color = color0 + (color1 - color0) * (score - score0) / (score1 - score0);
        // 			// TODO 颜色由RGB数字变回网页代码
        //       color = colorHex(color)
        //       console.log(color);
        // 			break;
        // 		}
        // 	}
        // }
        //   return color;
      }))//
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
  };
  w.toolTip = function() {
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
  };
  w.nodeTemplate = function(cfg) {
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
      toolTip : toolTip()
    }, nodeBody(cfg));
  };
  w.linkTemplate = function(cfg, shape) {
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
  };
  /* RGB转16*/
  // w.colorHex = function(that){
  //   let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  //   if(/^(rgb|RGB)/.test(that)){
  //     var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
  //     var strHex = "#";
  //     for(var i=0; i<aColor.length; i++){
  //       var hex = Number(aColor[i]).toString(16);
  //       if(hex === "0"){
  //         hex += hex;
  //       }
  //       strHex += hex;
  //     }
  //     if(strHex.length !== 7){
  //       strHex = that;
  //     }
  //     return strHex;
  //   }else if(reg.test(that)){
  //     var aNum = that.replace(/#/,"").split("");
  //     if(aNum.length === 6){
  //       return that;
  //     }else if(aNum.length === 3){
  //       var numHex = "#";
  //       for(var i=0; i<aNum.length; i+=1){
  //         numHex += (aNum[i]+aNum[i]);
  //       }
  //       return numHex;
  //     }
  //   }else{
  //     return that;
  //   }
  // };
  /* 16进制转RGB*/
  // w.colorRgb = function(sColor){
  //   let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  //   if(sColor && reg.test(sColor)){
  //     if(sColor.length === 4){
  //       var sColorNew = "#";
  //       for(var i=1; i<4; i+=1){
  //         sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
  //       }
  //       sColor = sColorNew;
  //     }
  //     //处理六位的颜色值
  //     var sColorChange = [];
  //     for(var i=1; i<7; i+=2){
  //       sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
  //     }
  //     return sColorChange[0] - 0 + sColorChange[1] - 0 + sColorChange[2] - 0
  //   }else{
  //     return sColor;
  //   }
  // };
})(window, go.GraphObject.make);
