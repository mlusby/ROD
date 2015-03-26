var initRet;

$(function(){
	//pulls branches to select from first thing
	$.ajax({
		url:'http://localhost:5000/GetBranches',
		dataType: 'json',
		success: function(data){
			initRet = data;
		},
		error: function(data){
			initRet = data;
			alert('oops :0/');
		}
	});
});