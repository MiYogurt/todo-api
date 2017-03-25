"use strict";
var Sequelize = require("sequelize");
var path_1 = require("path");
var sq = new Sequelize('db', null, null, {
    dialect: 'sqlite',
    storage: path_1.resolve(__dirname, '../storage/db.sqlite3')
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sq;
//# sourceMappingURL=db.js.map