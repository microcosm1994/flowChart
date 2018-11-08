//Logical Gate class
function EventViewModel(mainviewmodel, data) {
	var parent = mainviewmodel;
	var EVM_REf = this;
	// EVM_REf.ProbCalcModes = Array();
	// viewModel = ko.mapping.fromJS(data);
	// ko.applyBindings(viewModel);
	this.ObsData = ko.mapping.fromJS(data);
	this.FR_MTTR_TVisible = ko.observable(false);
	this.FR_TVisible = ko.observable(false);
	this.FR_MTTRVisible = ko.observable(false);
	this.FR_tmVisible = ko.observable(false);
	this.pVisible = ko.observable(false);
	this.FRVisible = ko.observable(false);
	EVM_REf.SelectedEventCalcMode = ko.observable('');
	// selfREf.N = ko.computed(function ()
	// {
	// return selfREf.Nnodes();
	// }).extend({ notify: 'always' });
	EVM_REf.CalcModeDesc = ko.computed(function() {
		return EVM_REf.SelectedEventCalcMode();
	}).extend({
		notify : 'always'
	});
}
EventViewModel.prototype.SetEventData = function(data) {
	// console.log(data.LinkedEvent);
	ko.mapping.fromJS(data.LinkedEvent, mainVM.EventVM.ObsData);
}
// get new logical gate
EventViewModel.prototype.SaveGate = function(flag) {
	if (flag == 'lg') {
		var data = ko.toJSON(mainVM.EventVM.ObsData);
		// console.log("befor save TrackingState is " +
		// mainVM.EventVM.ObsData.TrackingState());
		if (mainVM.EventVM.ObsData.TrackingState() == '1') {
			// console.log('new');
			currUrl = "FTA/AddEvent";
		} else {
			currUrl = "FTA/EditEvent";
		}
		// console.log(currUrl);
		// return;
		// http://www.strathweb.com/2012/07/knockout-js-pro-tips-working-with-observable-arrays/
		$.ajax({
			type : 'POST',
			dataType : 'json',
			url : currUrl,
			data : "data=" + data
		}).done(function(returnPayload) {
			if (ReloadAfterTimeOut(returnPayload))
				return;
			// console.log('init :' + returnPayload.Gate);
			if (returnPayload.Gate == null)
			// if (returnPayload.Gate == 'undefined')
			{
				// console.log('undefined ' +returnPayload.Message);
				$('#EventAlertID').empty();
				$('#EventAlertID').append(returnPayload.Message);
				$('#EventAlertID').show();
				return;
			}
			$('#EventAlertID').hide();
			if (mainVM.EventVM.ObsData.TrackingState() == '1') {
				// console.log("TrackingState is :" +
				// returnPayload.Gate.LinkedEvent.TrackingState);
				// mainVM.EventVM.AddEventToDiagram(JSON.parse(returnPayload.Gate));
				mainVM.EventVM.AddEventToDiagram(returnPayload.Gate);
			} else {
				// update current event
				// mainVM.EventVM.UpdateEventInDiagram(JSON.parse(ko.toJSON(mainVM.EventVM.ObsData)));
				// ko.mapping.fromJS(returnPayload, mainVM.EventVM.ObsData);
				// console.log(returnPayload.Gate);
				// console.log(returnPayload.Gate.LinkedEvent);
				// ko.mapping.fromJS(returnPayload.Gate.LinkedEvent,
				// mainVM.EventVM.ObsData);
				// ko.mapping.fromJS(returnPayload, mainVM.LGVM.ObsData);
				var node = myDiagram.selection.first();
				mainVM.EventVM.UpdateEventInDiagram(returnPayload.Gate, node);
			}
			$('#myModal').modal('hide');
		});
	}
}
EventViewModel.prototype.UpdateEventInDiagram = function(data, node) {
	// var node = myDiagram.selection.first();
	// add node to diagram
	// var nnode = myDiagram.findNodeForData(data);
	// console.log(data);
	for (var x = 0; x < myDiagram.model.nodeDataArray.length; x++) {
		if (myDiagram.model.nodeDataArray[x].LinkedEvent && myDiagram.model.nodeDataArray[x].LinkedEvent.EventGuid == data.LinkedEvent.EventGuid) {
			// console.log("LinkedEvent" +
			// myDiagram.model.nodeDataArray[x].LinkedEvent.EventGuid);
			var nodeq = myDiagram.model.nodeDataArray[x];
			node = myDiagram.findNodeForKey(nodeq.key);
			myDiagram.startTransaction("Update DD State");
			// node.data = data;
			// node.data = data;
			// console.log(node.data.key);
			myDiagram.model.setDataProperty(node.data, "Code", data.Code);
			myDiagram.model.setDataProperty(node.data, "Desc", data.Desc);
			myDiagram.model.setDataProperty(node.data, "RepeatedDescr", data.RepeatedDescr);
			myDiagram.model.setDataProperty(node.data, "CalcRezString", data.CalcRezString);
			myDiagram.model.setDataProperty(node.data, "figure", data.figure);
			myDiagram.model.setDataProperty(node.data, "angle", data.angle);
			myDiagram.model.setDataProperty(node.data, "GateFigureText", data.GateFigureText);
			myDiagram.model.setDataProperty(node.data, "LastGateInfoBox", data.LastGateInfoBox);
			myDiagram.model.setDataProperty(node.data, "GateType", data.GateType);
			myDiagram.model.setDataProperty(node.data, "GateTypeID", data.GateTypeID);
			myDiagram.model.setDataProperty(node.data, "figureColor", data.figureColor);
			myDiagram.model.setDataProperty(node.data, "K", data.K);
			myDiagram.model.setDataProperty(node.data, "N", data.N);
			myDiagram.model.setDataProperty(node.data, "LinkedEvent", data.LinkedEvent);
			node.updateTargetBindings();
			myDiagram.commitTransaction("End DD State");
			// console.log(node);
		}
	}
	myDiagram.layoutDiagram(true);
}
EventViewModel.prototype.AddEventToDiagram = function(data) {
	var node = myDiagram.selection.first();
	// console.log(data);
	// add node to diagram
	if (node && data.State == "New") {
		data.State = "Updated";
		myDiagram.startTransaction("Add State");
		// get the node data for which the user clicked the button
		// var fromNode = adorn.adornedPart;
		var fromData = node.data;
		// next key
		var nextkey = (myDiagram.model.nodeDataArray.length + 1).toString();
		var toData = data;
		toData.key = nextkey;
		// add the new node data to the model
		var model = myDiagram.model;
		model.addNodeData(toData);
		// create a link data from the old node data to the new node data
		var linkdata = {};
		// console.log(fromData.key);
		linkdata.from = fromData.key;
		linkdata.to = toData.key;
		// alert(fromData.key + ' ' + toData.key);
		// and add the link data to the model
		model.addLinkData(linkdata);
		myDiagram.commitTransaction("Add State");
		// select the new Node
		var newnode = myDiagram.findNodeForData(toData);
		myDiagram.select(newnode);
		myDiagram.centerRect(newnode.actualBounds);
	}
}
EventViewModel.prototype.SetEventCalcParamsVisisble = function(newValue) {
	mainVM.EventVM.FR_MTTR_TVisible(false);
	mainVM.EventVM.FR_TVisible(false);
	mainVM.EventVM.FR_MTTRVisible(false);
	mainVM.EventVM.FR_tmVisible(false);
	mainVM.EventVM.pVisible(false);
	mainVM.EventVM.FRVisible(false);
	switch (newValue) {
	case 3:
	case 4:
	case 5:
		mainVM.EventVM.FR_TVisible(true);
		mainVM.EventVM.ObsData.EventType(6);
		break;
	case 1:
	case 7:
		mainVM.EventVM.FRVisible(true);
		mainVM.EventVM.ObsData.EventType(4);
		break;
	case 2:
		mainVM.EventVM.FR_tmVisible(true);
		mainVM.EventVM.ObsData.EventType(4);
		break;
	case 0:
		mainVM.EventVM.pVisible(true);
		mainVM.EventVM.ObsData.EventType(4);
		mainVM.EventVM.ObsData.EventType(4);
		break;
	case 9:
		mainVM.EventVM.FR_MTTRVisible(true);
		mainVM.EventVM.ObsData.EventType(4);
		break;
	case 10:
		mainVM.EventVM.FR_MTTR_TVisible(true);
		mainVM.EventVM.ObsData.EventType(6);
		break;
	}
}
