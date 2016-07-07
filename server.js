var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();   // creates an Express application
var PORT = 3000;       // to store the port number
var allTodos = [];     // to store all the todos
var todoCounter = 1;   // to keep track of todo ids

// set up application level middleware
app.use(bodyParser.json());

// Home page
app.get('/', function (req, res) {
    res.send('Welcome to my todo app');
});

// GET - to get all todos or based on query parameter passed
app.get('/todos/', function (req, res) {
    
    var query = req.query; // to store the query string passed in the request
    var where = {};        // to store the Where clause of the query

    if (_.has(query, 'completed') && query.completed === 'true') {
        where.completed = true;
    } else if (_.has(query, 'completed') && query.completed === 'false') {
        where.completed = false;
    }

    // to check if the query is valid
    if (_.has(query, 'q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + "%"
        };
    }

    db.Todo.findAll({where: where}).then(function (todosArray) {
        res.json(todosArray); // return the found todo item 
    }, function (error) {
        res.status(500).json(error);
    });
});

// GET - to get an item from it's id
app.get('/todos/:id', function (req, res) {

    var idToFetch = parseInt(req.params.id); // to store the id passed in the request

    // search for known ids
    db.Todo.findById(idToFetch).then(function (todoItem) {
        if (!!todoItem) {
            res.json(todoItem.toJSON());
        } else {
            res.status(404).send();
        }
    }).catch(function (error) {
        console.log(error);
        res.status(500).send();
    });
});

// POST - to add a new todo item
app.post('/todos/', function (req, res) {
    
    var itemToAdd = _.pick(req.body, 'description', 'completed'); // to store only the required attr
    itemToAdd.description = itemToAdd.description.trim();         // trim the trailing and leading white spaces

    db.Todo.create(itemToAdd).then(function (todoItem) {
        res.json(todoItem.toJSON()); // send back new data
    }, function (error) {
        return res.status(400).json(error);
    });
});

// PUT - to update an existing todo item
app.put('/todos/:id', function (req, res) {

    var idToFetch = parseInt(req.params.id); // to store the id passed in the request
    var attrToUpdate = _.pick(req.body, 'description', 'completed'); // to pick only the required attributes from the request
    var attributes = {}; // to store the new attributes for updating

    // Check if completed attributes is a part of update
    if (_.has(attrToUpdate, 'completed')) {
        attributes.completed = attrToUpdate.completed; // add completed to attributes object
    }

    // Check if description attribute is a part of the update
    if (_.has(attrToUpdate, 'description')) {
        attributes.description = attrToUpdate.description; // add description to attributes object
    }

    db.Todo.findById(idToFetch).then(function (todo) {
        // if todo is found
        if (todo) {
            // fire update method with new attributes on the todo
            todo.update(attributes).then(function (updatedTodo) {
                // send the updated todo in response
                res.json(updatedTodo);
            }, function (error) {
                res.status(400).json(error);
            })
        } else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });
});

// DELETE - to remove an item from the todo item list
app.delete('/todos/:id', function (req, res) {

    var idToDelete = parseInt(req.params.id, 10); // to store the id passed in the request

    db.Todo.destroy({
        where: {
            id: idToDelete
        }
    }).then(function (rowsDeleted) {
        if (rowsDeleted === 1) {
            res.status(204).send(); // 204 means 200 but nothing to send back
        } else {
            res.status(404).json({
                error: 'No todo with id'
            });
        }
    }, function (error) {
        res.status(500).json({
            error: error
        });
    });
});

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log("Express listening on port " + PORT + "...");
    });
}).catch(function (errorObj) {
    console.log(errorObj);
});

