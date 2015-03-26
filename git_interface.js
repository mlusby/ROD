﻿var repo_location = "C:/git/ROD";

//git-whatchanged format info:  https://www.kernel.org/pub/software/scm/git/docs/git-whatchanged.html
//%N = commit notes
//%cN = commiter name
//%ci = commiter date
var format = "%s, %cN, %ci"
var branch = "master",
diffbranch = "Build_git_interface";

function GitShell(cmd, repo, callback) {
    console.log(cmd);
    var exec = require('child_process').exec,
        command = exec(cmd,{cwd: repo_location}),
        result = '';
    command.stdout.on('data', function(data) {
        result += data.toString();
    });
    command.on('close', function(code) {
        console.log("initial result: " + result);
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

//GetBranches(repo_location, function (array) { console.log(array); });

function GetStories(repo, branch, diffbranch, callback) {
    GitShell("git whatchanged --format=format:\"" + format +"\"" + branch + ".." + diffbranch, repo, function (result) {
        //console.log(result);
        //var re = new RegExp(/^\s*/, 'gmi');        
        //var re = new RegExp('remotes/origin/', 'gmi');
        //result.replace(re, '');
        //var array = result.split("\n  ");
        return callback(JSON.stringify(result));
    });    
}

GetStories(repo_location, branch, diffbranch, function(result) { console.log(result); });

