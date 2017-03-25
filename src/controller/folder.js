"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var todoFolder_1 = require("../model/todoFolder");
var todo_1 = require("../model/todo");
function getFields(ctx, next) {
    try {
        var _a = ctx.request.fields, user_id = _a.user_id, title = _a.title;
        return [user_id, title];
    }
    catch (e) {
        console.error(e);
        ctx.status = 422;
        ctx.body = '[Unprocesable entity] \n验证失败，必须传递 user_id/title 字段';
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    create: function (ctx, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, user_id, title, folder, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = getFields(ctx, next), user_id = _a[0], title = _a[1];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, todoFolder_1.TodoFolder.create({
                                user_id: user_id,
                                title: title
                            })];
                    case 2:
                        folder = _b.sent();
                        ctx.body = folder;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        ctx.body = e_1.errors[0].message;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    edit: function (ctx, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, title, folder, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        id = ctx.params.id;
                        title = ctx.request.fields.title;
                        return [4 /*yield*/, todoFolder_1.TodoFolder.findOne({
                                where: {
                                    id: id
                                }
                            })];
                    case 1:
                        folder = _a.sent();
                        if (title)
                            folder.title = title;
                        return [4 /*yield*/, folder.save()];
                    case 2:
                        _a.sent();
                        ctx.body = folder;
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.error(e_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    show: function (ctx, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, folder, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = ctx.params.id;
                        return [4 /*yield*/, todoFolder_1.TodoFolder.findOne({
                                where: {
                                    id: id
                                }
                            })];
                    case 1:
                        folder = _a.sent();
                        ctx.body = folder;
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        ctx.status = 422;
                        ctx.body = '[Unprocesable entity] \n 验证失败，必须传递 folder_id 字段';
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    delete: function (ctx, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        id = ctx.params.id;
                        return [4 /*yield*/, todo_1.Todo.destroy({
                                where: {
                                    'todo_folder_id': id
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, todoFolder_1.TodoFolder.destroy({
                                where: {
                                    id: id
                                }
                            })];
                    case 2:
                        _a.sent();
                        ctx.body = "删除成功";
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        ctx.status = 422;
                        ctx.body = '[Unprocesable entity] \n验证失败，必须传递 folder_id 字段';
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};
//# sourceMappingURL=folder.js.map