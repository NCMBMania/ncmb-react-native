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
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = __importStar(require("../"));
var NCMBQuery = /** @class */ (function () {
    function NCMBQuery(name) {
        this._where = {};
        this._limit = null;
        this._skip = null;
        this._count = '';
        this._order = null;
        this._include = '';
        this.className = name;
    }
    NCMBQuery.prototype.equalTo = function (name, value) {
        return this.setOperand(name, value);
    };
    NCMBQuery.prototype.notEqualTo = function (name, value) {
        return this.setOperand(name, value, '$ne');
    };
    NCMBQuery.prototype.greaterThan = function (name, value) {
        return this.setOperand(name, value, '$gt');
    };
    NCMBQuery.prototype.greaterThanOrEqualTo = function (name, value) {
        return this.setOperand(name, value, '$gte');
    };
    NCMBQuery.prototype.lessThan = function (name, value) {
        return this.setOperand(name, value, '$lt');
    };
    NCMBQuery.prototype.lessThanOrEqualTo = function (name, value) {
        return this.setOperand(name, value, '$lte');
    };
    NCMBQuery.prototype.in = function (name, value) {
        return this.setOperand(name, value, '$in');
    };
    NCMBQuery.prototype.notIn = function (name, value) {
        return this.setOperand(name, value, '$nin');
    };
    NCMBQuery.prototype.exists = function (name) {
        return this.setOperand(name, true, '$exists');
    };
    NCMBQuery.prototype.notExists = function (name) {
        return this.setOperand(name, false, '$exists');
    };
    NCMBQuery.prototype.inArray = function (name, value) {
        return this.setOperand(name, value, '$inArray');
    };
    NCMBQuery.prototype.notInArray = function (name, value) {
        return this.setOperand(name, value, '$ninArray');
    };
    NCMBQuery.prototype.allInArray = function (name, value) {
        return this.setOperand(name, value, '$all');
    };
    NCMBQuery.prototype.regularExpressionTo = function (name, value) {
        return this.setOperand(name, value.toString().slice(1, -1), '$regex');
    };
    NCMBQuery.prototype.near = function (name, geo) {
        return this.setOperand(name, geo.toJSON(), '$nearSphere');
    };
    NCMBQuery.prototype.withinKilometers = function (name, geo, distance) {
        this.setOperand(name, geo.toJSON(), '$nearSphere');
        this._where[name]['$maxDistanceInKilometers'] = distance;
        return this;
    };
    NCMBQuery.prototype.withinMiles = function (name, geo, distance) {
        this.setOperand(name, geo.toJSON(), '$nearSphere');
        this._where[name]['$maxDistanceInMiles'] = distance;
        return this;
    };
    NCMBQuery.prototype.withinRadians = function (name, geo, distance) {
        this.setOperand(name, geo.toJSON(), '$nearSphere');
        this._where[name]['$maxDistanceInRadians'] = distance;
        return this;
    };
    NCMBQuery.prototype.withinSquare = function (name, southWestGeo, northEastGeo) {
        var box = {
            '$box': [southWestGeo.toJSON(), northEastGeo.toJSON()]
        };
        return this.setOperand(name, box, '$within');
    };
    NCMBQuery.prototype.select = function (name, subKey, query) {
        var className = query.getClassName();
        if (!this._where[name])
            this._where[name] = {};
        this._where[name]["$select"] = {
            query: query.getSelectParams(),
            key: subKey
        };
        return this;
    };
    NCMBQuery.prototype.inQuery = function (name, query) {
        var className = query.getClassName();
        if (!this._where[name])
            this._where[name] = {};
        this._where[name]["$inQuery"] = query.getSelectParams();
        return this;
    };
    NCMBQuery.prototype.getClassName = function () {
        switch (this.className) {
            case 'users':
                return 'user';
            case 'roles':
                return 'role';
            case 'installations':
                return 'installation';
            case 'files':
                return 'file';
            default:
                return this.className;
        }
    };
    NCMBQuery.prototype.getSelectParams = function () {
        var params = {
            className: this.className,
            where: this._where
        };
        if (this._skip && this._skip > 0)
            params.skip = this._skip;
        if (this._limit && this._limit > 0)
            params.limit = this._limit;
        return params;
    };
    NCMBQuery.prototype.or = function (queries) {
        if (!Array.isArray(this._where['$or'])) {
            this._where['$or'] = [];
        }
        for (var _i = 0, queries_1 = queries; _i < queries_1.length; _i++) {
            var query = queries_1[_i];
            this._where['$or'].push(query._where);
        }
        return this;
    };
    NCMBQuery.prototype.setOperand = function (name, value, operand) {
        var condition = this._where[name];
        if (!condition)
            condition = {};
        if (value) {
            switch (value.constructor.name) {
                case 'DataStore':
                case 'User':
                    value = {
                        '__type': 'Pointer',
                        'className': value.className,
                        'objectId': value.get('objectId')
                    };
            }
        }
        if (!operand) {
            this._where[name] = value;
        }
        else {
            condition[operand] = value;
            this._where[name] = condition;
        }
        return this;
    };
    NCMBQuery.prototype.limit = function (value) {
        this._limit = value;
        return this;
    };
    NCMBQuery.prototype.skip = function (value) {
        this._skip = value;
        return this;
    };
    NCMBQuery.prototype.order = function (name, desc) {
        if (desc === void 0) { desc = false; }
        if (desc) {
            this._order = "-" + name;
        }
        else {
            this._order = name;
        }
        return this;
    };
    NCMBQuery.prototype.count = function () {
        this._count = '1';
        return this;
    };
    NCMBQuery.prototype.include = function (name) {
        this._include = name;
        return this;
    };
    NCMBQuery.prototype.relatedTo = function (obj, key) {
        var className;
        if (obj instanceof __1.NCMBUser) {
            className = 'user';
        }
        else if (obj instanceof __1.NCMBRole) {
            className = 'role';
        }
        else {
            className = obj.className;
        }
        this._where['$relatedTo'] = {
            object: {
                __type: 'Pointer',
                className: className,
                objectId: obj.get('objectId')
            },
            key: key
        };
        return this;
    };
    NCMBQuery.prototype.fetch = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._limit = 1;
                        return [4 /*yield*/, this.fetchAll()];
                    case 1: return [2 /*return*/, (_a.sent())[0]];
                }
            });
        });
    };
    NCMBQuery.prototype.fetchWithCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, json, ary;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._count = '1';
                        return [4 /*yield*/, this.fetchData()];
                    case 1:
                        _a = _b.sent(), json = _a.json, ary = _a.ary;
                        return [2 /*return*/, { count: json.count, results: ary }];
                }
            });
        });
    };
    NCMBQuery.prototype.fetchAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchData()];
                    case 1:
                        ary = (_a.sent()).ary;
                        return [2 /*return*/, ary];
                }
            });
        });
    };
    NCMBQuery.prototype.fetchData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, response, json, ary, _loop_1, this_1, _i, _a, params, e_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        r = new __1.NCMBRequest();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, r.get(this.path(), {
                                where: this._where,
                                skip: this._skip,
                                limit: this._limit,
                                order: this._order,
                                include: this._include,
                                count: this._count
                            })];
                    case 2:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        json = (_b.sent());
                        if (json.code) {
                            // エラー
                            throw new Error(json.code + ": " + json.error);
                        }
                        ary = [];
                        _loop_1 = function (params) {
                            var obj;
                            if (this_1.className === 'users') {
                                obj = new __1.NCMBUser;
                            }
                            else if (this_1.className === 'roles') {
                                obj = new __1.NCMBRole;
                            }
                            else if (this_1.className === 'files') {
                                obj = new __1.NCMBFile;
                            }
                            else if (this_1.className === 'push') {
                                obj = new __1.NCMBPush;
                            }
                            else {
                                obj = new __1.NCMBObject(this_1.className);
                            }
                            Object.keys(params).forEach(function (key) {
                                if (_this._include && key === _this._include) {
                                    var pointer = params[key];
                                    var child = new __1.NCMBObject(pointer.className);
                                    delete pointer.className;
                                    delete params[pointer.__type];
                                    child.sets(pointer);
                                    obj.set(key, child);
                                }
                                else {
                                    obj.set(key, params[key]);
                                }
                            });
                            ary.push(obj);
                        };
                        this_1 = this;
                        for (_i = 0, _a = json.results; _i < _a.length; _i++) {
                            params = _a[_i];
                            _loop_1(params);
                        }
                        return [2 /*return*/, { json: json, ary: ary }];
                    case 4:
                        e_1 = _b.sent();
                        throw e_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NCMBQuery.prototype.path = function () {
        var basePath = '';
        if (['users', 'roles', 'installations', 'files', 'push'].indexOf(this.className) > -1) {
            basePath = "/" + __1.default.version + "/" + this.className;
        }
        else {
            basePath = "/" + __1.default.version + "/classes/" + this.className;
        }
        return basePath;
    };
    return NCMBQuery;
}());
exports.default = NCMBQuery;
