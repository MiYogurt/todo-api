"use strict";
var db_1 = require("../db");
var Sequelize = require("sequelize");
var todoFolder_1 = require("./todoFolder");
var Todo = db_1.default.define('todo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: Sequelize.TEXT
    },
    completed: {
        type: Sequelize.BOOLEAN
    },
    'todo_folder_id': {
        type: Sequelize.INTEGER,
        references: {
            model: todoFolder_1.TodoFolder,
            key: 'id'
        }
    }
}, {
    freezeTableName: true // 模型名字与表名相同
});
exports.Todo = Todo;
todoFolder_1.TodoFolder.hasMany(Todo, { as: 'Todos', foreignKey: 'todo_folder_id' });
//# sourceMappingURL=todo.js.map