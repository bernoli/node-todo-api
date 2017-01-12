var express = require('express');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.static(__dirname+"/public"));

app.get('/', 
	function(req, res)
	{
		res.send("Todo API Root");
	}
	);

app.listen(PORT,function(){
	console.log("Listen on port: " + PORT);
})