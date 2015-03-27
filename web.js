var branch = "master",
	diffbranch = "Build_git_interface";

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
   git_interface.GetBranches(function(result){
   	res.json(result);
   });
});

app.get('/GetStories', function(req, res) {
	git_interface.GetStories(branch, diffbranch, function(result) { 
		res.json(result);
	});
});
var port = process.env.PORT || 5000 ;
app.listen(port, function() {
   console.log("Listening on " + port);
});
