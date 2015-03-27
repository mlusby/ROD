module.exports = function(){
    //var repo_location = "C:/git/ROD";
    //var repoLocation = "/Users/e002796/Documents/Git/ROD";
    var repo_location = "/Users/mark.lusby/source/ROD/";
    var storyTag = new RegExp(/^[bBdD]-[0-9]{5}/);
    var gitFormat = "%s, %cN, %ci%n";
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
            return callback(JSON.stringify(array));
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
                        if (storyList[s].Name == storyName) { duplicate = true; }
                    }
                if (duplicate == false)
                {
                    var story = {Name: storyName[0], Description: array[0], Users: array[1], Date: array[2], Commits: 1};
                    storyList.push(story);
                }
                else
                {
                    var story = {Name: storyName[0], Description: array[0], Users: array[1], Date: array[2], Commits: 1};
                    storyList.push(story);
                    //storyList.Name[storyName];
                }

            }
            //get unmatched
            else
            {
                unmatchedCount++;
            }
        }
        var summary = {Stories: storyList, Unmatched: unmatchedCount};
        return callback(summary);
    }

GetStories = function (branch, diffbranch, callback) {
    GitShell("git whatchanged --oneline --format=format:\"" + gitFormat +"\"" + branch + ".." + diffbranch, function (result) {        
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



