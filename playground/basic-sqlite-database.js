var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
}); // store an instance of sequelize

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [2, 240]  // only allow values with length between 1 and 240
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync({
    force: true
}).then(function (sucess) {

    console.log('Everything is synced.');

    Todo.create({
        description: "Take out trash"
    }).then(function (todo) {
        console.log('Finished!');
        return Todo.create({
            description: "Water the plants",
            completed: false
        });
    }).then(function () {
        // return Todo.findById(1); // 
        return Todo.findAll({
            where: {
                description: {
                    $like: '%trash%'
                }
            }
        });

    }).then(function (todos) {
        if (todos) {
            todos.forEach(function (todo) {
                console.log(todo.toJSON());
            });
        } else {
            console.log("No todo item found with that id");
        }
    }).catch(function (errorObj) {
        console.log(errorObj);
    });
});