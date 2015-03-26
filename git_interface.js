var repo_location = "C:/git/Clickmotive";

function GitShell(cmd, repo, callback) {
    var exec = require('child_process').exec,
        command = exec(cmd,{cwd: repo_location}),
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

GetBranches(repo_location, function (array) { console.log(array); });

