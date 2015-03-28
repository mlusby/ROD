var initRet;
var testStory
$(function(){
	//pulls branches to select from first thing
	pullBranches();

	$('button.story-pull').bind('click',function(){
		pullStory($('#branch-a').val(), $('#branch-b').val());
	})
});

	function pullBranches(){
		$.ajax({
		url:'http://localhost:5000/GetBranches',
		dataType: 'json',
		success: function(data){
			popBranches(data);
		},
		error: oops/*function(data){
			initRet = data;
			alert('oops :0/');
		}*/
		});
	}
	function popBranches(data){ //takes array of strings for branches
		console.log('popBranches: ');
		var branches = data;
		initRet = branches;
		for(var i=0;i<branches.length;i++){
			$('<option>'+branches[i]+'</option>')
				.appendTo('#branch-a')
				.clone()
				.appendTo('#branch-b');
		}
	}

	function pullStory(data, data2){
		$.ajax({
		url:'http://localhost:5000/GetStories',
		data: {brancha:data,branchb:data2},
		dataType: 'json',
		success: function(data){
			popStory(data);
		},
		error: oops/*function(data){
			initRet = data;
			alert('oops :0/');
		}*/
		});
	}
	function popStory(data){
		console.log('popStory');
		var stories = data.Stories;
		testStory = stories;
		var retMarkup = data;
		for(var i=0;i<stories.length;i++){
			retMarkup = '<div class="panel panel-primary"><div class="panel-heading">'+stories[i].StoryName+', Commits: '+stories[i].Commits+'<i class="glyphicon glyphicon-print pull-right"></i><i data-toggle="modal" data-target="#story-modal" class="glyphicon glyphicon-new-window pull-right"></i></div>';
			retMarkup += '<div class="panel-body"><ul>';
			for(var k=0;k<stories[i].Users.length;k++){
				retMarkup += '<li>'+stories[i].Users[k]+'</li>';
			}
			var dateArray = stories[i].LastModified.split(/-|\s|:/);
			//"2015-03-27 14:42:38 -0500"
			var date = new Date(dateArray[0],dateArray[1]-1,dateArray[2],dateArray[3],dateArray[4]);
			retMarkup += '</ul><div class="panel-footer">Last Modifed: '+date.toDateString() + ' ' + date.toLocaleTimeString()+'</div></div>';
			$(retMarkup).appendTo('div.story-container');
		}
		$('div.story-container').toggle('blind');
		setTimeout(function(){window.scroll(0,$('#story').offset().top)},300);
	}

	function oops(){
		alert('doh!');
	}