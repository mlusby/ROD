//var repoLocation = "C:/git/ROD";
var repoLocation = "/Users/e002796/Documents/Git/ROD";
var storyTag = new RegExp(/^[bBdD]-[0-9]{5}/);

//git-whatchanged format info:  https://www.kernel.org/pub/software/scm/git/docs/git-whatchanged.html
//%N = commit notes
//%cN = commiter name
//%ci = commiter date
var gitFormat = "%s, %cN, %ci%n"
var branch = "master",
diffbranch = "release";

function GitShell(cmd, repo, callback) {
    var exec = require('child_process').exec,
        command = exec(cmd,{cwd: repo}),
        result = '';
    command.stdout.on('data', function(data) {
        result += data.toString();
    });
    command.on('close', function(code) {      
        return callback(result);
    });
}

function GetBranches(repo, callback) {
    GitShell("git branch --all", repo, function (result) {
        //var re = new RegExp(/^\s*/, 'gmi');
        var re = new RegExp('remotes/origin/', 'gmi');
        result.replace(re, '');
        var array = result.split("\n  ");
        return callback(JSON.stringify(array));
    });    
}

//GetBranches(repoLocation, function (array) { console.log(array); });

function ProcessStories(result, callback){
    var filtered = result.replace(/^.+?\.{2}.+?\n|^:.*$\n|^:.*$|^\s*/gmi,"");
    var storyArray = filtered.split("\n");
    for (var i = 0; i < storyArray.lengh; i++)
        {
            var re = new RegExp(/^[bBdD]-[0-9]{5}/);
            if (re.test(storyArray[i]))
            {
                console.log(storyArray[i].match(re));
            }
            //console.log(storyArray[i]);
        }  
  //  var filtered2 = filtered.replace(/master..release\n/gmi,"");
    return callback(filtered);    
}

function GetStories(repo, branch, diffbranch, callback) {
    GitShell("git whatchanged --oneline --format=format:\"" + gitFormat +"\"" + branch + ".." + diffbranch, repo, function (result) {        
        ProcessStories(result, function(result){
            return callback(result);
        });
        //console.log(result);
        //var re = new RegExp(/^\s*/, 'gmi');        
        //var re = new RegExp('remotes/origin/', 'gmi');
        //result.replace(re, '');
        //var array = result.split("\n  ");
        //return callback(JSON.stringify(clean));
    });    
}

GetStories(repoLocation, branch, diffbranch, function(result) { console.log(result); });


