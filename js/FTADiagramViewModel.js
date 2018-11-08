function FTADiagramViewModel(parent) {
	var FTADiagramVM = this;
	this.parent = parent;
	this.Diagram;
	// this.MCSitems = ko.observableArray([]);
	this.ISToogleGrid = true;
}
FTADiagramViewModel.prototype.GetDynamicData = function() {
	//
	$.ajax({
		type : "GET",
		url : "GetDynamicData.htm",
		dataType : 'text',
		data : {
			url : document.referrer
		}
	// data: "data=" + document.referrer
	}).success(function(returndata) {
		if (returndata != null || returndata != 'undefined') {
			$('#info').html(returndata);
		} else
			$('#info').clear();
	});
}
FTADiagramViewModel.prototype.GridDiagram = function() {
	if (mainVM.FTDiagram.ISToogleGrid == true) {
		mainVM.FTDiagram.ISToogleGrid = false;
	} else
		mainVM.FTDiagram.ISToogleGrid = true;
	myDiagram.grid.visible = mainVM.FTDiagram.ISToogleGrid;
}
FTADiagramViewModel.prototype.SelectedItem = function(item) {
	// post selected item
	// myDiagram.selection.first().data
	if (myDiagram && myDiagram.selection && myDiagram.selection.first())
		($.ajax({
			type : 'GET',
			dataType : 'json',
			url : "./json/SelectedItem.json",
			data : "data=" + JSON.stringify(myDiagram.selection.first().data)
		}).done(function(item) {
			if (ReloadAfterTimeOut(item))
				return;
			// alert(item);
		}))
}
// add a new item to the portfolio
FTADiagramViewModel.prototype.addItem = function(item) {
	this.items.push(item);
}
// common function to show table popup
FTADiagramViewModel.prototype.ShowTable = function(item) {
	// set table width
	// var w = $(window).width();
	// $('#listid').width(w - w / 5);
	// open modal
	$('#myModalTable').modal({
		backdrop : true
	})
	$('#myModalTable').on('hidden.bs.modal', function(e) {
		$('#listid').empty();
	});
}
// open MCS popup
FTADiagramViewModel.prototype.ShowMCS = function(item) {
	// set table width
	var w = $(window).width();
	var modalTableWidth = $('#myModalTable').width();
	// console.log(modalTableWidth);
	$('#listid').width(w - w / 4);
	// modal - dialog - table
	$('.modal-dialog-table').css('width', '80%').css('left', '30%');
	// mainVM.Title('Minimal cut set');
	$('#myModalTableLabel').empty();
	$('#myModalTableLabel').append("Minimal cut set's");
	// open modal
	$('#myModalTable').modal({
		backdrop : true
	})
	$('#myModalTable').on('hidden.bs.modal', function(e) {
		$('#listid').empty();
		$('#modal_list_header_content').empty().hide();
		$('.modal-dialog-table').css('width', '60%').css('left', '40%');
		;
	});
}
// repeated events calculatoin
FTADiagramViewModel.prototype.RepeatedEvents = function(Guid, myDiagram) {
	mainVM.ShowProgress();
	var jqxhr = $.getJSON("./json/RepeatedEvents.json", "aa");
	jqxhr.done(function(FaultTreeModel) {
		if (ReloadAfterTimeOut(FaultTreeModel))
			return;
		mainVM.FTDiagram.ReloadDiagram(FaultTreeModel);
		mainVM.HideProgress();
	});
	jqxhr.always(function() {
		mainVM.HideProgress();
	});
	jqxhr.fail(function() {
		alert("fail");
	});
}
// Fault Tree Calculation
FTADiagramViewModel.prototype.FTCalculation = function(Guid, myDiagram) {
	var data = ko.toJSON(mainVM.FTPropertiesVM);
	mainVM.ShowProgress();
	// var jqxhr =
	// $.getJSON
	// ("./FTA/CalculateFT");
	var jqxhr = $.ajax({
		type : 'POST',
		dataType : 'json',
		url : "./FTA/CalculateFT",
		data : "data=" + data
	});
	jqxhr.done(function(cnt) {
		if (ReloadAfterTimeOut(cnt))
			return;
		if (cnt.MinCSList != null) {
			$('#modal_list_header_content').empty().show();
			$('#modal_list_header_content').empty();
			$('#modal_list_header_content').append(
					"<h5>" + "Calculation : " + cnt.CalcParamsSummary + "<br>Result for Top Level : " + cnt.CalcRezString + ". Number of MCS " + cnt.MCSCountInMemory + "/" + cnt.MCSCountTotal + ".Order of MCS: Min " + cnt.MinOrder + "/ Max "
							+ cnt.MaxOrder + "  </h5>");
			// $('#modal_list_header_content').append("<br><h4>" + "Calculation
			// :" + cnt.CalcParamsSummary + "<br>Result for Top Level :" +
			// cnt.CalcRezString + "</h4>");
			// $('#modal_list_header_content').append("<br><h4>" + "Calculation
			// :" + cnt.CalcParamsSummary + "<br>Result for Top Level :" +
			// cnt.CalcRezString + "</h4>");
			mainVM.FTDiagram.CreateMCSTable(cnt.MinCSList);
			mainVM.FTDiagram.ShowMCS();
			mainVM.FTDiagram.ReloadDiagram(cnt.FaultTreeModel);
		} else {
			mainVM.FTDiagram.CalcError(cnt.CalcLog);
			// mainVM.FTDiagram.CreateLogTable(cnt.CalcLog);
			// mainVM.FTDiagram.ShowMCS();
		}
	});
	jqxhr.fail(function() {
		alert("fail");
	});
	jqxhr.always(function() {
		mainVM.HideProgress();
		// alert("always");
	});
}
FTADiagramViewModel.prototype.CalcError = function(CalcLog) {
	var msg = '';
	if (CalcLog != null) {
		$.each(CalcLog.LogRecordsList, function(index, item) {
			if (item.RecordStatus == 2) {
				if (index != 0 && msg != '')
					msg += ".<br> " + item.MessageText;
				else
					msg += item.MessageText;
			}
		});
	}
	if (!$('#AlertID').hasClass('centerDiv')) {
		$('#AlertID').addClass('centerDiv');
	}
	var window_width = $(window).width();
	$('#AlertID').width(window_width / 2);
	$('#alert_content_id').empty().append("<h4>You got an error!</h4><p id='alertcontentid'>" + msg + "</p>");
	$('#AlertID').css('left', '20%');
	$('#AlertID').show();
}
FTADiagramViewModel.prototype.CreateLogTable = function(CalcLog) {
	$.each(CalcLog.LogRecordsList, function(index, item) {
		if (index == 0) {
			// $('#listid').append('<tr><td>' + item.CalcRezString + '</td><td>'
			// + item.Probability + '</td><td>' + item.MissionProbability +
			// '</td><td>');
			// $('#listid').append('<thead><tr><th>MessageText</th></tr></thead>');
			$('#listid').append('<thead><tr><th>MessageText</th><th>Type</th></tr></thead>');
			$('#listid').append('<tr><td>' + item.MessageText + '</td><td>' + item.RecordStatus + '</td></tr>');
		} else {
			$('#listid').append('<tr><td>' + item.MessageText + '</td><td>' + item.RecordStatus + '</td></tr>');
			// $('#listid').append('<tr><td>' + item.MessageText + '</td><td>');
		}
	});
}
FTADiagramViewModel.prototype.CreateMCSTable = function(MinCSList) {
	$.each(MinCSList, function(index, item) {
		if (index == 0) {
			// SET HEADER MinCSList
			// $('#listid').append('<tr><td>' + item.CalcRezString + '</td><td>'
			// + item.Probability + '</td><td>' + item.MissionProbability +
			// '</td><td>');Event Description
			$('#listid').append('<thead><tr><th>#</th><th>CutSet prob.</th><th>Event prob.</th> <th>Calc.parameters</th> <th>Event Type</th><th>Event code</th><th>Event Description</th></tr></thead>');
		}
		var eventsRowSpan = item.LinkedEventsList.length;
		var span = 1;
		// if (eventsRowSpan > 0)
		// {
		// span = eventsRowSpan + 1;
		// }
		// Cutset Data
		// $('#listid').append('<tr><td>' + item.NumberByOrderForUI +
		// '</td><td>' + item.CalcRezString + '</td><td>' + item.Probability +
		// '</td><td>' + item.MissionProbability + '</td><td>');
		$('#listid').append('<tr><td rowspan="' + span + '">' + item.NumberByOrderForUI + '</td><td rowspan="' + span + '">' + item.CalcRezString + '</td><td></td><td></td><td></td><td></td><td></td></tr>');
		if (eventsRowSpan > 0) {
			var sp;
			for (var y = 0; y < eventsRowSpan; y++) {
				var data = item.LinkedEventsList[y];
				// without span
				$('#listid').append(
						'<tr><td></td><td></td><td>' + data.EventCalcRez.CalcRezString + '</td>  <td>' + data.LinkedEvent.CalculationParameters + '</td><td>' + data.LinkedEvent.EventType_Name + '</td><td>' + data.LinkedEvent.Code + '</td><td>'
								+ data.LinkedEvent.Descr + '</td></tr>');
				// $('#listid').append('<tr><td>' +
				// data.EventCalcRez.CalcRezString + '</td><td>' +
				// data.FailureRateString + '</td><td>' +
				// data.ExposureTimeString + '</td><td>' +
				// data.LinkedEvent.EventType_Name + '</td><td>' +
				// data.LinkedEvent.EventCalcType_Formula + '</td><td>' +
				// data.LinkedEvent.Code + '</td><td>' + data.LinkedEvent.Descr
				// + '</td><td>' + data.LinkedEvent.Code + '</td></tr>');
				// $('#listid').append('<td>' + item.CalcRezString + '</td>');
				// $('#listid').append('<td>' + item.CalcRezString + '</td>');
				// $('#listid').append('<td>' + item.CalcRezString + '</td>');
				// $('#listid').append('<td>' + item.CalcRezString + '</td>');
				// $('#listid').append('<td>' + item.CalcRezString + '</td>');
				// $('#listid').append('<td>' + item.CalcRezString + '</td>');
				// $('#listid').append('<td>' + item.CalcRezString + '</td>');
				// $('#listid').append('<td>' + item.CalcRezString + '</td>');
				// $('#listid').append('</tr>');
			}
		}
	});
}
function GetMCSListReport(data, event) {
	window.location = './Report/MCSReport?file=test';
}
FTADiagramViewModel.prototype.UpLoadFTFile = function(data, event) {
	mainVM.ISLogIn("0", mainVM.FTDiagram.LoadFTFile, data, event);
}
FTADiagramViewModel.prototype.LoadFTFile = function(data, event) {
	// var ext = $('#fileupload').value.match(/\.([^\.]+)$/)[1];
	// console.log(ext);
	$('#fileupload').fileupload({
		dataType : 'json',
		autoUpload : true,
		url : './FTA/Upload',
		acceptFileTypes : /(\.|\/)(zip)$/i,
		maxFileSize : 5000000, // 5 MB
		done : function(e, data) {
			// console.log(data.result);
			if (!$('#CustomData').hasClass('centerDiv')) {
				$('#CustomData').addClass('centerDiv');
			}
			$('#CustomData').removeClass('alert-info').removeClass('alert-success').removeClass('alert-danger').removeClass('alert-warning');
			$("#CustomData").find("strong").remove();
			$('#CustomData').append(data.result.Msg).show();
			switch (data.result.MsgType) {
			case 1:
				$('#CustomData').addClass('alert-success');
				mainVM.FTDiagram.ReloadDiagram(data.result);
				break;
			case 2:
				$('#CustomData').addClass('alert-warning');
				break;
			case 3:
				$('#CustomData').addClass('alert-danger');
				break;
			}
		}
	});
	$('#fileupload').click();
}
FTADiagramViewModel.prototype.ExportFTFile = function(data, event) {
	mainVM.ISLogIn("0", mainVM.FTDiagram.ExportFile);
}
FTADiagramViewModel.prototype.ExportFile = function(data, event) {
	// var url = '';
	// window.location = './FTA/ExportFTFile';
	// return;
	// $.ajax({
	// type : 'POST',
	// dataType : 'text',
	// url : "./FTA/ExportFTFile",
	// data : "data=" + JSON.stringify(myDiagram.selection.first().data)
	// }).done(function(url) {
	// if (ReloadAfterTimeOut(url))
	// return;
	// window.location = './FTA/Download?file=' + url;
	// }).fail(function() {
	// alert("fail");
	// });
}
FTADiagramViewModel.prototype.GetDiagramImage = function(callback, event) {
	mainVM.ISLogIn("0", callback);
}
FTADiagramViewModel.prototype.DownLoadDiagramImage = function(data, event) {
	myDiagram.zoomToFit();
	var d = myDiagram.documentBounds;
	img = myDiagram.makeImage({
		// position: new go.Point(d.x, d.y),
		// size: new go.Size(d.width, d.height),
		scale : myDiagram.scale,
		// scale: 1,
		background : "White",
		type : "image/jpeg",
		details : 1
	// type:"image/png"
	});
	// var ua = window.navigator.userAgent
	// var msie = ua.indexOf("MSIE ")
	// var data = $.browser.msie;
	// alert(data);
	if (ie_ver() == 0)
	// if ($.browser.chrome || $.browser.mozilla)
	{
		var url = img.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
		/*
		 * Create an anchor to some inline data...
		 */
		var anchor = document.createElement('a');
		anchor.setAttribute('href', url);
		anchor.setAttribute('download', 'FaultTreeDiagram.png');
		/*
		 * Click the anchor
		 */
		// Chrome can do anchor.click(), but let's do something that Firefox can
		// handle too
		// Create event
		var ev = document.createEvent("MouseEvents");
		ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		anchor.dispatchEvent(ev);
	} else {
		$('#DownLoadID').width(d.width);
		$('#DownLoadID').show();
		obj = document.getElementById("alert_content_dwnload");
		obj.appendChild(img);
	}
	// obj = document.getElementById("severalImages");
	// obj = document.getElementById("alert_content_dwnload");
	// obj.appendChild(img)
	// alert(anchor);
	// var theNode = document.getElementById('myLink');
	// theNode.setAttribute('href', url);
	// theNode.setAttribute('download', 'myDiagram.jpeg');
	// theNode.onclick = function () { alert("You clicked a link with href:" +
	// this.href); };
	// fireClick(theNode);
	// newWindow = window.open(url, 'neuesDokument');
}
// /http://www.nonobtrusive.com/2011/11/29/programatically-fire-crossbrowser-click-event-with-javascript/
function fireClick(node) {
	if (document.createEvent) {
		var evt = document.createEvent('MouseEvents');
		evt.initEvent('click', true, false);
		node.dispatchEvent(evt);
	} else if (document.createEventObject) {
		node.fireEvent('onclick');
	} else if (typeof node.onclick == 'function') {
		node.onclick();
	}
}
function ie_ver() {
	var iev = 0;
	var ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
	var trident = !!navigator.userAgent.match(/Trident\/7.0/);
	var rv = navigator.userAgent.indexOf("rv:11.0");
	if (ieold)
		iev = new Number(RegExp.$1);
	if (navigator.appVersion.indexOf("MSIE 10") != -1)
		iev = 10;
	if (trident && rv != -1)
		iev = 11;
	return iev;
}
FTADiagramViewModel.prototype.RelayoutDiagram = function() {
	// data.gatelist, data.gatelinklist
	var datalist = myDiagram.model.nodeDataArray;
	var links = myDiagram.model.linkDataArray;
	myDiagram.clear();
	myDiagram.model.nodeDataArray = datalist;
	myDiagram.model.linkDataArray = links;
	myDiagram.layoutDiagram(true);
	// myDiagram.model = new go.GraphLinksModel(gatelist, links);
}
FTADiagramViewModel.prototype.ReloadDiagram = function(data) {
	myDiagram.clear();
	myDiagram.model = new go.GraphLinksModel(data.gatelist, data.gatelinklist);
}
FTADiagramViewModel.prototype.UpdateDiagram = function(data) {
	myDiagram.startTransaction("Update calc");
	for (var x = 0; x < myDiagram.model.nodeDataArray.length; x++) {
		myDiagram.model.nodeDataArray[x].data = data.gatelist[x];
		// console.log(myDiagram.model.nodeDataArray[x].data);
	}
	myDiagram.commitTransaction("Update calc");
	myDiagram.layoutDiagram(true);
}
FTADiagramViewModel.prototype.SetCenterANDSelectFirst = function () {
	var data = myDiagram.model.nodeDataArray[0];
	// find the corresponding Node
	// var node = myDiagram.findNodeForData(data);
	var node = myDiagram.findPartForKey(data.key);
	// and center it and select it
	myDiagram.centerRect(node.actualBounds);
	myDiagram.select(node);
	myDiagram.initialContentAlignment = go.Spot.Center;
	myDiagram.contentAlignment = go.Spot.Center;
}
// get new logical gate
FTADiagramViewModel.prototype.LoadFTByGuid = function (Guid, myDiagram) {
	$.getJSON("./json/GetFTJsonData.json", null, function(data) {
		myDiagram.startTransaction("change Layout");
		myDiagram.layout.treeStyle = go.TreeLayout.StyleAlternating;
		myDiagram.layout.alignment = go.TreeLayout.AlignmentCenterChildren;
		myDiagram.layout.angle = 90; // display from left to right
		myDiagram.layout.alternateAlignment = go.TreeLayout.AlignmentCenterChildren;
		myDiagram.layout.alternateAngle = 90;
		myDiagram.allowDrop = true;
		myDiagram.model.nodeDataArray = data.gatelist;
		myDiagram.model.linkDataArray = data.gatelinklist;
		myDiagram.layoutDiagram(true);
		myDiagram.commitTransaction("change Layout");
		mainVM.HideProgress();
	});
}