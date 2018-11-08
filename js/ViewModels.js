//Main ViewModel class
function MianViewModel() {
	var self = this;
	this.FTProperties;
	this.LGVM;
	this.EventVM;
	this.FTDiagram = new FTADiagramViewModel(this);
	self.Title = ko.observable('Test');
	self.FTPropertiesLabel = ko.observable('Save changes');
	self.ISFTPropertiesMode = ko.observable(true);
	self.ISNewFTPropertiesMode = ko.observable(false);
	self.FTVCalcTypes = Array();
	self.ProbCalcModes = Array();
	self.PrimaryEvents = Array();
	self.GateTypes = ko.observableArray([ {} ]);
	self.getGateTypes = function(data) {
		self.GateTypes.removeAll();
		$.getJSON("./json/GateTypeList.json", function(jsondata) {
			var array = self.GateTypes();
			ko.utils.arrayPushAll(array, jsondata.List);
			self.GateTypes.valueHasMutated();
			var arrayftcalc = self.FTVCalcTypes;
			ko.utils.arrayPushAll(arrayftcalc, jsondata.FTCalcTypeList);
			var probmodes = self.ProbCalcModes;
			ko.utils.arrayPushAll(probmodes, jsondata.ProbCalcModesList);
		}).fail(function() {
			alert("fail");
		});
	}
	self.missionTimeVisible = ko.observable(false);
	self.getGateTypes();
}
MianViewModel.prototype.GetEventsReport = function(myDiagram) {
	$.ajax({
		type : "GET",
		url : "./EventsReport.htm"
	}).success(function(data) {
		$('.modal-dialog-table').css('width', '80%').css('left', '30%');
		$('#report_list_div_id').html(data);
		$('#myModalReport').modal('show');
	});
}
MianViewModel.prototype.GetGatesReport = function(data) {
	$.ajax({
		type : "GET",
		url : "./GatesReport.htm",
	}).success(function(data) {
		$('.modal-dialog-table').css('width', '80%').css('left', '30%');
		$('#report_list_div_id').html(data);
		$('#myModalReport').modal('show');
	});
}
function DownloadReport(data) {
	var data = $('#report_header_id').html();
	console.log(data);
	window.location = './Report/DownloadReport?report=' + data;
}
MianViewModel.prototype.ISLogIn = function(cardid, callback) {
	callback();
}
MianViewModel.prototype.LogIn = function(cardid) {
	$.ajax({
		url : "./Account/Login/",
		type : 'GET',
		dataType : 'html'// <-- to expect an html response
	}).done(function(returnPayload) {
		// console.log(returnPayload.gatelist);
		// mainVM.FTDiagram.ReloadDiagram(returnPayload);
		// $('#myModalProperties').modal('hide');
		// console.log(returnPayload);
		$("#customContentid").html(returnPayload);
		// Open login
		$('#CustomModalid').modal({
			backdrop : false
		})
		$('#CustomModalid').on('hidden.bs.modal', function(e) {
			$('#customContentid').empty();
		});
	});
	// $('#customContentid').load();
}
MianViewModel.prototype.ShowCardByID = function(cardid) {
	// console.log(cardid + ' ' + title);
	// set visible div //FTProperties
	$('#' + cardid).show();
	// open modal
	$('#myModalProperties').modal({
		backdrop : true
	})
}
MianViewModel.prototype.ZoomToFit = function(type) {
	if (type == 1)
		myDiagram.zoomToFit();
	else
		myDiagram.scale = 1;
}
MianViewModel.prototype.NewFT = function() {
	var jqxhr = $.getJSON("./FTA/CreateNewFaultTree", "lg");
	jqxhr.done(function(data) {
		if (ReloadAfterTimeOut(data))
			return;
		myDiagram.clear();
		// myDiagram.model.clear();
		myDiagram.model = new go.GraphLinksModel(data.gatelist, data.gatelinklist);
	});
}
MianViewModel.prototype.CreateNewFT = function() {
	console.log(mainVM.GetFTProperties);
	mainVM.ISNewFTPropertiesMode(true);
	mainVM.ISLogIn("0", mainVM.GetFTProperties, 'new');
}
MianViewModel.prototype.GetFTProperties = function(inputData, calcmode) {
	$('#FTPropertiesAlertID').hide();
	var url = "./json/FTproperties.json";
	if (inputData == 'new' || mainVM.ISNewFTPropertiesMode() == true) {
		// console.log('new');
		url = "./json/InitNewFaultTree.json";
		mainVM.Title('Fault Tree propetries');
		mainVM.FTPropertiesLabel('Save changes');
		mainVM.ISNewFTPropertiesMode(false);
	} else {
		if (inputData == 'calcmode') {
			mainVM.ISFTPropertiesMode(false);
			mainVM.Title('Calculation parameters');
			mainVM.FTPropertiesLabel('Calculate');
		} else {
			mainVM.ISFTPropertiesMode(true);
			mainVM.Title('Fault Tree propetries');
			mainVM.FTPropertiesLabel('Save changes');
		}
	}
	var jqxhr = $.getJSON(url, "lg");
	jqxhr.done(function(data) {
		// ko.observable(ko.mapping.fromJS(data));
		if (ReloadAfterTimeOut(data))
			return;
		if (typeof mainVM.FTPropertiesVM == 'undefined') {
			// console.log(mainVM.FTPropertiesVM);
			// mainVM.FTPropertiesVM = ko.mapping.fromJS(data);
			mainVM.FTPropertiesVM = ko.mapping.fromJS(data);
			var div = $("#myModalProperties").get(0);
			ko.applyBindings(mainVM, div);
		} else {
			// console.log('defined' + mainVM.FTPropertiesVM);
			ko.mapping.fromJS(data, mainVM.FTPropertiesVM);
		}
		if (mainVM.FTPropertiesVM.CalcType() == '3')
			mainVM.missionTimeVisible(true);
		mainVM.FTPropertiesVM.CalcType.subscribe(function(newValue) {
			// console.log(newValue);
			if (newValue == '3') {
				mainVM.missionTimeVisible(true);
			} else {
				mainVM.missionTimeVisible(false);
			}
		});
		// $('#h_title_id').append("Logical Gate Data");
		mainVM.ShowCardByID('FTProperties');
	});
	jqxhr.fail(function() {
		// alert("fail");
	});
}
MianViewModel.prototype.SaveFT = function() {
	if (!mainVM.ISFTPropertiesMode()) {
		mainVM.FTDiagram.FTCalculation();
		$('#myModalProperties').modal('hide');
		return;
	}
	// UpdateFTProperties
	var data = ko.toJSON(mainVM.FTPropertiesVM);
	var cntUrl = "./FTA/UpdateFTProperties";
	// console.log(mainVM.FTPropertiesVM.TrackingState());
	// console.log(data.TrackingState);
	if (mainVM.FTPropertiesVM.TrackingState() == 1) {
		cntUrl = "./FTA/CreateNewFaultTree";
	}
	// console.log(ObsData.TrackingState() == '1');
	// mainVM.FTDiagram.UpdateDiagram(cnt.FaultTreeModel);
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : cntUrl, // "FTA/UpdateFTProperties",
		data : "data=" + data
	}).done(function(returnPayload) {
		if (ReloadAfterTimeOut(returnPayload))
			return;
		// console.log(returnPayload.gatelist);
		if (returnPayload.gatelist == null) {
			// console.log(returnPayload.gatelist);
			$('#FTPropertiesAlertID').empty();
			$('#FTPropertiesAlertID').append(returnPayload.Msg);
			$('#FTPropertiesAlertID').show();
			return;
		}
		mainVM.FTDiagram.ReloadDiagram(returnPayload);
		$('#myModalProperties').modal('hide');
	});
}
MianViewModel.prototype.ShowProgress = function(Guid, myDiagram) {
}
MianViewModel.prototype.HideProgress = function(Guid, myDiagram) {
}
MianViewModel.prototype.RunCalculation = function(Guid, myDiagram) {
	this.FTDiagram.LoadFTByGuid(Guid, myDiagram);
}
MianViewModel.prototype.InitGateVM = function(myDiagram, data) {
	mainVM.LGVM = new LogicalGateViewModel(self);
	mainVM.LGVM.GateTypes = this.GateTypes;
	if (myDiagram) {
		mainVM.LGVM.ObsData = ko.mapping.fromJS(myDiagram.selection.first().data);
	} else
		mainVM.LGVM.ObsData = ko.mapping.fromJS(data);
	// set binding
	var menu = $("#GateCard").get(0); // myModal
	ko.applyBindings(mainVM.LGVM, menu);
	mainVM.GetSelectedGateTypeDesc(mainVM.LGVM.ObsData.GateType());
	mainVM.LGVM.ObsData.GateType.subscribe(function(newValue) {
		if (newValue == '2') {
			mainVM.LGVM.KofNVisible(true);
		} else {
			mainVM.LGVM.KofNVisible(false);
		}
		mainVM.GetSelectedGateTypeDesc(newValue);
	});
}
MianViewModel.prototype.InitEventVM = function(myDiagram, data) {
	mainVM.EventVM = new EventViewModel(self);
	mainVM.EventVM.ProbCalcModes = this.ProbCalcModes;
	if (myDiagram) {
		// console.log("myDiagram befor save TrackingState is " +
		// myDiagram.selection.first().data.LinkedEvent.TrackingState());
		mainVM.EventVM.ObsData = ko.mapping.fromJS(myDiagram.selection.first().data.LinkedEvent);
	} else {
		// console.log("befor save TrackingState is " +
		// data.LinkedEvent.TrackingState());
		mainVM.EventVM.ObsData = ko.mapping.fromJS(data.LinkedEvent);
	}
	// set binding
	var menu = $("#EventCard").get(0);
	// myModal
	ko.applyBindings(mainVM.EventVM, menu);
	mainVM.Title("Edit Event"); // GetSelectedCalcModeDesc
	mainVM.GetSelectedCalcModeDesc(mainVM.EventVM.ObsData.EventCalcType());
	mainVM.EventVM.SetEventCalcParamsVisisble(mainVM.EventVM.ObsData.EventCalcType());
	mainVM.EventVM.ObsData.EventCalcType.subscribe(function(newValue) {
		mainVM.EventVM.SetEventCalcParamsVisisble(newValue);
		mainVM.GetSelectedCalcModeDesc(newValue);
	});
}
MianViewModel.prototype.GetSelectedGateTypeDesc = function(newValue) {
	for (var y = 0; y < mainVM.LGVM.GateTypes().length; y++) {
		if (mainVM.LGVM.GateTypes()[y].EnumValue == newValue) {
			// console.log(mainVM.LGVM.GateTypes()[y]);
			self.SelectedGateTypeDesc(mainVM.LGVM.GateTypes()[y].EnumBOName);
		}
	}
}
MianViewModel.prototype.GetSelectedCalcModeDesc = function(newValue) {
	// console.log(mainVM.EventVM.ProbCalcModes);
	for (var y = 0; y < mainVM.EventVM.ProbCalcModes.length; y++) {
		if (mainVM.EventVM.ProbCalcModes[y].EnumValue == newValue) {
			// console.log(mainVM.LGVM.GateTypes()[y]);
			mainVM.EventVM.SelectedEventCalcMode(mainVM.EventVM.ProbCalcModes[y].EnumBOName);
		}
	}
}
// get new logical gate
MianViewModel.prototype.AddLogicalGate = function() {
	$.ajax({
		type : 'GET',
		dataType : 'json',
		url : "./json/InitGate.json",
		data : "data=" + JSON.stringify(myDiagram.selection.first().data)
	}).done(function(returnPayload) {
		if (ReloadAfterTimeOut(returnPayload))
			return;
		if (typeof mainVM.LGVM == 'undefined') {
			mainVM.LGVM = new LogicalGateViewModel(mainVM, returnPayload);
			mainVM.LGVM.GateTypes = mainVM.GateTypes;
			// console.log(mainVM.LGVM.GateTypes);
			mainVM.LGVM.ObsData = ko.mapping.fromJS(returnPayload);
			var menu = $("#GateCard").get(0);
			ko.applyBindings(mainVM.LGVM, menu);
			mainVM.GetSelectedGateTypeDesc(mainVM.LGVM.ObsData.GateType());
			mainVM.LGVM.ObsData.GateType.subscribe(function(newValue) {
				if (newValue == '2') {
					mainVM.LGVM.KofNVisible(true);
					// figure"
					// mainVM.LGVM.ObsData.figure('');
				} else {
					mainVM.LGVM.KofNVisible(false);
				}
				mainVM.GetSelectedGateTypeDesc(newValue);
			});
		} else {
			mainVM.LGVM.KofNVisible(false);
			ko.mapping.fromJS(returnPayload, mainVM.LGVM.ObsData);
		}
		mainVM.LGVM.InvokeLGate(mainVM, returnPayload, '#GateCard');
	}).fail(function() {
		// TODO
	});
}
// get new logical gate
MianViewModel.prototype.AddEventGate = function() {
	if (!mainVM.IF_SelectedNodeLogicalGate())
		return;
	$.ajax({
		type : 'GET',
		dataType : 'json',
		url : "./json/InitEventGate.json",
		data : "data=" + JSON.stringify(myDiagram.selection.first().data)
	}).done(function(returnPayload) {
		if (ReloadAfterTimeOut(returnPayload))
			return;
		if (typeof mainVM.EventVM == 'undefined') {
			mainVM.EventVM = new EventViewModel(mainVM);
			mainVM.EventVM.ProbCalcModes = mainVM.ProbCalcModes;
			mainVM.EventVM.ObsData = ko.mapping.fromJS(returnPayload.LinkedEvent);
			var menu = $("#EventCard").get(0);
			ko.applyBindings(mainVM.EventVM, menu);
			mainVM.Title("Edit Event"); // GetSelectedCalcModeDesc
			mainVM.GetSelectedCalcModeDesc(mainVM.EventVM.ObsData.EventCalcType());
			mainVM.EventVM.SetEventCalcParamsVisisble(mainVM.EventVM.ObsData.EventCalcType());
			mainVM.EventVM.ObsData.EventCalcType.subscribe(function(newValue) {
				mainVM.EventVM.SetEventCalcParamsVisisble(newValue);
				mainVM.GetSelectedCalcModeDesc(newValue);
			});
		} else {
			ko.mapping.fromJS(returnPayload.LinkedEvent, mainVM.EventVM.ObsData);
		}
		mainVM.InvokeEventGate(mainVM, returnPayload.LinkedEvent, '#GateCard');
	});
}
MianViewModel.prototype.IF_SelectedNodeLogicalGate = function() {
	var data = myDiagram.selection.first().data;
	if (data.GateType == '4' || data.GateType == '5' || data.GateType == '6') {
		return false;
	} else
		return true;
}
MianViewModel.prototype.OpenLGateOrEvent = function(myDiagram) {
	var data = myDiagram.selection.first().data;
	if (data.GateType == '4' || data.GateType == '5' || data.GateType == '6') {
		mainVM.OpenEvent(myDiagram);
	} else {
		mainVM.OpenLogicalGate(myDiagram);
	}
}
MianViewModel.prototype.OpenEvent = function(myDiagram) {
	// InitEventVM
	myDiagram.centerRect(myDiagram.selection.first().actualBounds);
	// create logical gate vm
	if (typeof mainVM.EventVM == 'undefined') {
		this.InitEventVM(myDiagram);
	} else {
		mainVM.EventVM.SetEventData(myDiagram.selection.first().data);
	}
	mainVM.InvokeEventGate(self, myDiagram.selection.first().data, '#GateCard');
}
MianViewModel.prototype.OpenLogicalGate = function(myDiagram) {
	myDiagram.centerRect(myDiagram.selection.first().actualBounds);
	// create logical gate vm
	if (typeof mainVM.LGVM == 'undefined') {
		this.InitGateVM(myDiagram);
	} else {
		mainVM.LGVM.SetGateData(myDiagram.selection.first().data);
	}
	mainVM.LGVM.InvokeLGate(self, myDiagram.selection.first().data, '#GateCard');
}
MianViewModel.prototype.InvokeEventGate = function(mainVM, data) {
	// create logical gate vm
	// this.EventVM = new EventViewModel(mainVM, data);
	// set binding
	// ko.applyBindings(mainVM.EventVM.ObsData);
	$('#h_title_id').empty();
	$('#h_title_id').append("Event Data");
	$('#EventAlertID').hide();
	// GateCard
	$('#GateCard').hide();
	// set visible div
	$('#EventCard').show();
	// open modal
	$('#myModal').modal({
		backdrop : false
	})
}
// Add exist event to the diagram
MianViewModel.prototype.SelectEvent = function(item) {
	$('#myModalTable').modal('hide');
	mainVM.AddExistEventGate(item);
}
MianViewModel.prototype.AddExistEvent = function() {
	if (!mainVM.IF_SelectedNodeLogicalGate())
		return;
	// GatePrimaryEventsList
	$.getJSON("./json/GatePrimaryEventsList.json", function(jsondata) {
		// console.log(jsondata.List);
		/*
		 * var array = self.GateTypes(); //console.log(self.GateTypes);
		 * ko.utils.arrayPushAll(array, jsondata.List);
		 * self.GateTypes.valueHasMutated();
		 * 
		 * var arrayftcalc = self.FTVCalcTypes;
		 * ko.utils.arrayPushAll(arrayftcalc, jsondata.FTCalcTypeList);
		 * 
		 * var probmodes = self.ProbCalcModes; ko.utils.arrayPushAll(probmodes,
		 * jsondata.ProbCalcModesList);
		 */
		var keyDic = new go.List("string");
		// console.log(jsondata);
		// var probmodes = mainVM.PrimaryEvents;
		// ko.utils.arrayPushAll(probmodes, jsondata);
		mainVM.PrimaryEvents = jsondata
		// PrimaryEvents
		$.each(jsondata, function(index, item) {
			// console.log(item);
			if (index == 0) {
				$('#listid').append('<thead><tr><th>Code</th><th>Description</th></tr></thead>');
			}
			// if (item.category == 'gateTemplateLast')
			{
				if (!keyDic.contains(item.Code)) {
					keyDic.add(item.Code);
					// self.PrimaryEvents.a
					// var dd = '' + item.Code + '';
					var dd = item.Code;
					// console.log(dd);
					var desc = (item.Desc) ? item.Desc.substring(0, 70) : '';
					$('#listid').append('<tr onclick="mainVM.SelectEvent(\'' + dd + '\')"><td>' + item.Code + '</td><td>' + desc + '</td></tr>');
				}
			}
		});
		// clear header data
		$('#myModalTableLabel').empty();
		$('#myModalTableLabel').append("Events List");
		$('#modal_list_header_content').hide();
		// show data
		mainVM.FTDiagram.ShowTable();
	}).fail(function() {
		alert("fail");
	});
}
MianViewModel.prototype.AddExistEvent_backup = function() {
	if (!mainVM.IF_SelectedNodeLogicalGate())
		return;
	var keyDic = new go.List("string");
	// create events list
	$.each(myDiagram.model.nodeDataArray, function(index, item) {
		if (index == 0) {
			$('#listid').append('<thead><tr><th>Code</th><th>Description</th></tr></thead>');
		}
		if (item.category == 'gateTemplateLast') {
			if (!keyDic.contains(item.Code)) {
				keyDic.add(item.Code);
				// PrimaryEvents.
				var dd = '' + item.key + '';
				var desc = (item.Desc) ? item.Desc.substring(0, 70) : '';
				$('#listid').append('<tr onclick="mainVM.SelectEvent(' + dd + ')"><td>' + item.Code + '</td><td>' + desc + '</td></tr>');
			}
		}
	});
	// clear header data
	$('#myModalTableLabel').empty();
	$('#myModalTableLabel').append("Events List");
	$('#modal_list_header_content').hide();
	// show data
	mainVM.FTDiagram.ShowTable();
}
// get new logical gate
MianViewModel.prototype.AddExistEventGate = function(key) {
	var data;
	// find selected item bo
	/*
	 * for (var x = 0; x < myDiagram.model.nodeDataArray.length; x++) {
	 * 
	 * if (myDiagram.model.nodeDataArray[x].key == key) { data =
	 * myDiagram.model.nodeDataArray[x].LinkedEvent; break; } }
	 */
	// console.log(key);
	// for (var x = 0; x < mainVM.PrimaryEvents.length; x++)
	// {
	// //console.log(mainVM.PrimaryEvents[x]);
	// // if (mainVM.PrimaryEvents[x].Code == key)
	// // {
	// // data = mainVM.PrimaryEvents[x].LinkedEvent;
	// // //console.log(data);
	// // break;
	// // }
	// }
	$.each(mainVM.PrimaryEvents, function(index, item) {
		if (item.Code == key) {
			data = item.LinkedEvent;
			// console.log(data);
			// break;
		}
	});
	// post data
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : "FTA/AddExistEvent",
		data : "data=" + JSON.stringify(data)
	}).done(function(returnPayload) {
		if (ReloadAfterTimeOut(returnPayload))
			return;
		// add event to the diagram
		var node = myDiagram.selection.first();
		myDiagram.startTransaction("Add State");
		// get the node data for which the user clicked the button
		// var fromNode = adorn.adornedPart;
		var fromData = node.data;
		// next key
		var nextkey = (myDiagram.model.nodeDataArray.length + 1).toString();
		var toData = returnPayload.Gate;
		toData.key = toData.key;
		// console.log(toData.key);
		// toData.key = nextkey;
		// add the new node data to the model
		var model = myDiagram.model;
		model.addNodeData(toData);
		// create a link data from the old node data to the new node data
		var linkdata = {};
		// console.log('fromData.key : ' + fromData.key);
		// console.log('toData.key : ' + toData.key);
		linkdata.from = fromData.key;
		linkdata.to = toData.key;
		// and add the link data to the model
		model.addLinkData(linkdata);
		myDiagram.commitTransaction("Add State");
		// select the new Node
		var newnode = myDiagram.findNodeForData(toData);
		myDiagram.select(newnode);
		myDiagram.centerRect(newnode.actualBounds);
	});
}
MianViewModel.prototype.AddEvent = function(myDiagram) {
	var jqxhr = $.getJSON("/FTA/InitEvent", "lg");
	// Set another completion function for the request above
	jqxhr.done(function(data) {
		if (ReloadAfterTimeOut(returnPayload))
			return;
		self.InvokeEventGate(mainVM, data);
	});
	jqxhr.fail(function() {
		alert("fail");
	});
}
MianViewModel.prototype.DeleteGate = function() {
	if (!myDiagram.selection.first().data)
		return;
	$.ajax({
		type : 'GET',
		dataType : 'json',
		url : "./json/DeleteGate.json",
		data : "data=" + JSON.stringify(myDiagram.selection.first().data)
	}).done(function(returnPayload) {
		if (ReloadAfterTimeOut(returnPayload))
			return;
		// Delete from UI
		// var myDiagram = this.FTDiagram.Diagram;
		var node = myDiagram.selection.first();
		// remove node from diagram
		if (node) {
			var list = new go.List(go.Link);
			myDiagram.startTransaction("Remove node");
			list = mainVM.RecursiveDeleteNodes(node, list);
			var data = myDiagram.model.nodeDataArray[0];
			// find the corresponding Node
			// var node = myDiagram.findNodeForData(data);
			var node = myDiagram.findPartForKey(data.key);
			// and center it and select it
			myDiagram.centerRect(node.actualBounds);
			myDiagram.select(node);
			myDiagram.layoutDiagram(true);
			myDiagram.commitTransaction("Remove State");
		}
	});
}
MianViewModel.prototype.RecursiveDeleteNodes = function RecursiveDeleteNodes(node, list) {
	var it = node.findTreeChildrenNodes();
	// remove children
	if (it.count != 0) {
		while (it.next()) {
			this.RecursiveDeleteNodes(it.value, list);
		}
	}
	// get parent Link
	var itl = node.findTreeParentLink();
	// remove link
	myDiagram.model.removeLinkData(itl.data);
	// remove gate
	myDiagram.model.removeNodeData(node.data);
	console.log(node.data);
	return list;
}
// Logical Gate class
function LogicalGateViewModel(mainviewmodel, data) {
	var selfREf = this;
	var parent = mainviewmodel;
	selfREf.Title = "Logical gate";
	selfREf.ObsData; // = ko.observable();
	selfREf.Nnodes = ko.observable(0);
	selfREf.KofNVisible = ko.observable(false);
	self.SelectedGateTypeDesc = ko.observable('');
	selfREf.N = ko.computed(function() {
		return selfREf.Nnodes();
	}).extend({
		notify : 'always'
	});
	selfREf.GateTypeDesc = ko.computed(function() {
		return self.SelectedGateTypeDesc();
	}).extend({
		notify : 'always'
	});
}
// get new logical gate
LogicalGateViewModel.prototype.SetGateData = function(data) {
	ko.mapping.fromJS(data, mainVM.LGVM.ObsData);
}
// get new logical gate
LogicalGateViewModel.prototype.InitGate = function() {
	$.ajax({
		type : 'GET',
		dataType : 'text',
		url : "./json/InitGate.json",
		// data: "data=" + JSON.stringify(data),
		data : "data=" + JSON.stringify(myDiagram.selection.first().data),
		success : function(returnPayload) {
			if (ReloadAfterTimeOut(returnPayload))
				return;
			return data;
		},
		error : function(xhr, ajaxOptions, thrownError) {
			console && console.log("request failed");
		},
		processData : false,
		async : false
	});
}
LogicalGateViewModel.prototype.InvokeLGate = function(mainVMV, data) {
	$('#h_title_id').empty();
	$('#h_title_id').append("Logical Gate Data");
	var node = myDiagram.selection.first();
	var it = node.findTreeChildrenNodes();
	// remove children
	if (it.count != 0) {
		mainVM.LGVM.Nnodes(it.count);
	} else {
		mainVM.LGVM.Nnodes(0);
		;
	}
	if (node.data.GateType == '2') {
		// console.log(node.data.GateType);
		mainVM.LGVM.KofNVisible(true);
		// console.log(mainVM.LGVM);
	} else {
		// console.log(mainVM.LGVM.ObsData.GateType());
		// if (mainVM.LGVM.ObsData.)
		mainVM.LGVM.KofNVisible(false);
	}
	// hide event
	$('#EventCard').hide();
	// set visible div
	$('#GateCard').show();
	// open modal
	$('#myModal').modal({
		backdrop : false
	})
}
// get new logical gate
MianViewModel.prototype.SaveGate = function(flag) {
	if (flag == 'lg') {
		var data = ko.toJSON(mainVM.LGVM.ObsData);
		// console.log(' JOSN new : ' +data);
		var Type = 'json';
		console.log(mainVM.LGVM.ObsData.State());
		if (mainVM.LGVM.ObsData.State() == 'New') {
			console.log(data);
			currUrl = "FTA/AddLogalGate";
			Type = 'json';
		} else {
			currUrl = "FTA/EditLogicalGate";
			Type = 'json';
		}
		console.log(currUrl);
		$.ajax({
			type : 'POST',
			dataType : Type,
			url : currUrl,
			data : "data=" + data
		}).done(function(returnPayload) {
			if (ReloadAfterTimeOut(returnPayload))
				return;
			if (mainVM.LGVM.ObsData.State() == 'New') {
				console.log(returnPayload.figure);
				mainVM.LGVM.ObsData.figure(returnPayload.figure);
				mainVM.LGVM.ObsData.GateFigureText(returnPayload.GateFigureText);
				returnPayload.State = "New";
				mainVM.LGVM.AddGateToDiagram(returnPayload);
			} else {
				mainVM.LGVM.UpdateGateInDiagram(returnPayload);
			}
			$('#myModal').modal('hide');
		});
	}
}
LogicalGateViewModel.prototype.AddGateToDiagram = function(data) {
	var node = myDiagram.selection.first();
	if (node && data.State == "New") {
		mainVM.LGVM.ObsData.State("Updated");
		data.State = "Updated";
		myDiagram.startTransaction("Add State");
		var fromData = node.data;
		var nextkey = (myDiagram.model.nodeDataArray.length + 1).toString();
		var toData = data;
		var model = myDiagram.model;
		model.addNodeData(toData);
		var linkdata = {};
		linkdata.from = fromData.key;
		linkdata.to = toData.key;
		if (fromData.key == toData.key) {
			alert(fromData.key + ' ___ ' + toData.key);
		}
		if (fromData == toData) {
			alert(fromData.key + '  ' + toData.key);
		}
		model.addLinkData(linkdata);
		myDiagram.commitTransaction("Add State");
		var newnode = myDiagram.findNodeForData(toData);
		myDiagram.select(newnode);
		myDiagram.centerRect(newnode.actualBounds);
		console.log("add new");
		myDiagram.layoutDiagram(true);
	} else {
		var newnode = myDiagram.findNodeForData(data);
		if (newnode) {
			newnode.data = data;
			alert('wrong in');
		}
	}
}
LogicalGateViewModel.prototype.UpdateGateInDiagram = function(data) {
	var node = myDiagram.selection.first();
	myDiagram.startTransaction("Update State");
	myDiagram.model.setDataProperty(node.data, "Code", data.Code);
	myDiagram.model.setDataProperty(node.data, "Desc", data.Desc);
	myDiagram.model.setDataProperty(node.data, "RepeatedDescr", data.RepeatedDescr);
	myDiagram.model.setDataProperty(node.data, "CalcRezString", data.CalcRezString);
	myDiagram.model.setDataProperty(node.data, "figure", data.figure);
	myDiagram.model.setDataProperty(node.data, "angle", data.angle);
	myDiagram.model.setDataProperty(node.data, "GateFigureText", data.GateFigureText);
	myDiagram.model.setDataProperty(node.data, "GateType", data.GateType);
	myDiagram.model.setDataProperty(node.data, "GateTypeID", data.GateTypeID);
	myDiagram.model.setDataProperty(node.data, "figureColor", data.figureColor);
	myDiagram.model.setDataProperty(node.data, "K", data.K);
	myDiagram.model.setDataProperty(node.data, "N", data.N);
	node.updateTargetBindings();
	myDiagram.commitTransaction("End State");
}
