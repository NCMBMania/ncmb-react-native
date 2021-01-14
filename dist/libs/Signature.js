"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsSHA = require('jssha');
var Signature = /** @class */ (function () {
    function Signature(ncmb) {
        this.ncmb = ncmb;
    }
    Signature.prototype.generate = function (method, path, timestamp, queries) {
        if (timestamp === void 0) { timestamp = new Date(); }
        if (queries === void 0) { queries = {}; }
        var signatureString = this.generateSignatureString(timestamp, queries);
        var ary = [];
        ary.push(method);
        ary.push(this.ncmb.fqdn);
        ary.push(path);
        ary.push(signatureString);
        var baseString = ary.join("\n");
        var sha256 = new jsSHA('SHA-256', 'TEXT');
        sha256.setHMACKey(this.ncmb.clientKey, 'TEXT');
        sha256.update(baseString);
        return sha256.getHMAC('B64');
    };
    Signature.prototype.generateSignatureString = function (timestamp, queries) {
        var hash = {};
        hash[this.ncmb.signatureMethodName] = this.ncmb.signatureMethodValue;
        hash[this.ncmb.signatureVersionName] = this.ncmb.signatureVersionValue;
        hash[this.ncmb.timestampKeyName] = timestamp.toISOString();
        hash[this.ncmb.applicationKeyName] = this.ncmb.applicationKey;
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
