(function() {
  // console.log(arguments);
  let diagram = myDiagram;// go diagram
  let copied;
  function addLink(src, dst){
    // console.log(arguments);
    src = src.data ? src.data : src;
    dst = dst.data ? dst.data : dst;
    console.log(dst);
    console.log(src);
    diagram.model.addLinkData({
      'from' : src.key,
      'to' : dst.key,
      "uid": src.uid,
      "weight": src.weight,
      "order": 1,
      "createTime": '',
      "updateTime": "2018-11-08 00:00:00",
      "deleted": 0
    });
  }
  function copyNode(src, dst) {
    // console.log(arguments);
    let ret;
    if (src && dst) {
      let copied = diagram.cloneNodeData(src);
      // console.log(copied);
      diagram.model.addNodeData(copied);
      addLink(dst, copied);
      ret = diagram.findNodeForKey(copied.key);
    }
    return ret;
  }
  diagram.addDiagramListener("ClipboardChanged", function(e) {// Ctrl-C

    copied = diagram.selection.first();

  });
  go.CommandHandler.prototype.pasteSelection = function() {// Ctrl-V

    diagram.copyTree(copied, diagram.selection.first());
  };
  diagram.cloneNodeData = function(src) {
    // console.log(arguments);
    src = src.data ? src.data : src;
    let ret = {};
    for ( let n in src) {
      ret[n] = src[n];
    }
    // delete ret.key;
    delete ret.__gohashid;
    diagram.model.makeNodeDataKeyUnique(ret);
    return ret;
  };
  diagram.addLink = function(d) {
    diagram.startTransaction('addLink start');
    diagram.model.addLinkData(d);
    diagram.commitTransaction('addLink commit');
  };
  diagram.addNode = function(p, c) {
    p = p.data ? p.data : p;
    c = c.data ? c.data : c;
    diagram.startTransaction('addNode start');
    diagram.model.makeNodeDataKeyUnique(c);
    diagram.model.addNodeData(c);
    diagram.model.addLinkData({
      from : p.key,
      to : c.key,
      uid: p.uid,
      weight:p.weight,
      order: 1,
      createTime: '',
      updateTime:"2018-11-08 00:00:00",
      deleted: 0
    });
    diagram.commitTransaction('addNode commit');
  };
  diagram.copyNode = function(src, dst) {
    // console.log(arguments);
    if (src && dst) {
      diagram.startTransaction('copyNode');
      copyNode(src, dst);
      diagram.commitTransaction('copyNode');
    }
  };
  diagram.copyTree = function(src, p) {
    if (src && p) {
      diagram.startTransaction('copyTree');
      let dst = copyNode(src, p);
      let chainKeySet = new Set;
      chainKeySet.add(dst.data.key);
      diagram.copyChildren(src, dst, chainKeySet);
      diagram.commitTransaction('copyTree');
    }
  };
  diagram.copyChildren = function(src, p, chainKeySet) {
    // top for no repeat
    // console.log(arguments);
    let a = [];
    let it = src.findTreeChildrenNodes();// get children links
    while (it.next()) {// now iterate through them and clear out the boss information
      let toNode = it.value;
      if (chainKeySet.has(toNode.data.key)) {
        // console.log(toNode.data.key);
      } else {
        a.push(toNode);
      }
    }
    while (a.length > 0) {// remove all children
      let src2 = a.pop();
      let dst = copyNode(src2, p);
      let dstKey = dst.data.key;
      chainKeySet.add(dstKey);
      diagram.copyChildren(src2, dst, chainKeySet);
      chainKeySet['delete'](dstKey);
    }
  };
}).push();
