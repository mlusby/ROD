var nconf = require('nconf'),
    path = require('path'),
    exec = require('child_process').exec;

nconf
.argv()
.env()
.file({file: path.join(__dirname, 'config.json')});

module.exports = function(){
    //var repo_location = "C:/git/ROD";
    //var repoLocation = "/Users/e002796/Documents/Git/ROD";
    var repo_location = nconf.get("git:repoLocation");
    var storyTag = new RegExp(/^[bBdD]-[0-9]{5}/);
    var gitFormat = "%s, %cN, %ci%n";
    //git-whatchanged format info:  https://www.kernel.org/pub/software/scm/git/docs/git-whatchanged.html
    //%N = commit notes
    //%cN = commiter name
    //%ci = commiter date

    function GitShell(cmd, callback) {
        console.log(cmd);
        var command = exec(cmd,{cwd: repo_location}),
            result = '';
            command.stdout.on('data', function(data) {
                result += data.toString();
            });
        command.stderr.on('data', function(data) {
            result += data.toString();        
        });
        if (command.error != null)
        {
            console.log('exec error: ' + command.error);
        }
        command.on('close', function(code) {
            return callback(result);
        });
    }

    GetBranches = function (callback) {
        GitShell("git branch --all", function (result) {
            //var re = new RegExp(/^\s*/, 'gmi');
            var re = new RegExp('remotes/origin/', 'gmi');
            result.replace(re, '');
            var array = result.split("\n  ");
            return callback(array);
        });    
    }

//GetBranches(repoLocation, function (array) { console.log(array); });

    function ProcessStories(result, callback){
        var filtered = result.replace(/^.+?\.{2}.+?\n|^:.*$\n|^:.*$|^\s*/gmi,"");
        var commitArray = filtered.split("\n");
        var unmatchedCount = 0;
        var storyList = [];     
        for (i = 0; i < commitArray.length; i++)
        {            
            var re = new RegExp(/^[bBdD]-[0-9]{5}/);                       
            if (re.test(commitArray[i]))
            {
                var array = commitArray[i].split(",");
                var storyName = commitArray[i].match(re);
                // check if duplicate story
                var duplicate = false;
                for (s = 0; s < storyList.length; s++)
                    {
                        if (storyList[s].Name == storyName[0]) { duplicate = true; }
                    }
                if (duplicate == false)
                {
                    var story = {Name: storyName[0], Data: {'StoryName': array[0], Commits: 1, Users: array[1].trim(), 'Last Modified': array[2].trim()}};
                    storyList.push(story);
                }
                else
                {
                    for (var p in storyList)
                    {
                        if (storyList[p].Name == storyName[0])
                        {
                            if (storyList[p].Data.Users.indexOf(array[1].trim()) < 0)
                            {
                                storyList[p].Data.Users += "," + array[1].trim();
                            }                            
                            storyList[p].Commits++;
                            if (storyList[p].Data['Last Modified'] < array[2].trim())
                            {
                                storyList[p].Data['Last Modified'] = array[2].trim();
                            }                            
                        }
                    }
                }

            }
            //get unmatched
            else
            {
                unmatchedCount++;
            }
        }
        //clean up storylist
        var jsonList = []
        for (var k in storyList)
        {
            storyList[k].Data.Users = storyList[k].Data.Users.split(",");
            jsonList.push(storyList[k].Data);
        }
        var summary = {Stories: jsonList, Unmatched: unmatchedCount};
        return callback(summary);
    }

    GetStories = function (branch, diffbranch, callback) {
        GitShell("git whatchanged --oneline --format=format:\"" + gitFormat +"\" " + branch + ".." + diffbranch, function (result) {        
            ProcessStories(result, function(result){
                return callback(result);
            });
        });    
    }
    return ({
        "GetStories" : GetStories,
        "GetBranches" : GetBranches
    });
}()



