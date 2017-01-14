var express = require('express');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [
	{
		description:'Meet toli for lunch',
		completed:false,
		id:1,
	},
	{
		description:'Go to market',
		completed:false,
		id:2,
	},
	{
		id:3,
		description:'Study node.js from udemy.',
		completed:true
	}
]

app.use(express.static(__dirname+"/public"));

app.get('/', 
	function(req, res)
	{
		res.send("Todo API Root");
	}
	);

app.get('/todos', 
	function(req, res)
	{
		res.json(todos);   
	});

app.get('/todos/:id', function(req,res)
{
	var todoId = parseInt(req.params.id,10);
	var todo;
	for (var i = 0; i < todos.length; i++)
	 {
		if (todos[i].id == todoId)
		{
			todo = todos[i];
			break;
		}
	}
	if (typeof todo != 'undefined'){
		res.json(todo);
	}
	else
	{
		res.status(404).send();
	}
	//res.send('Asking for todo with ID: '+ req.params.id)
});

app.listen(PORT,function(){
	console.log("Listen on port: " + PORT);
})