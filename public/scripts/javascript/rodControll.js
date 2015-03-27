var initRet;
var testStory
$(function(){
	//pulls branches to select from first thing
	pullBranches();

	// for testing
	pullStory('test', 'test');
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
		var stories = data;
		testStory = stories;
		var retMarkup = data;
		for(var i=0;i<stories.length;i++){
			retMarkup = '<div class="panel panel-primary"><div class="panel-heading">'+stories[i].StoryName+', Commits: '+stories[i].Commits+'</div>';
			retMarkup += '<div class="panel-body"><ul>';
			for(var k=0;k<stories[i].Users.length;k++){
				retMarkup += '<li>'+stories[i].Users[k]+'</li>';
			}
			$(retMarkup).appendTo('div.story-container');
		}
	}

	function oops(){

	}