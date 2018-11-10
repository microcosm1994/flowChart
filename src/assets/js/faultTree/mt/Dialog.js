import store from '../../../../store/index'
import diagram from '../go/diagram'

function Dialog(diagram) {
	this.diagram = diagram;
	this.$store = store; // vuex
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
  // 添加节点
	addNode : function(o) {
		let d = o.data ? o.data : d;
		if (d.key) {
		  // 更新当前节点信息到vuex
      this.$store.commit('currentnNode', d)
      // 打开弹框
      this.$store.commit('modal', {
        title: '添加节点',
        name: 'addNode',
        switch: true
      })
    }
	},
  // 添加新连接
	addLink : function(o) {
		let diagram = this.diagram;
		let d = o.data ? o.data : o;
		if (d.key) {
		  // 保存当前节点到vuex
		  this.$store.commit('currentnNode', d)
      // 打开弹框
      this.$store.commit('modal', {
        title: '添加连接',
        name: 'addLink',
        switch: true
      })
    }
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
				mt.$('#api').innerHTML = d.api;
				mt.$('#confirm').innerHTML = d.confirm;
				mt.$('#end').innerHTML = d.end;
				mt.$('#remark').innerHTML = d.remark;
				mt.$('#weight0').innerHTML = d.weight0;
				mt.$('#weight1').innerHTML = d.weight1;
				mt.$('#weight2').innerHTML = d.weight2;
				mt.$('#weight3').innerHTML = d.weight3;
				mt.$('#score0').innerHTML = d.score0;
				mt.$('#score1').innerHTML = d.score1;
				mt.$('#score2').innerHTML = d.score2;
				mt.$('#score3').innerHTML = d.score3;
			}, function() {
				let api = 'http://ftpApi:9001/api/tree/load/save';// 删除节点接口
				$.ajax({
					type : 'post',
					dataType : 'json',
					url : api,
					data : JSON.stringify({
						all : diagram.modelJson(),
						key : d.key
					})
				}).done(function(d2) {// 接口返回数据
					this.diagram.removeObj(d);
				});
			});
		} else if (d.to) {
			this.modal(this.title.delLink, './' + 'dialog/fta/ref/del.htm', function() {
				mt.$('#from').innerHTML = d.from;
				mt.$('#to').innerHTML = d.to;
				mt.$('#weight').innerHTML = d.weight;
				mt.$('#order').innerHTML = d.order;
			}, function() {
				let api = 'http://ftpApi:9001/api/tree/load/save';// 删除链接接口
				$.ajax({
					type : 'post',
					dataType : 'json',
					url : api,
					data : JSON.stringify({
						all : diagram.modelJson(),
						key : d.key
					})
				}).done(function(d2) {// 接口返回数据
					this.diagram.removeObj(d);
				});
			});
		}
	},
  // 设置/编辑节点
	set : function(o) {
		let diagram = this.diagram;
		let d = o.data ? o.data : o;
    if (d.key) {
      // 更新当前节点信息到vuex
      this.$store.commit('currentnNode', d)
      // 打开弹框
      this.$store.commit('modal', {
        title: '编辑节点',
        name: 'put',
        switch: true
      })
		} else if (d.to) {
			this.modal(this.title.setLink, './dialog/fta/ref/set.htm', function() {
				mt.$('#from').value = d.from;
				mt.$('#to').value = d.to;
				mt.$('#weight').value = d.weight;
				mt.$('#order').value = d.order;
			}, function() {
				let api = 'http://ftpApi:9001/api/tree/load/save';// 修改连接接口
				$.ajax({
					type : 'post',
					dataType : 'json',
					url : api,
					data : JSON.stringify({
						all : diagram.modelJson(),
						key : d.key
					})
				}).done(function(d2) {// 接口返回数据
					d.from = mt.$('#from').value;
					d.to = mt.$('#to').value;
					d.weight = mt.$('#weight').value;
					d.order = mt.$('#order').value;
					diagram.updateLinkByData(d);
				});
			});
		}
	},
  // 计算
	compute : function(o) {
		let d = o.data ? o.data : o;
    if (d.key) {
		  // 节点分数
      let compute = {
        score0: d.score0,
        score1: d.score1,
        score2: d.score2,
        score3: d.score3
      }
      this.$store.commit('compute', compute)
      // 打开弹框
      this.$store.commit('modal', {
        title: '计算',
        name: 'compute',
        switch: true
      })
		}
	},
  // 保存节点
  save :function() {
    let diagram = this.diagram;
    let data = diagram.modelJson();
    let api = 'api/tree/save';
    console.log(data);
  },
	get : function(o) {
		// console.log(arguments);
		let d = o.data ? o.data : o;
		if (d.key) {
			this.modal(this.title.getNode, './dialog/fta/obj/get.htm', function() {
				mt.$('#key').innerHTML = d.key;
				mt.$('#title').innerHTML = d.title;
				mt.$('#selected').innerHTML = d.selected;
				mt.$('#api').innerHTML = d.api;
				mt.$('#confirm').innerHTML = d.confirm;
				mt.$('#end').innerHTML = d.end;
				mt.$('#remark').innerHTML = d.remark;
				mt.$('#total').innerHTML = d.total;
				mt.$('#weight0').innerHTML = d.weight0;
				mt.$('#weight1').innerHTML = d.weight1;
				mt.$('#weight2').innerHTML = d.weight2;
				mt.$('#weight3').innerHTML = d.weight3;
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
    'save' : '保存'
	}
}

export default new Dialog(diagram)
