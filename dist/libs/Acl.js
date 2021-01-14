"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NCMBAcl = /** @class */ (function () {
    function NCMBAcl() {
        this.fields = {};
    }
    NCMBAcl.default = function () {
        var acl = new NCMBAcl();
        return acl
            .setPublicReadAccess(true)
            .setPublicWriteAccess(true);
    };
    NCMBAcl.prototype.set = function (target, action, bol) {
        if (!this.fields[target])
            this.fields[target] = {};
        this.fields[target][action] = bol;
        return this;
    };
    NCMBAcl.prototype.setPublicReadAccess = function (bol) {
        return this.set('*', 'read', bol);
    };
    NCMBAcl.prototype.setPublicWriteAccess = function (bol) {
        return this.set('*', 'write', bol);
    };
    NCMBAcl.prototype.setUserReadAccess = function (user, bol) {
        return this.set(user.get('objectId'), 'read', bol);
    };
    NCMBAcl.prototype.setUserWriteAccess = function (user, bol) {
        return this.set(user.get('objectId'), 'write', bol);
    };
    NCMBAcl.prototype.setRoleReadAccess = function (role, bol) {
        return this.set(role.get('roleName'), 'read', bol);
    };
    NCMBAcl.prototype.setRoleWriteAccess = function (role, bol) {
        return this.set(role.get('roleName'), 'write', bol);
    };
    NCMBAcl.prototype.toJSON = function () {
        var json = {};
        for (var target in this.fields) {
            var targetJSON = {};
            if (this.fields[target].read)
                targetJSON.read = true;
            if (this.fields[target].write)
                targetJSON.write = true;
            json[target] = targetJSON;
        }
        return json;
    };
    return NCMBAcl;
}());
exports.default = NCMBAcl;
