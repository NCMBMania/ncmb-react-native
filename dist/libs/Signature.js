"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../index"));
var jsSHA = require('jssha');
var Signature = /** @class */ (function () {
    function Signature() {
    }
    Signature.prototype.generate = function (method, path, timestamp, queries) {
        if (timestamp === void 0) { timestamp = new Date(); }
        if (queries === void 0) { queries = {}; }
        var signatureString = this.generateSignatureString(timestamp, queries);
        var ary = [];
        ary.push(method);
        ary.push(index_1.default.fqdn);
        ary.push(path);
        ary.push(signatureString);
        var baseString = ary.join("\n");
        var sha256 = new jsSHA('SHA-256', 'TEXT');
        sha256.setHMACKey(Signature.ncmb.clientKey, 'TEXT');
        sha256.update(baseString);
        return sha256.getHMAC('B64');
    };
    Signature.prototype.generateSignatureString = function (timestamp, queries) {
        var hash = {};
        hash[index_1.default.signatureMethodName] = index_1.default.signatureMethodValue;
        hash[index_1.default.signatureVersionName] = index_1.default.signatureVersionValue;
        hash[index_1.default.timestampKeyName] = timestamp.toISOString();
        hash[index_1.default.applicationKeyName] = Signature.ncmb.applicationKey;
        Object.keys(queries).forEach(function (k) {
            if (typeof queries[k] === 'object') {
                hash[k] = encodeURIComponent(JSON.stringify(queries[k]));
            }
            else {
                hash[k] = encodeURIComponent(queries[k]);
            }
        });
        return Object.keys(hash).sort().map(function (k) { return k + "=" + hash[k]; }).join('&');
    };
    return Signature;
}());
exports.default = Signature;
