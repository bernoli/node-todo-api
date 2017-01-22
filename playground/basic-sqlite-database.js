var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect':'sqlite',
	'storage': __dirname+"/basic_sqlite_database.sqlite"
});

var Todo = sequelize.define('todo', {
	description:{
		type:Sequelize.STRING
	},
	completed:{
		type:Sequelize.BOOLEAN
	}
});

sequelize.sync().then(function(){
	console.log("All is synched");
});