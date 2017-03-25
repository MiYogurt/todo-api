"use strict";
var db_1 = require("../db");
var Sequelize = require("sequelize");
var user_1 = require("./user");
var TodoFolder = db_1.default.define('todo_folder', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.TEXT
    },
    'user_id': {
        type: Sequelize.INTEGER,
        references: {
            model: user_1.User,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    freezeTableName: true // 模型名字与表名相同
});
exports.TodoFolder = TodoFolder;
user_1.User.hasMany(TodoFolder, { constraints: false, as: 'Folders', foreignKey: 'user_id' });
//# sourceMappingURL=todoFolder.js.map