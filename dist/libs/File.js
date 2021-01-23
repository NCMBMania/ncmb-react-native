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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importStar(require("../index"));
var form_data_1 = __importDefault(require("form-data"));
var NCMBFile = /** @class */ (function (_super) {
    __extends(NCMBFile, _super);
    function NCMBFile() {
        return _super.call(this, 'files') || this;
    }
    NCMBFile.query = function () {
        return new index_1.NCMBQuery('files');
    };
    NCMBFile.upload = function (fileName, fileData, acl, contentType) {
        return __awaiter(this, void 0, void 0, function () {
            var r, form, file_1, blob, response, json, file, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        r = new index_1.NCMBRequest;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 11]);
                        form = new form_data_1.default();
                        if (!(fileData instanceof Buffer)) return [3 /*break*/, 2];
                        contentType = contentType || 'application/octet-stream';
                        form.append('file', fileData, { contentType: contentType });
                        return [3 /*break*/, 7];
                    case 2:
                        if (!(typeof fileData === 'object' && fileData.uri.match(/^file:\/\//))) return [3 /*break*/, 3];
                        form.append('file', fileData);
                        return [3 /*break*/, 7];
                    case 3:
                        if (!(typeof fileData === 'object' && fileData.uri.match(/^data:/))) return [3 /*break*/, 6];
                        return [4 /*yield*/, fetch(fileData.uri)];
                    case 4:
                        file_1 = _a.sent();
                        return [4 /*yield*/, file_1.blob()];
                    case 5:
                        blob = _a.sent();
                        form.append('file', blob);
                        return [3 /*break*/, 7];
                    case 6:
                        form.append('file', fileData);
                        _a.label = 7;
                    case 7:
                        form.append('acl', JSON.stringify((acl || new index_1.NCMBAcl).toJSON()));
                        return [4 /*yield*/, r.post(NCMBFile.path(fileName), form)];
                    case 8:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 9:
                        json = _a.sent();
                        if (json.code) {
                            // エラー
                            throw new Error(json.code + ": " + json.error);
                        }
                        file = new NCMBFile;
                        return [2 /*return*/, file.sets(json)];
                    case 10:
                        e_1 = _a.sent();
                        throw e_1;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    NCMBFile.prototype.download = function (fileType) {
        if (fileType === void 0) { fileType = 'text'; }
        return __awaiter(this, void 0, void 0, function () {
            var r, response, json, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        r = new index_1.NCMBRequest;
                        return [4 /*yield*/, r.get(this.path())];
                    case 1:
                        response = _c.sent();
                        if (!(response.status > 400)) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _c.sent();
                        if (json.code) {
                            // エラー
                            throw new Error(json.code + ": " + json.error);
                        }
                        else {
                            throw new Error("Server error " + response.status);
                        }
                        _c.label = 3;
                    case 3:
                        _a = fileType.toUpperCase();
                        switch (_a) {
                            case 'TEXT': return [3 /*break*/, 4];
                            case 'BINARY': return [3 /*break*/, 6];
                            case 'DATAURL': return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 11];
                    case 4: return [4 /*yield*/, response.text()];
                    case 5: return [2 /*return*/, _c.sent()];
                    case 6: return [4 /*yield*/, response.blob()];
                    case 7: return [2 /*return*/, _c.sent()];
                    case 8:
                        _b = this.getDataUri;
                        return [4 /*yield*/, response.blob()];
                    case 9: return [4 /*yield*/, _b.apply(this, [_c.sent()])];
                    case 10: return [2 /*return*/, _c.sent()];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    NCMBFile.prototype.getDataUri = function (blob) {
        return new Promise(function (res, _) {
            var reader = new FileReader();
            reader.onloadend = function () {
                res(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    };
    NCMBFile.path = function (fileName) {
        return "/" + index_1.default.version + "/files/" + fileName;
    };
    NCMBFile.prototype.path = function () {
        return "/" + index_1.default.version + "/files/" + this.get('fileName');
    };
    return NCMBFile;
}(index_1.NCMBObject));
exports.default = NCMBFile;
