function Dialog(diagram) {
  // console.log(arguments);
  this.diagram = diagram;
}
Dialog.prototype = {
  id : '#myModal',
  modal : function(title, url, onload, callback) {
    // console.log(arguments);
    let t = this;
    t.callback = callback;
    let diagram = t.diagram;
    $.ajax({
      type : 'GET',
      dataType : 'html',
      url : url
    }).done(function(content) {
      mt.$('#h_title_id').innerHTML = title;
      mt.$('#ModalBody').innerHTML = content;
      onload(content);
      $(t.id).modal({
        backdrop : true
      });
    }).fail(function() {
      console.log(arguments);
    });
  },
  ok : function() {
    this.callback();
    $(this.id).modal('hide');
  },
  addNode : function(o) {
    // console.log(arguments);
    let diagram = this.diagram;
    let d = o.data ? o.data : d;
    console.log(d);
    this.modal(this.title.addNode, './dialog/fta/obj/add.htm', function() {
    }, function() {
      // let api = '/9001/api/tree/load/save';

      // let data = {
      //   all : diagram.modelJson(),
      //   key : d.key
      // }
      if (d.key) {
        let data = {
          title: mt.$('#title').value,
          selected: mt.$('#selected').value,
          // api : mt.$('#api').value,
          confirm: mt.$('#confirm').value,
          leaf: mt.$('#end').value,
          remark: mt.$('#remark').value,
          // total : mt.$('#total').value,
          score0: mt.$('#score0').value,
          score1: mt.$('#score1').value,
          score2: mt.$('#score2').value,
          score3: mt.$('#score3').value
        };
        diagram.totalScore(data)
        diagram.updateNodeByKey(d.key);
        diagram.addNode(d, data);
      }
      // let success = function (s) {
      //   diagram.addNode(d, {
      //     title : mt.$('#title').value,
      //     selected : mt.$('#selected').value,
      //     api : mt.$('#api').value,
      //     confirm : mt.$('#confirm').value,
      //     leaf : mt.$('#end').value,
      //     remark : mt.$('#remark').value,
      //     total : mt.$('#total').value,
      //     score0 : mt.$('#score0').value,
      //     score1 : mt.$('#score1').value,
      //     score2 : mt.$('#score2').value,
      //     score3 : mt.$('#score3').value
      //   });
      // };
      // let onerror = function(e){
      //   alert(e);
      // };
      // mt.post(success,data,onerror);
      // 添加节点接口
      // 		$.ajax({
      // 			type : 'post',
      // 			dataType : 'json',
      // 			url : api,
      // 			data : JSON.stringify({
      // 				all : diagram.modelJson(),
      // 				key : d.key
      // 			})
      // 		}).done(function(d2) {// 接口返回数据
      // 		  console.log(d2);
      //
      // 		});
    });
  },
  addLink : function(o) {
    // console.log(arguments);
    let diagram = this.diagram;
    let d = o.data ? o.data : o;
    // console.log(o);
    // return false;
    this.modal(this.title.addLink, './dialog/fta/ref/add.htm', function() {
      mt.$('#from').value = d.key;
      mt.$('#to').value = d.key;
      mt.$('#order').value = 0;
      mt.$('#weight').value = 1.0;
    }, function() {
      let api = '/9001/api/tree/load/save';// 添加链接接口
      let newLink = {
        from : mt.$('#from').value,
        to : mt.$('#to').value,
        weight : mt.$('#weight').value,
        order : mt.$('#order').value
      };
      let data = {
        all : newLink,
        key : d.key
      };
      let success = function(a) {
        diagram.addLink(newLink);
      };
      mt.post(api, success, data, function(b) {
        console.log(b);
      });
    });
  },
  del : function(o) {
    // console.log(arguments);
    let diagram = this.diagram;
    let d = o.data ? o.data : o;
    if (d.key) {

      this.modal(this.title.delNode, './dialog/fta/obj/del.htm', function() {
        mt.$('#key').innerHTML = d.key;
        mt.$('#title').innerHTML = d.title;
        mt.$('#selected').innerHTML = d.selected;
        mt.$('#confirm').innerHTML = d.confirm;
        mt.$('#end').innerHTML = d.end;
        mt.$('#remark').innerHTML = d.remark;
        mt.$('#score0').innerHTML = d.score0;
        mt.$('#score1').innerHTML = d.score1;
        mt.$('#score2').innerHTML = d.score2;
        mt.$('#score3').innerHTML = d.score3;
      }, function() {
        let api = '/9001/api/tree/load/save';// 删除节点接口
        let success = function(a) {
          this.diagram.removeObj(d);
        };
        let data = JSON.stringify({
          all : diagram.modelJson(),
          key : d.key
        });
        mt.post(api, success, data, function(b) {
        })
      });
    } else if (d.to) {
      this.modal(this.title.delLink, './' + 'dialog/fta/ref/del.htm', function() {
        mt.$('#from').innerHTML = d.from;
        mt.$('#to').innerHTML = d.to;
        mt.$('#weight').innerHTML = d.weight;
        mt.$('#order').innerHTML = d.order;
      }, function() {
        let api = '/9001/api/tree/load/save';// 删除链接接口
        let success = function(a) {
          this.diagram.removeObj(d);
        };
        let data = JSON.stringify({
          all : diagram.modelJson(),
          key : d.key
        });
        mt.post(api, success, data, function(b) {
        })
      });
    }
  },
  set : function(o) {
    // console.log(arguments);
    let diagram = this.diagram;
    let d = o.data ? o.data : o;
    if (d.key) {
      this.modal(this.title.setNode, './dialog/fta/obj/set.htm', function() {
        console.log(d);
        mt.$('#title').value = d.title;
        mt.$('#key').value = d.key;
        if (d.selected) {
          mt.$('#selected')[0].checked = true;
        } else {
          mt.$('#selected')[1].checked = true;
        }
        if (d.confirm) {
          mt.$('#confirm')[0].checked = true;
        } else {
          mt.$('#confirm')[1].checked = true;
        }
        if (d.end) {
          mt.$('#end')[0].checked = true;
        } else {
          mt.$('#end')[1].checked = true;
        }
        mt.$('#score0').value = d.score0;
        mt.$('#score1').value = d.score1;
        mt.$('#score2').value = d.score2;
        mt.$('#score3').value = d.score3;
        mt.$('#remark').value = d.remark;
      }, function() {
        // 前端本地修改
        d.title = mt.$('#title').value;
        d.key = mt.$('#key').value;
        d.selected = mt.$('#selected').value;
        d.confirm = mt.$('#confirm').value;
        d.end = mt.$('#end').value;
        d.remark = mt.$('#remark').value;
        d.score0 = mt.$('#score0').value;
        d.score1 = mt.$('#score1').value;
        d.score2 = mt.$('#score2').value;
        d.score3 = mt.$('#score3').value;
        diagram.totalScore(d);
        diagram.updateNodeByKey(d.key);
        // TODO 提交到后端修改节点数据
        // let success = function(d2){
        // };
        // let data = JSON.stringify({
        // all : diagram.modelJson(),
        // key : d.key
        // })
        // mt.post(api,success,data,function (b) {
        //
        // })
      });
    } else if (d.to) {
      this.modal(this.title.setLink, './dialog/fta/ref/set.htm', function() {
        mt.$('#from').value = d.from;
        mt.$('#to').value = d.to;
        mt.$('#weight').value = d.weight;
        mt.$('#order').value = d.order;
      }, function() {
        let api = '/9001/api/tree/load/save';// 修改连接接口
        let success = function(d2) {
          d.from = mt.$('#from').value;
          d.to = mt.$('#to').value;
          d.weight = mt.$('#weight').value;
          d.order = mt.$('#order').value;
          diagram.updateLinkByData(d);
        };
        let data = JSON.stringify({
          all : diagram.modelJson(),
          key : d.key
        })
        mt.post(api, success, data, function(b) {
        });
      });
    }
  },
  compute : function(o) {
    // console.log(arguments);
    let diagram = this.diagram;
    let d = o.data ? o.data : o;
    let api = d.api;
    // TODO 先写个示例，以后应去掉
    // /9001/api/tree/save
    console.log(d);
    api = 'api/tree/save';
    // console.log(api);
    let success = function(d2) {// 接口返回数据
      // console.log(1);
      d.score0 = d2.score0;
      d.score1 = d2.score1;
      d.score2 = d2.score2;
      d.score3 = d2.score3;
      diagram.updateNodeByKey(d);
    };
    mt.post(api, success, diagram.modelData(), function() {
      // onerror
    });
    if (d.key) {
      this.modal(this.title.compute, './dialog/fta/obj/add.htm', function() {
        mt.$('#score0').innerHTML = d.score0;
        mt.$('#score1').innerHTML = d.score1;
        mt.$('#score2').innerHTML = d.score2;
        mt.$('#score3').innerHTML = d.score3;
      })
    }
  },
  save : function(o) {
    let diagram = this.diagram;
    let data = diagram.modelJson();
    console.log(o);
    let d = o.data ? o.data : o;
    let api = '/9001/api/tree/save';
    console.log(data);
    // console.log(api);
    let success = function(d2) {// 接口返回数据
      // console.log(1);
      d.score0 = d2.score0;
      d.score1 = d2.score1;
      d.score2 = d2.score2;
      d.score3 = d2.score3;
      diagram.updateNodeByKey(d);
    };
    // let success = function(res) {// 接口返回数据
    // };
    mt.post(api, success, diagram.modelData(), function() {
      // onerror
    }, {
      t : mt.$c('t')
    });
  },
  get : function(o) {
    // console.log(arguments);
    let d = o.data ? o.data : o;
    if (d.key) {
      this.modal(this.title.getNode, './dialog/fta/obj/get.htm', function() {
        mt.$('#key').innerHTML = d.key;
        mt.$('#title').innerHTML = d.title;
        mt.$('#selected').innerHTML = d.selected;
        mt.$('#confirm').innerHTML = d.confirm;
        mt.$('#end').innerHTML = d.end;
        mt.$('#remark').innerHTML = d.remark;
        mt.$('#score0').innerHTML = d.score0;
        mt.$('#score1').innerHTML = d.score1;
        mt.$('#score2').innerHTML = d.score2;
        mt.$('#score3').innerHTML = d.score3;
      });
    } else if (d.to) {
      this.modal(this.title.getLink, './dialog/fta/ref/get.htm', function() {
        mt.$('#from').innerHTML = d.from;
        mt.$('#to').innerHTML = d.to;
        mt.$('#weight').innerHTML = d.weight;
        mt.$('#order').innerHTML = d.order;
      });
    }
  },
  weight : function(o) {
    // console.log(arguments);
    let diagram = this.diagram;
    console.log(o);
    // return false;
    //let d = o.data ? o.data : d;
    this.modal(this.title.addNode, './dialog/fta/obj/add.htm', function() {
    }, function() {
      let api = '/9001/api/tree/load/save';// 添加节点接口
      $.ajax({
        type : 'post',
        dataType : 'json',
        url : api,
        data : JSON.stringify({
          all : diagram.modelJson(),
          key : d.key
        })
      }).done(function(d2) {// 接口返回数据
        diagram.addNode(d, {
          weight0 : mt.$('#weight0').value,
          weight1 : mt.$('#weight1').value,
          weight2 : mt.$('#weight2').value,
          weight3 : mt.$('#weight3').value,
        });
      });
    });
  },
  title : {
    'addNode' : '添加新节点',
    'addLink' : '添加新连接',
    'delNode' : '删除当前节点',
    'delLink' : '删除当前连接',
    'setNode' : '编辑节点信息',
    'setLink' : '编辑连接信息',
    'getNode' : '查看节点信息',
    'getLink' : '查看连接信息',
    'compute' : '计算',
    'save' : '保存',
    'weight': '权重'
  }
};
