module.exports = function(){

    var repo_location = "/Users/mark.lusby/source/ROD/",
        format = "%s, %cN, %ci%n";
    //git-whatchanged format info:  https://www.kernel.org/pub/software/scm/git/docs/git-whatchanged.html
    //%N = commit notes
    //%cN = commiter name
    //%ci = commiter date

    function GitShell(cmd, callback) {
        console.log(cmd);
        var exec = require('child_process').exec,
            command = exec(cmd,{cwd: repo_location}),
            result = '';
        command.stdout.on('data', function(data) {
            result += data.toString();
        });
        command.on('close', function(code) {
            //console.log("initial result: " + result);
            return callback(result);
        });
    }

    GetBranches = function (callback) {
        GitShell("git branch --all", function (result) {
            //var re = new RegExp(/^\s*/, 'gmi');
            var re = new RegExp('remotes/origin/', 'gmi');
            result.replace(re, '');
            var array = result.split("\n  ");
            return callback(JSON.stringify(array));
        });    
    }

    //GetBranches(repo_location, function (array) { console.log(array); });

    function ProcessStories(result, callback){
    //var re = new RegExp(/^:.*$|^\s|^\n/,"gmi");
        var filtered = result.replace(/^:.*$|^\s|^\n/gmi,"");
        return callback(filtered);    
    }

    GetStories = function(branch, diffbranch, callback) {
        GitShell("git whatchanged --oneline --format=format:\"" + format +"\" " + branch + ".." + diffbranch, function (result) {        
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
    return ({
        "GetStories" : GetStories,
        "GetBranches" : GetBranches
    });
}()



