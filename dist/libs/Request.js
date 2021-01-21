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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = __importDefault(require(".."));
var Signature_1 = __importDefault(require("./Signature"));
var CONTENT_TYPE = 'Content-Type';
var ContentType = {
    Json: 'application/json',
    Multi: 'multipart/form-data'
};
var HttpMethod = {
    Get: 'GET',
    Post: 'POST',
    Put: 'PUT',
    Delete: 'DELETE'
};
var NCMBRequest = /** @class */ (function () {
    function NCMBRequest() {
        this.date = null;
    }
    NCMBRequest.prototype.exec = function (method, url, signature, bodies, file) {
        if (bodies === void 0) { bodies = null; }
        if (file === void 0) { file = null; }
        return __awaiter(this, void 0, void 0, function () {
            var body, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = bodies ? JSON.stringify(bodies) : null;
                        headers = this.headers(signature);
                        if (!file) {
                            headers.set(CONTENT_TYPE, ContentType.Json);
                        }
                        if (!body) return [3 /*break*/, 2];
                        return [4 /*yield*/, fetch(url, { method: method, headers: headers, body: body })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!file) return [3 /*break*/, 4];
                        return [4 /*yield*/, fetch(url, { method: method, headers: headers, body: file })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [4 /*yield*/, fetch(url, { method: method, headers: headers })];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NCMBRequest.prototype.headers = function (signature) {
        var headers = new Headers();
        headers.set(__1.default.applicationKeyName, NCMBRequest.ncmb.applicationKey);
        headers.set(__1.default.timestampKeyName, this.date.toISOString());
        headers.set(__1.default.signatureHeaderName, signature);
        if (NCMBRequest.ncmb.sessionToken) {
            headers.set(__1.default.sessionHeaderKeyName, NCMBRequest.ncmb.sessionToken);
        }
        return headers;
    };
    NCMBRequest.prototype.url = function (path, queries) {
        if (queries === void 0) { queries = null; }
        var url = "https://" + __1.default.fqdn + path;
        if (queries == null)
            return url;
        var query = Object.keys(queries).map(function (k) {
            if (typeof queries[k] === 'object') {
                return k + "=" + encodeURIComponent(JSON.stringify(queries[k]));
            }
            else {
                return k + "=" + encodeURIComponent(queries[k]);
            }
        }).join('&');
        return url + "?" + query;
    };
    NCMBRequest.prototype.post = function (path, file) {
        if (file === void 0) { file = null; }
        return __awaiter(this, void 0, void 0, function () {
            var s, method, signature;
            return __generator(this, function (_a) {
                s = new Signature_1.default;
                method = HttpMethod.Post;
                this.date = new Date();
                signature = s.generate(method, path, this.date);
                return [2 /*return*/, this.exec(method, this.url(path), signature, this.body, file)];
            });
        });
    };
    NCMBRequest.prototype.put = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var s, method, signature;
            return __generator(this, function (_a) {
                s = new Signature_1.default;
                method = HttpMethod.Put;
                this.date = new Date();
                signature = s.generate(method, path, this.date);
                return [2 /*return*/, this.exec(method, this.url(path), signature, this.body)];
            });
        });
    };
    NCMBRequest.prototype.get = function (path, queries) {
        return __awaiter(this, void 0, void 0, function () {
            var s, method, filteredQuery, key, signature;
            return __generator(this, function (_a) {
                s = new Signature_1.default;
                method = HttpMethod.Get;
                this.date = new Date();
                filteredQuery = {};
                for (key in queries) {
                    if (queries[key] && queries[key] !== '') {
                        filteredQuery[key] = queries[key];
                    }
                }
                signature = s.generate(method, path, this.date, filteredQuery);
                return [2 /*return*/, this.exec(method, this.url(path, filteredQuery), signature)];
            });
        });
    };
    NCMBRequest.prototype.delete = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var s, method, signature;
            return __generator(this, function (_a) {
                s = new Signature_1.default;
                method = HttpMethod.Delete;
                this.date = new Date();
                signature = s.generate(method, path, this.date);
                return [2 /*return*/, this.exec(method, this.url(path), signature)];
            });
        });
    };
    return NCMBRequest;
}());
exports.default = NCMBRequest;
