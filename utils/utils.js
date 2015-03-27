module.exports = function(){

//This is a small util repository I created for functions that might be useful

	ArrayCleanUp = function(array, callback){
		var newArray = []
		for (var i = 0; i < array.length; i++)
		{
			if (array[i] !== "" && array[i] !== null)
				{ newArray.push(array[i]);}
		}
		return callback(newArray);
	}

	return ({
        "ArrayCleanUp" : ArrayCleanUp        
    });
}()