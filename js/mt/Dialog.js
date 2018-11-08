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
		this.modal(this.title.addNode, './dialog/fta/obj/add.htm', function() {
		}, function() {
			let api = 'http://ftpApi:9001/api/tree/load/save';// 添加节点接口
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
					title : mt.$('#title').value,
					selected : mt.$('#selected').value,
					api : mt.$('#api').value,
					confirm : mt.$('#confirm').value,
					leaf : mt.$('#end').value,
					remark : mt.$('#remark').value,
					total : mt.$('#total').value,
					weight0 : mt.$('#weight0').value,
					weight1 : mt.$('#weight1').value,
					weight2 : mt.$('#weight2').value,
					weight3 : mt.$('#weight3').value,
					score0 : mt.$('#score0').value,
					score1 : mt.$('#score1').value,
					score2 : mt.$('#score2').value,
					score3 : mt.$('#score3').value
				});
			});
		});
	},
	addLink : function(o) {
		// console.log(arguments);
		let diagram = this.diagram;
		let d = o.data ? o.data : o;
		this.modal(this.title.addLink, './dialog/fta/ref/add.htm', function() {
			mt.$('#from').value = d.key;
			mt.$('#to').value = d.key;
			mt.$('#order').value = 0;
			mt.$('#weight').value = 1.0;
		}, function() {
			let api = 'http://ftpApi:9001/api/tree/load/save';// 添加链接接口
			$.ajax({
				type : 'post',
				dataType : 'json',
				url : api,
				data : JSON.stringify({
					all : diagram.modelJson(),
					key : d.key
				})
			}).done(function(d2) {// 接口返回数据
				let newLink = {
					from : mt.$('#from').value,
					to : mt.$('#to').value,
					weight : mt.$('#weight').value,
					order : mt.$('#order').value
				};
				diagram.addLink(newLink);
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
				mt.$('#weight0').value = d.weight0;
				mt.$('#weight1').value = d.weight1;
				mt.$('#weight2').value = d.weight2;
				mt.$('#weight3').value = d.weight3;
				mt.$('#score0').value = d.score0;
				mt.$('#score1').value = d.score1;
				mt.$('#score2').value = d.score2;
				mt.$('#score3').value = d.score3;
				mt.$('#remark').value = d.remark;
			}, function() {
				let api = 'http://ftpApi:9001/api/tree/load/save';// 修改节点接口
				$.ajax({
					type : 'post',
					dataType : 'json',
					url : api,
					data : JSON.stringify({
						all : diagram.modelJson(),
						key : d.key
					})
				}).done(function(d2) {// 接口返回数据
					d.title = mt.$('#title').value;
					d.key = mt.$('#key').value;
					d.selected = mt.$('#selected').value;
					d.api = mt.$('#api').value;
					d.confirm = mt.$('#confirm').value;
					d.end = mt.$('#end').value;
					d.remark = mt.$('#remark').value;
					d.weight0 = mt.$('#weight0').value;
					d.weight1 = mt.$('#weight1').value;
					d.weight2 = mt.$('#weight2').value;
					d.weight3 = mt.$('#weight3').value;
					d.score0 = mt.$('#score0').value;
					d.score1 = mt.$('#score1').value;
					d.score2 = mt.$('#score2').value;
					d.score3 = mt.$('#score3').value;
					diagram.updateNodeByKey(d.key);
				});
			});
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
	compute : function(o) {
    // console.log(arguments);
		let diagram = this.diagram;
		let d = o.data ? o.data : o;
    let api = d.api;
		// TODO 先写个示例，以后应去掉
		// /9001/api/tree/save
		if (d.key) {
			this.modal(this.title.compute, './dialog/fta/obj/compute.htm', function() {
				mt.$('#score0').innerHTML = d.score0;
				mt.$('#score1').innerHTML = d.score1;
				mt.$('#score2').innerHTML = d.score2;
				mt.$('#score3').innerHTML = d.score3;
			})
		}
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
		// $.ajax({
		// type : 'post',
		// dataType : 'json',
		// url : api,
		// data : diagram.modelData(),
		// }).done(success);
	},
  save :function() {
    let diagram = this.diagram;
    let data = diagram.modelJson();
    let api = 'api/tree/save';
    console.log(data);
    // console.log(api);
    let success = function(res) {// 接口返回数据
      console.log(res);
    };
    mt.post(api, success, diagram.modelData(), function() {
      // onerror
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
};
