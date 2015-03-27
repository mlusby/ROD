
var branch = "master",
	diffbranch = "NewChanges";

var express = require("express");
var http = require("http");
var git_interface = require("./git_interface");
var app = express();
app.use(express.logger());
app.use(express.static('public'));

var hbs = require('hbs');	//Hooray Handlebars!

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());

app.get('/', function(req, res) {
   res.render('index', {});
});

app.get('/GetBranches', function(req, res) {
   res.json(["develop","master"]);
});

app.get('/GetStories', function(req, res) {
	git_interface.GetStories(branch, diffbranch, function(result) { 
		res.json(
	   		/*[
	   		{	
	   			"StoryName" : "Widget",
	   			"Commits" : 40,
	   			"Users" : ["Mark", "Shannon", "Yusuf"],
	   			"LastModified" : "2015-03-15 12:00 p.m."
	   		},
	   		{	
	   			"StoryName" : "N/A",
	   			"Commits" : 3, 
	   			"Users" : ["Mark"],
	   			"LastModified" : "2015-03-15 06:15 aj:Widget.m."
	   		}
	   		]*/
	   		{"Result":result}
	   	);
	});
});
var port = process.env.PORT || 5000 ;
app.listen(port, function() {
	console.log("Listening on " + port);
});
