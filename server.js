var express = require('express');
var body_parser = require('body-parser');
var _ = require("underscore");

var app = express();
var PORT = process.env.PORT || 3000;

var todos =[]
var nextId = 1;
app.use(body_parser.json());  // this will convert each json data coming in into json and put it in requrest.body
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
	var todo = _.findWhere(todos, {id:todoId});
	if (typeof todo != 'undefined'){
		res.json(todo);
	}
	else
	{
		res.status(404).send();
	}
	//res.send('Asking for todo with ID: '+ req.params.id)
});

app.post('/todos', function(req, res){
	var todoItem = req.body;
    var body = _.pick(req.body, 'description','completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length ===0)
	{
		return res.status(400).send();
	}

	body.description = body.description.trim();

	todoItem.id = nextId++;
	todos.push(todoItem);
	res.json(body);
	
});


app.listen(PORT,function(){
	console.log("Listen on port: " + PORT);
})