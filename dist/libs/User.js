"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Object_ts_1 = __importDefault(require("./Object.ts"));
var v4_1 = __importDefault(require("uuid/v4"));
var NCMBUser = /** @class */ (function (_super) {
    __extends(NCMBUser, _super);
    function NCMBUser() {
        var _this = _super.call(this, 'users') || this;
        _this.className = 'user';
        return _this;
    }
    NCMBUser.prototype.signUpWith = function (provider, authData) {
        return __awaiter(this, void 0, void 0, function () {
            var expireDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expireDate = new Date(authData.expires + (new Date()).getTime()).toJSON();
                        authData.expiration_date = {
                            __type: 'Date',
                            iso: expireDate
                        };
                        delete authData.expires;
                        this.fields = { authData: {} };
                        this.fields.authData[provider] = authData;
                        return [4 /*yield*/, this.signUpByAccount()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NCMBUser.prototype.signUpByAccount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, response, json, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = ncmb.Request();
                        r.body = this.fields;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, r.post(this.path())];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        json = _a.sent();
                        if (json.code) {
                            // エラー
                            throw new Error(json.code + ": " + json.error);
                        }
                        ncmb.sessionToken = json.sessionToken;
                        delete json.sessionToken;
                        this.sets(json);
                        return [2 /*return*/, true];
                    case 4:
                        e_1 = _a.sent();
                        throw e_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NCMBUser.loginAsAnonymous = function () {
        return __awaiter(this, void 0, User, function () {
            var r, response, json, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = ncmb.Request();
                        r.body = {
                            authData: {
                                anonymous: {
                                    id: v4_1.default()
                                }
                            }
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, r.post(this.path())];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        json = _a.sent();
                        return [4 /*yield*/, this.setUser(json)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        e_2 = _a.sent();
                        throw e_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    NCMBUser.currentUser = function () {
        return __awaiter(this, void 0, User, function () {
            var string, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (ncmb.currentUser)
                            return [2 /*return*/, ncmb.currentUser];
                        if (!ncmb.storage)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, ncmb.storage.getItem('currentUser')];
                    case 1:
                        string = _a.sent();
                        if (string === null) {
                            return [2 /*return*/, null];
                        }
                        json = JSON.parse(string);
                        return [4 /*yield*/, this.setUser(json)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NCMBUser.login = function (userName, password) {
        return __awaiter(this, void 0, User, function () {
            var r, query, response, json, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = ncmb.Request();
                        query = { userName: userName, password: password };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, r.get("/" + ncmb.version + "/login", query)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        json = _a.sent();
                        return [4 /*yield*/, this.setUser(json)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        e_3 = _a.sent();
                        throw e_3;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    NCMBUser.setUser = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (json.code) {
                            // エラー
                            throw new Error(json.code + ": " + json.error);
                        }
                        ncmb.sessionToken = json.sessionToken;
                        if (!ncmb.storage) return [3 /*break*/, 2];
                        return [4 /*yield*/, ncmb.storage.setItem('currentUser', JSON.stringify(json))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        delete json.sessionToken;
                        user = new ncmb.User();
                        user.sets(json);
                        ncmb.currentUser = user;
                        return [2 /*return*/, user];
                }
            });
        });
    };
    NCMBUser.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ncmb.storage.removeItem('currentUser')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return NCMBUser;
}(Object_ts_1.default));
exports.default = NCMBUser;
