"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = __importStar(require("../"));
var GeoPoint_1 = __importDefault(require("./GeoPoint"));
var NCMBObject = /** @class */ (function () {
    function NCMBObject(name) {
        this.fields = {};
        this.className = name;
    }
    NCMBObject.prototype.set = function (name, value) {
        switch (name) {
            case 'createDate':
            case 'updateDate':
                this.fields[name] = new Date(value);
                break;
            case 'acl':
                var acl = new __1.NCMBAcl;
                acl.sets(value);
                this.fields[name] = acl;
                break;
            default:
                this.fields[name] = value;
                break;
        }
        if (value && typeof value === 'object' && value.__type === 'GeoPoint') {
            value = value;
            this.fields[name] = new GeoPoint_1.default(value.latitude, value.longitude);
        }
        if (value && typeof value === 'object' && value.__type === 'Date') {
            this.fields[name] = new Date(value.iso);
        }
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
    NCMBObject.prototype.setIncrement = function (name, value) {
        if (!this.get('objectId')) {
            return this.set(name, value);
        }
        return this.set(name, {
            __op: 'Increment',
            amount: value
        });
    };
    NCMBObject.prototype.add = function (name, value) {
        if (!Array.isArray(value)) {
            value = [value];
        }
        if (!this.get('objectId')) {
            return this.set(name, value);
        }
        return this.set(name, {
            __op: 'Add',
            objects: value
        });
    };
    NCMBObject.prototype.addUnique = function (name, value) {
        if (!Array.isArray(value)) {
            value = [value];
        }
        if (!this.get('objectId')) {
            return this.set(name, value);
        }
        return this.set(name, {
            __op: 'AddUnique',
            objects: value
        });
    };
    NCMBObject.prototype.remove = function (name, value) {
        if (!Array.isArray(value)) {
            value = [value];
        }
        return this.set(name, {
            __op: 'Remove',
            objects: value
        });
    };
    NCMBObject.prototype.fetch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, response, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = new __1.NCMBRequest();
                        return [4 /*yield*/, r.get(this.path(), {})];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = (_a.sent());
                        if (json.code) {
                            // エラー
                            throw new Error(json.code + ": " + json.error);
                        }
                        this.sets(json);
                        return [2 /*return*/, this];
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
                        r = new __1.NCMBRequest;
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
                        return [2 /*return*/, true];
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
            if (_this.fields[key] === null) {
                json[key] = null;
                return;
            }
            switch (_this.fields[key].constructor.name) {
                case 'Number':
                    json[key] = _this.fields[key];
                    break;
                case 'NCMBObject':
                case 'NCMBUser':
                case 'NCMBInstallation':
                case 'NCMBPush':
                    // Pointer
                    var obj = _this.fields[key];
                    json[key] = obj.toPointer();
                    break;
                case 'Date':
                    var date = _this.fields[key];
                    json[key] = {
                        '__type': 'Date',
                        'iso': date.toISOString()
                    };
                    break;
                case 'NCMBGeoPoint':
                    var geo = _this.fields[key];
                    json[key] = geo.toJSON();
                    break;
                case 'NCMBAcl':
                    var acl = _this.fields[key];
                    json[key] = acl.toJSON();
                    break;
                default:
                    var func = _this.fields[key].toJSON;
                    if (typeof func === 'function') {
                        json[key] = func.bind(_this.fields[key])();
                    }
                    else {
                        json[key] = _this.fields[key];
                    }
            }
            ;
        });
        return json;
    };
    NCMBObject.prototype.toPointer = function () {
        return {
            '__type': 'Pointer',
            'className': this.className,
            'objectId': this.get('objectId')
        };
    };
    NCMBObject.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, method, response, json, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = new __1.NCMBRequest;
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
                        json = _a.sent();
                        if (json.code) {
                            // エラー
                            throw new Error(json.code + ": " + json.error);
                        }
                        this.sets(json);
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
        if (['users', 'roles', 'files', 'installations', 'push'].indexOf(this.className) > -1) {
            basePath = "/" + __1.default.version + "/" + this.className;
        }
        else {
            basePath = "/" + __1.default.version + "/classes/" + this.className;
        }
        if (this.fields.objectId) {
            return basePath + "/" + this.fields.objectId;
        }
        else {
            return basePath;
        }
    };
    return NCMBObject;
}());
exports.default = NCMBObject;
