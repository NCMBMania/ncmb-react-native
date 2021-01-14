"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Object_1 = __importDefault(require("./libs/Object"));
var Query_1 = __importDefault(require("./libs/Query"));
var Signature_1 = __importDefault(require("./libs/Signature"));
var Request_1 = __importDefault(require("./libs/Request"));
var User_1 = __importDefault(require("./libs/User"));
var Role_1 = __importDefault(require("./libs/Role"));
var File_1 = __importDefault(require("./libs/File"));
var NCMB = /** @class */ (function () {
    function NCMB(applicationKey, clientKey) {
        this.applicationKey = applicationKey;
        this.clientKey = clientKey;
        this.fqdn = 'mbaas.api.nifcloud.com';
        this.version = '2013-09-01';
        this.applicationKeyName = 'X-NCMB-Application-Key';
        this.signatureHeaderName = 'X-NCMB-Signature';
        this.signatureMethodName = 'SignatureMethod';
        this.signatureMethodValue = 'HmacSHA256';
        this.signatureVersionName = 'SignatureVersion';
        this.signatureVersionValue = '2';
        this.timestampKeyName = 'X-NCMB-Timestamp';
        this.sessionToken = null;
        this.currentUser = null;
        User_1.default.ncmb = this;
        Object_1.default.ncmb = this;
        Query_1.default.ncmb = this;
        File_1.default.ncmb = this;
        Role_1.default.ncmb = this;
    }
    NCMB.prototype.Request = function (method, path) {
        return new Request_1.default(this);
    };
    NCMB.prototype.Signature = function () {
        return new Signature_1.default(this);
    };
    return NCMB;
}());
exports.default = NCMB;
