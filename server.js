var express = require('express');
var body_parser = require('body-parser');
var _ = require("underscore");

var app = express();
var PORT = process.env.PORT || 3000;

var todos =[]
var nextId = 1;
app.use(body_parser.json());  // this will convert each json data coming in into json and put it in requrest.body
app.use(express.static(__dirname+"/public"));

app.get('/', function(req, res)
{
		res.send("Todo API Root");
});

app.get('/todos', function(req, res)
{
	var reqParams = req.query; // parse quere parameters ?key=value&key2=value2 etc.
	var filteredTodos = todos;
	
	if (reqParams.hasOwnProperty('completed')){
		if (reqParams.completed === 'true'){
			filteredTodos = _.where(filteredTodos, {completed:true});
		}else{
			filteredTodos = _.where(filteredTodos,{completed:false});
		}
	}

	res.json(filteredTodos);   
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

app.post('/todos', function(req, res)
{
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

app.delete('/todos/:id', function(req, res)
{
	var todoId = parseInt(req.params.id,10);
	var todoItem = _.findWhere(todos, {id:todoId});
	if (!todoItem){
		return res.status(400).send();
	}
	todos = _.without(todos, todoItem);
	return res.json(todos);
});

app.put('/todos/:id', function(req, res)
{
	var id = parseInt(req.params.id,10);
	var todoItem = _.findWhere(todos, {id:id});

	if (!todoItem)
	{
		return res.status(404).send();
	}
	var body = _.pick(req.body,"description","completed");
	
	var validAttibutes = {};
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed))
	{
		validAttibutes.completed = body.completed;
	} 
	else if (body.hasOwnProperty('completed'))
	{
		//bad not a  boolean
		return res.status(400).send();
	}else
	{
		 // never provided the attibute, can continue no problem
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0)
	{
		validAttibutes.description = body.description;
	}else if (body.hasOwnProperty('description')){
		return res.status(400).send();
	}else{

	}
	_.extend(todoItem,validAttibutes);
	res.json(todoItem);

});

app.listen(PORT,function(){
	console.log("Listen on port: " + PORT);
});