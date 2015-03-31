module.exports = function(){

//This is a small util repository I created for functions that might be useful

	ArrayCleanUp = function(array, callback) {
	    var newArray = [];
		for (var i = 0; i < array.length; i++)
		{
			if (array[i] !== "" && array[i] !== null)
				{ newArray.push(array[i]);}
		}
		return callback(newArray);
    }
    
    RemoveQuotes = function(array, callback) {
        for (var p in array) {
            var noQuotes = array[p].replace(/^\"|\"$/gm, "");
            array[p] = noQuotes;
        }
        return callback(array);
    }

    return ({
        "ArrayCleanUp": ArrayCleanUp,
        "RemoveQuotes": RemoveQuotes
});
}()