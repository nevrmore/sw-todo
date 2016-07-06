// load all the modules into sequelize
// and return the database connection to server.js which
// is going to call this file.

var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-todo-api.sqlite'
});

var db = {};

db.Todo = sequelize.import(__dirname + '/models/todo.js'); // todo model
db.sequelize = sequelize; // the sequelize instance
db.Sequelize = Sequelize; // the sequelize library

module.exports = db;