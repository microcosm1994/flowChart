function ReloadAfterTimeOut(data) {
	if (data == "_EXPIRED_") {
		window.location.href = './Home/Index/';
		return true;
	} else
		return false;
}
function checkTimeout(data) {
	if (data == "_EXPIRED_") {
		var thereIsStillTime = true;
		$.ajax({
			url : "./Home/CheckTimeout/",
			type : 'POST',
			dataType : 'json',
			contentType : 'application/json; charset=utf-8',
			async : false,
			complete : function(result) {
				thereIsStillTime = checkTimeout(result);
			}
		});
	} else {
		return false;
	}
	return thereIsStillTime;
}