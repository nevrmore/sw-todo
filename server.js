var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = []; // to store all todo items, this is the model of the app
var todoNextId = 1; // increment our todo id each time we add a new todo item to the list so that they all have unique id


// set up middleware
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send("Todo API Root");
});

// To GET all pending todos
app.get('/todos', function (req, res) {
	res.json(todos);  // this will convert todos JS array to json and send back to the caller
});

// To GET a specific todo
app.get('/todos/:id', function (req, res) {
	
	//res.send("Asking for todo with id of " + todoId);
	var todoId = req.params.id;  // store the received todo it
	todoId = parseInt(todoId, 10);   // convert id into number
	var matchedTodo;  // to store the matched todo item
	
	// Iterate over todo array and find the match.
	todos.forEach(function (todo) {
		if (todo.id === todoId) {
			matchedTodo = todo;
			return;
		}
	});

	if (matchedTodo) {
		res.json(matchedTodo);
	}
	else {
		res.status(404).send(); // If there is no match, we do this.
	}

});

// POST - to add a new todo item
app.post('/todos/', function (req, res) {
	var body = req.body;

	body.id = todoNextId++; // set the id and then increment

	todos.push(body); // push the new todo item 

	console.log(todos);

	// console.log('description: ' + body.description);

	res.json(body);
});

app.listen(PORT, function () {
	console.log("Express listening on port " + PORT + "...");
});

