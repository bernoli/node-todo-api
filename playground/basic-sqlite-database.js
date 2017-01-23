var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + "/basic_sqlite_database.sqlite"
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [1, 250], // see documentation of sequelize for more on validation options etc.
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

//{force:true} will delete all the tables and recreate, the default is false, so only update is done.
sequelize.sync({
	//force: true
}).then(function() {
	return Todo.findAll({
		where: {
			id: 1
		}
	})
}).then(function(todos) {
	if (todos) {
		todos.forEach(function(todo) {
			console.log(todo.toJSON());
		});

	} else {
		console.log("Could not find item");
	}
}).catch(function(e) {
	console.log("Error: " + e);
});


// console.log("All is synched");
// Todo.create({
// 	description: "Walk my dog home",
// }).then(function() {
// 	return Todo.create({
// 		description: "Clean the office"
// 	})
// }).then(function() {
// 	//return Todo.findById(1);
// 	// return Todo.findAll({
// 	// 	where:{
// 	// 		completed:false
// 	// 	}
// 	// })
// 	return Todo.findAll({
// 		where:{
// 			description:{
// 				$like:'%dog%',
// 			}
// 		}
// 	})
// }).then(function(todos) {
// 	if (todos) {
// 		todos.forEach(function(todo){
// 			console.log(todo.toJSON());	
// 		});

// 	} else {
// 		console.log("No todos found");
// 	}
// }).catch(function(e) { // at the end of promises chain, we can add catch for any error in the chain.
// 	console.log("Error: " + e);
// })
//});