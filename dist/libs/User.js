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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importStar(require("../index"));
var uuid_1 = require("uuid");
var NCMBUser = /** @class */ (function (_super) {
    __extends(NCMBUser, _super);
    function NCMBUser() {
        return _super.call(this, 'users') || this;
    }
    NCMBUser.query = function () {
        return new index_1.NCMBQuery('users');
    };
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
                        r = new index_1.NCMBRequest();
                        r.body = this.fields;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, r.post(this.path())];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        json = (_a.sent());
                        if (json.code) {
                            // エラー
                            throw new Error(json.code + ": " + json.error);
                        }
                        NCMBUser.ncmb.sessionToken = json.sessionToken;
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
    NCMBUser.requestSignUpEmail = function (mailAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var r, response, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = new index_1.NCMBRequest;
                        r.body = { mailAddress: mailAddress };
                        return [4 /*yield*/, r.post("/" + index_1.default.version + "/requestMailAddressUserEntry")];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = (_a.sent());
                        if (json.code) {
                            // エラー
                            throw new Error(json.code + ": " + json.error);
                        }
                        return [2 /*return*/, !!json.createDate];
                }
            });
        });
    };
    NCMBUser.requestPasswordReset = function (mailAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var r, response, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = new index_1.NCMBRequest;
                        r.body = { mailAddress: mailAddress };
                        return [4 /*yield*/, r.post("/" + index_1.default.version + "/requestPasswordReset")];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = (_a.sent());
                        if (json.code) {
                            // エラー
                            throw new Error(json.code + ": " + json.error);
                        }
                        return [2 /*return*/, !!json.createDate];
                }
            });
        });
    };
    NCMBUser.loginAsAnonymous = function (uuid) {
        return __awaiter(this, void 0, void 0, function () {
            var r, response, json, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = new index_1.NCMBRequest();
                        r.body = {
                            authData: {
                                anonymous: {
                                    id: uuid || uuid_1.v4()
                                }
                            }
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, r.post(NCMBUser.path())];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        json = (_a.sent());
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
    NCMBUser.path = function () {
        return "/" + index_1.default.version + "/users";
    };
    NCMBUser.currentUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ncmb, str, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ncmb = NCMBUser.ncmb;
                        if (ncmb.currentUser)
                            return [2 /*return*/, ncmb.currentUser];
                        if (!ncmb.storage)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, ncmb.storage.getItem('currentUser')];
                    case 1:
                        str = _a.sent();
                        if (str === null) {
                            return [2 /*return*/, null];
                        }
                        json = JSON.parse(str);
                        return [4 /*yield*/, NCMBUser.setUser(json)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NCMBUser.login = function (userName, password) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                query = { userName: userName, password: password };
                return [2 /*return*/, NCMBUser.loginWithUserNameOrMailAddress(query)];
            });
        });
    };
    NCMBUser.loginWithMailAddress = function (mailAddress, password) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                query = { mailAddress: mailAddress, password: password };
                return [2 /*return*/, NCMBUser.loginWithUserNameOrMailAddress(query)];
            });
        });
    };
    NCMBUser.loginWithUserNameOrMailAddress = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var r, response, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = new index_1.NCMBRequest;
                        return [4 /*yield*/, r.get("/" + index_1.default.version + "/login", query)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = (_a.sent());
                        return [4 /*yield*/, NCMBUser.setUser(json)];
                    case 3: return [2 /*return*/, _a.sent()];
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
                        NCMBUser.ncmb.sessionToken = json.sessionToken;
                        if (!NCMBUser.ncmb.storage) return [3 /*break*/, 2];
                        return [4 /*yield*/, NCMBUser.ncmb.storage.setItem('currentUser', JSON.stringify(json))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        delete json.sessionToken;
                        user = new NCMBUser();
                        user.sets(json);
                        NCMBUser.ncmb.currentUser = user;
                        return [2 /*return*/, user];
                }
            });
        });
    };
    NCMBUser.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        NCMBUser.ncmb.sessionToken = null;
                        if (!NCMBUser.ncmb.storage) return [3 /*break*/, 2];
                        return [4 /*yield*/, NCMBUser.ncmb.storage.removeItem('currentUser')];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, true];
                }
            });
        });
    };
    return NCMBUser;
}(index_1.NCMBObject));
exports.default = NCMBUser;
