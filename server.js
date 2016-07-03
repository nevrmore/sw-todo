var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express(); // creates an Express application
var PORT = 3000; // to store the port number
var allTodos = []; // to store all the todos
var todoCounter = 1; // to keep track of todo ids

// set up middleware
app.use(bodyParser.json());

// Home page
app.get('/', function (req, res) {
	res.send('Welcome to my todo app');
});

// GET - to get all todos
app.get('/todos/', function (req, res) {
	res.json(allTodos); // this will convert todos JS array to json and send back to the caller
});

// GET - to get an item from it's id
app.get('/todos/:id', function (req, res) {
	var idToFetch = parseInt(req.params.id);
	var matchedTodo = _.findWhere(allTodos, {id: idToFetch});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

// POST - to add a new todo item
app.post('/todos/', function (req, res) {
	
	var itemToAdd = _.pick(req.body, 'description', 'completed'); // to store only the required attr
	itemToAdd.description = itemToAdd.description.trim(); // trim the trailing and leading white spaces
	if (!_.isBoolean(itemToAdd.completed) || !_.isString(itemToAdd.description) || itemToAdd.description.length === 0) {
		return res.status(400).send(); // return is important so that the next instructions don't get executed
	}
	itemToAdd.id = todoCounter++; // set the id attribute of the todo item
	allTodos.push(itemToAdd); // add the new todo item to the main list
	res.send(itemToAdd);
});

// PUT - to update an existing todo item
app.put('/todos/:id', function (req, res) {
	
	var idToFetch = parseInt(req.params.id); // to store the id of the todo item to be updated
	console.log('Id to Fetched is ' + idToFetch);
	
	var attrToUpdate = _.pick(req.body, 'description', 'completed'); // to store only the required attrs from the request
	console.log('Data send to updated is ');
	console.log(attrToUpdate);

	var matchedTodo = _.findWhere(allTodos, {id: idToFetch}); // to store the matched todo item object
	console.log('Matched todo item is ');
	console.log(matchedTodo);
	
	var validAttributes = {}; // to store all the valid attributed for updating
	
	if (!matchedTodo) {
		return res.status(404).json({"error": "Item with that id was not found."});
	}

	if (attrToUpdate.hasOwnProperty('completed') && _.isBoolean(attrToUpdate.completed)) {
		console.log('Updating the value of attribute: completed');
		validAttributes.completed = attrToUpdate.completed;
	} else if (attrToUpdate.hasOwnProperty('completed')) {
		console.log("Error in updating attribute completed")
		return res.status(400).send();
	}

	if (attrToUpdate.hasOwnProperty('description') && _.isString(attrToUpdate.description) && attrToUpdate.description.trim().length > 0) {
		console.log('Updating the value of attribute: description');
		validAttributes.description = attrToUpdate.description.trim(); // trim leading and trailing with spaces
	} else if (attrToUpdate.hasOwnProperty('description')) {
		console.log("Error in updating attribute description")
		return res.status(400).send();
	}

	console.log(validAttributes);
	
	// Came here means everything turned out to be alright
	_.extend(matchedTodo, validAttributes);
	res.status(200).json({
		"message": "Value successfully updated"
	});
});

// DELETE - to remove an item from the todo item list
app.delete('/todos/:id', function (req, res) {
	var idToFetch = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(allTodos, {id: idToFetch});

	if (matchedTodo) {
		allTodos = _.without(allTodos, matchedTodo);
		res.json(matchedTodo);
	} else {
		res.status(404).json({
			"error": "No item with that id was found."
		});
	}
});

app.listen(PORT, function () {
	console.log("Express listening on port " + PORT + "...");
});