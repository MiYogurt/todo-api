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
var user_1 = require("../model/user");
var ph = require("password-hash");
var jwt = require("jsonwebtoken");
var secret = 'todo-app';
function getFields(ctx, next) {
    try {
        var _a = ctx.request.fields, username = _a.username, email = _a.email, password = _a.password;
        return [username, email, password];
    }
    catch (e) {
        console.error(e);
        ctx.status = 422;
        ctx.body = '[Unprocesable entity] \n验证失败，必须传递 username/email/password 三个字段';
    }
}
function exceptPassword(user) {
    user = JSON.parse(JSON.stringify(user));
    if (user.password)
        delete user.password;
    return user;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    register: function (ctx, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, username, email, password, user, ret, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = getFields(ctx, next), username = _a[0], email = _a[1], password = _a[2];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, user_1.default.createUser({
                                username: username,
                                email: email,
                                password: password
                            })];
                    case 2:
                        user = _b.sent();
                        ret = exceptPassword(user);
                        ctx.state.user = jwt.sign(ret, secret);
                        ctx.body = ctx.state.user;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        console.error(e_1);
                        ctx.status = 422;
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, next()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    login: function (ctx, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _, email, password, db_user, ret, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = getFields(ctx, next), _ = _a[0], email = _a[1], password = _a[2];
                        ctx.status = 400;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, user_1.User.findOne({
                                where: {
                                    email: email
                                }
                            })];
                    case 2:
                        db_user = _b.sent();
                        if (ph.verify(password, db_user.password)) {
                            ctx.status = 200;
                            ret = exceptPassword(db_user);
                            ctx.state.user = jwt.sign(ret, secret);
                            ctx.body = ctx.state.user;
                        }
                        else {
                            ctx.body = "密码不正确";
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _b.sent();
                        console.error(e_2);
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, next()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
};
//# sourceMappingURL=user.js.map