var express = require('express');
var body_parser = require('body-parser');
var _ = require("underscore");
var db = require('./db');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = []
var nextId = 1;
app.use(body_parser.json()); // this will convert each json data coming in into json and put it in requrest.body
app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res) {
	res.send("Todo API Root");
});

app.get('/todos', function(req, res) {
	var query = req.query; // parse quere parameters ?key=value&key2=value2 etc.
	var where = {};

	if (query.hasOwnProperty('completed')) {
		if (query.completed === 'true') {
			where.completed = true;
		} else {
			where.completed = false;
		}
	}
	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%',
		};
	}
	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	});
});

app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	db.todo.findById(todoId).then(function(todo) {
		return res.json(todo.toJSON());
	}).catch(function(e) {
		return res.status(500).send();
	})
});

app.post('/todos', function(req, res) {
	var todoItem = req.body;
	var body = _.pick(req.body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}
	var description = body.description.trim();
	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}).catch(function(e) {
		console.log("Error occured when trying to post new todo item:" + e);
		res.status(400).json(e);
	});
});

app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowsEffected) {
		if (rowsEffected <= 0) {
			return res.status(404).json({
				error: 'no todo with id'
			});
		} else {
			return db.todo.findAll({
				where: {}
			})
		}
	}).then(function(todos) {
		return res.status(204).json(todos);
	}).catch(function(e) {
		res.status(500).send();
	});

});

app.put('/todos/:id', function(req, res) {
	var id = parseInt(req.params.id, 10);
	var body = _.pick(req.body, "description", "completed");
	var validAttibutes = {};

	if (body.hasOwnProperty('completed')) {
		validAttibutes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		validAttibutes.description = body.description;
	}

	db.todo.findById(id).then(function(todo) {
		if (todo) {
			return todo.update(validAttibutes);
		} else {
			res.status(404).send();
		}
	}).then(function(updated) {
		res.json(updated.toJSON());
	}).catch(function(e) {
		res.status(404).send();
	});

});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Listen on port: " + PORT);
	});
}).catch(function(e) {
	console.log("Error occured in db.sync: " + e);
})