var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = []; // to store all todo items, this is the model of the app
todos = [{
	id: 1,
	description: 'Some random description',
	completed: false
}, {
	id: 2,
	description: 'Watch movie with Bran.',
	completed: false
}, {
	id: 3,
	description: 'This is todo item number 3.',
	completed: true
}];

app.get('/', function (req, res) {
	res.send("Todo API Root");
});

// To get all pending todos
app.get('/todos', function (req, res) {
	res.json(todos);  // this will convert todos JS array to json and send back to the caller
});

// To get a specific todo
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


app.listen(PORT, function () {
	console.log("Express listening on port " + PORT + "...");
});

