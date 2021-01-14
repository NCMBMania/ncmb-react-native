"use strict";
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
var NCMBObject = /** @class */ (function () {
    function NCMBObject(name) {
        this.fields = {};
        this.className = name;
    }
    NCMBObject.prototype.set = function (name, value) {
        this.fields[name] = value;
        return this;
    };
    NCMBObject.prototype.sets = function (json) {
        var _this = this;
        Object.keys(json).forEach(function (key) {
            _this.set(key, json[key]);
        });
        return this;
    };
    NCMBObject.prototype.get = function (name) {
        return this.fields[name];
    };
    NCMBObject.fetch = function () {
        return __awaiter(this, void 0, NCMBObject, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        limit = 1;
                        return [4 /*yield*/, this.fetchAll()];
                    case 1: return [2 /*return*/, (_a.sent())[0]];
                }
            });
        });
    };
    NCMBObject.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, response, body, json, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = ncmb.Request();
                        r.body = this.fields;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, r.delete(this.path())];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 3:
                        body = _a.sent();
                        if (body == '')
                            return [2 /*return*/, true];
                        json = JSON.parse(body);
                        if (json.code) {
                            // エラー
                            throw new Error(json.code + ": " + json.error);
                        }
                        return [2 /*return*/, false];
                    case 4:
                        e_1 = _a.sent();
                        throw e_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NCMBObject.prototype.toJSON = function () {
        var _this = this;
        var json = {};
        Object.keys(this.fields).forEach(function (key) {
            if (['objectId', 'updateDate', 'createDate'].indexOf(key) > -1)
                return;
            if (!isNaN(_this.fields[key])) {
                // number
                json[key] = _this.fields[key];
                return;
            }
            if (_this.fields[key] === null) {
                json[key] = null;
                return;
            }
            switch (_this.fields[key].constructor.name) {
                case 'DataStore':
                case 'User':
                    // Pointer
                    var obj = _this.fields[key];
                    json[key] = {
                        '__type': 'Pointer',
                        'className': obj.className,
                        'objectId': obj.get('objectId')
                    };
                    break;
                case 'Date':
                    var date = _this.fields[key];
                    json[key] = {
                        '__type': 'Date',
                        'iso': date.toISOString()
                    };
                    break;
                case 'Acl':
                    json[key] = _this.fields[key].toJSON();
                    break;
                default:
                    if (typeof _this.fields[key].toJSON === 'function') {
                        json[key] = _this.fields[key].toJSON();
                    }
                    else {
                        json[key] = _this.fields[key];
                    }
            }
            ;
        });
        return json;
    };
    NCMBObject.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, method, response, json_1, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = ncmb.Request();
                        r.body = this.toJSON();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        method = this.fields.objectId ? 'put' : 'post';
                        return [4 /*yield*/, r[method](this.path())];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        json_1 = _a.sent();
                        if (json_1.code) {
                            // エラー
                            throw new Error(json_1.code + ": " + json_1.error);
                        }
                        Object.keys(json_1).forEach(function (key) {
                            _this.set(key, json_1[key]);
                        });
                        return [2 /*return*/, true];
                    case 4:
                        e_2 = _a.sent();
                        throw e_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NCMBObject.prototype.path = function () {
        var basePath = '';
        if (['users', 'roles', 'files'].indexOf(name) > -1) {
            basePath = "/" + ncmb.version + "/" + name;
        }
        else {
            basePath = "/" + ncmb.version + "/classes/" + name;
        }
        if (this.fields.objectId) {
            return basePath + "/" + this.fields.objectId;
        }
        else {
            return basePath;
        }
    };
    NCMBObject.path = function () {
        if (['users', 'roles'].indexOf(name) > -1) {
            return "/" + ncmb.version + "/" + name;
        }
        else {
            return "/" + ncmb.version + "/classes/" + name;
        }
    };
    return NCMBObject;
}());
exports.default = NCMBObject;
