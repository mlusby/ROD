var nconf = require('nconf'),
    path = require('path'),
    spawn = require('child_process').spawn;

nconf
.argv()
.env()
.file({file: path.join(__dirname, 'config.json')});

module.exports = function(){
    var repo_location = nconf.get("git:repoLocation");
    var storyTag = new RegExp(/^[bBdD]-[0-9]{5}/);
    var gitFormat = "%s, %cN, %ci, %h";
    //git-whatchanged format info:  https://www.kernel.org/pub/software/scm/git/docs/git-whatchanged.html
    //%N = commit notes
    //%cN = commiter name
    //%ci = commiter date
    var util = require("./utils/utils");

    function GitShell(cmd, args, callback) {
        //console.log(cmd + " " + args);
        var command = spawn(cmd, args, {cwd: repo_location}),
            result = '';
            command.stdout.on('data', function(data) {
                result += data.toString();
            });            
        command.stderr.on('data', function(data) {
            result += data.toString();        
        });
        if (command.error != null)
        {
            console.log('spawn error: ' + command.error);
        }
        command.on('close', function(code) {
            return callback(result);
        });
    }

    GetBranches = function (callback) {
        args = ["branch", "--all"];
        GitShell("git", args, function (result) {            
            var filtered = result.replace(/^\x2A\s*|^\s*/gmi, '');
            //console.log(filtered);
            var array = filtered.split("\n");
            util.ArrayCleanUp(array, function (result) {
                return callback(result);
            });            
        });    
    }

//GetBranches(repoLocation, function (array) { console.log(array); });

    function ProcessStories(result, callback){
        var filtered = result.replace(/^.+?\.{2}.+?\n|^:.*$\n|^:.*$|^\s*/gmi,"");
        var commitArray = [];
        util.RemoveQuotes(filtered.split("\n"), function(results) {
            commitArray = results;
        });
        var unmatchedCount = 0;
        var storyList = [];     
        for (i = 0; i < commitArray.length; i++)
        {            
            var re = new RegExp(/^[bBdD]-[0-9]{5}/m);
            if (commitArray[i] != null & commitArray[i] != '')
            {
            if (re.test(commitArray[i]))
            {                
                var array = commitArray[i].split(",");
                var storyName = commitArray[i].match(re);
                // check if duplicate story
                var duplicate = false;
                for (s = 0; s < storyList.length; s++)
                    {
                        if (storyList[s].Name == storyName[0].toUpperCase()) { duplicate = true; }
                    }
                if (duplicate == false)
                {
                    var story = {Name: storyName[0].toUpperCase(), Data: {'StoryName': array[0], Commits: 1, Users: array[1].trim(), 'LastModified': array[2].trim()}};
                    storyList.push(story);
                }
                else
                {
                    for (var p in storyList)
                    {                        
                        if (storyList[p].Name == storyName[0].toUpperCase())
                        {
                            if (storyList[p].Data.Users.indexOf(array[1].trim()) < 0)
                            {
                                storyList[p].Data.Users += "," + array[1].trim();
                            }                            
                            storyList[p].Data.Commits++;
                            if (storyList[p].Data['LastModified'] < array[2].trim())
                            {
                                storyList[p].Data['LastModified'] = array[2].trim();
                            }                            
                        }
                    }
                }
            }
            //get unmatched
            //todo: use git show-branch <sha1> to find out what branches specific commits are from
            else
            {
                //var array = commitArray[i].split(",");                
                //var sha1 = array[array.length-1].toString();                
                //GetBranchName(sha1, function (result) {
                //    console.log("Commit Name: " + array[0] + "\n" + "Sha1: " + array[array.length-1] + "\n"+ "Branch: " + result + "\n");
                //    });                
                unmatchedCount++;
            }
        }
        }
        //clean up storylist
        var jsonList = []
        for (var k in storyList)
        {
            storyList[k].Data.StoryName = storyList[k].Data.StoryName.substring(0,1).toUpperCase() + storyList[k].Data.StoryName.substring(1);
            storyList[k].Data.Users = storyList[k].Data.Users.split(",");            
            jsonList.push(storyList[k].Data);
        }
        var summary = {Stories: jsonList, Unmatched: unmatchedCount};
        return callback(summary);
    }

    GetStories = function (branch, diffbranch, callback) {
        args = ["whatchanged", "--oneline", "--format=format:\"" + gitFormat + "\"", branch + ".." + diffbranch];
        GitShell("git", args, function (result) {        
            ProcessStories(result, function(result){
                return callback(result);
            });
        });    
    }

    function GetBranchName(sha1, callback) {
        args = ["show-branch", "--no-name", sha1];
    GitShell("git", args, function (result) {
            var branchName = "";
            //console.log("show branch response: " + result);
            if (result != null)
            {
                branchName = result;
            }
            return callback(branchName);
        });
    }

    return ({
        "GetStories" : GetStories,
        "GetBranches" : GetBranches
    });
}()
