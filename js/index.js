var viewModel;
var mainVM;
(function() {
	mainVM = new MianViewModel();
	// ko.applyBindings(mainVM, $('#btns')[0]);
	ko.applyBindings(mainVM, $('#Navbarid')[0]);
}).push();
$(document).ready(function() {
	$('#AlertID').hide();
	$('#DownLoadID').hide();
	$('#CustomData').hide();
	// $('#infoID').hide();
	$('.alert .close').bind("click", function(e) {
		$(this).parent().hide();
	});
});
$(function() {
	var window_height = $(window).height(), content_height = window_height - window_height / 3;
	$('.mygrid-wrapper-div').height(content_height);
	$('.maincontetnt').height(window_height + window_height * 0.3);
});
$(window).resize(function() {
	var window_height = $(window).height(), content_height = window_height - window_height / 3;
	$('.mygrid-wrapper-div').height(content_height);
	$('.maincontetnt').height(content_height + content_height * 0.3);
});