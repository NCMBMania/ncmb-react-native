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
var index_1 = require("../index");
var NCMBScript = /** @class */ (function () {
    function NCMBScript(scriptName, method) {
        this.scriptName = '';
        this.method = '';
        this._headers = {};
        this._queries = {};
        this._bodies = {};
        this.scriptName = scriptName;
        this.method = method;
    }
    NCMBScript.prototype.header = function (name, value) {
        this._headers[name] = value;
        return this;
    };
    NCMBScript.prototype.headers = function (headers) {
        for (var key in headers) {
            this.header(key, headers[key]);
        }
        return this;
    };
    NCMBScript.prototype.query = function (name, value) {
        this._queries[name] = value;
        return this;
    };
    NCMBScript.prototype.queries = function (queries) {
        for (var key in queries) {
            this.query(key, queries[key]);
        }
        return this;
    };
    NCMBScript.prototype.body = function (name, value) {
        this._bodies[name] = value;
        return this;
    };
    NCMBScript.prototype.bodies = function (bodies) {
        for (var key in bodies) {
            this.body(key, bodies[key]);
        }
        return this;
    };
    NCMBScript.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, _a, response, json, method, response, json, response, json;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        r = new index_1.NCMBRequest;
                        r.script = true;
                        if (Object.keys(this._headers).length > 0) {
                            r.addHeaders = this._headers;
                        }
                        _a = this.method;
                        switch (_a) {
                            case 'GET': return [3 /*break*/, 1];
                            case 'POST': return [3 /*break*/, 4];
                            case 'PUT': return [3 /*break*/, 4];
                            case 'DELETE': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 10];
                    case 1: return [4 /*yield*/, r.get(this.path(), this._queries)];
                    case 2:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        json = _b.sent();
                        if (json.code) {
                            // エラー
                            throw new Error(json.code + ": " + json.error);
                        }
                        return [2 /*return*/, json];
                    case 4:
                        r.body = this._bodies;
                        method = this.method == 'POST' ? 'post' : 'put';
                        return [4 /*yield*/, r[method](this.path())];
                    case 5:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 6:
                        json = _b.sent();
                        if (json.code) {
                            // エラー
                            throw new Error(json.code + ": " + json.error);
                        }
                        return [2 /*return*/, json];
                    case 7: return [4 /*yield*/, r.delete(this.path())];
                    case 8:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 9:
                        json = _b.sent();
                        if (json.code) {
                            // エラー
                            throw new Error(json.code + ": " + json.error);
                        }
                        return [2 /*return*/, json];
                    case 10: return [2 /*return*/, {}];
                }
            });
        });
    };
    NCMBScript.prototype.path = function () {
        return "/2015-09-01/script/" + this.scriptName;
    };
    return NCMBScript;
}());
exports.default = NCMBScript;
