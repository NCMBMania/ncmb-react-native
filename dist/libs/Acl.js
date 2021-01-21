"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var NCMBAcl = /** @class */ (function () {
    function NCMBAcl() {
        this.fields = {};
    }
    NCMBAcl.prototype.set = function (target, action, bol) {
        if (typeof target !== 'string')
            throw new Error('target has to be string');
        if (!this.fields[target])
            this.fields[target] = {};
        this.fields[target][action] = bol;
        return this;
    };
    NCMBAcl.prototype.sets = function (obj) {
        for (var key in obj) {
            if (key === '*') {
                this.setsPublicAccess(key, obj[key]);
                continue;
            }
            var m = key.match(/^role:(.*?)$/);
            if (m) {
                this.setsRoleAccess(m[1], obj[key]);
                continue;
            }
            this.setsUserAccess(key, obj[key]);
        }
        return this;
    };
    NCMBAcl.prototype.setsPublicAccess = function (key, access) {
        if (access.read)
            this.setPublicReadAccess(true);
        if (access.write)
            this.setPublicWriteAccess(true);
        return this;
    };
    NCMBAcl.prototype.setsRoleAccess = function (roleName, access) {
        var role = new __1.NCMBRole();
        role.set('roleName', roleName);
        if (access.read)
            this.setRoleReadAccess(role, true);
        if (access.write)
            this.setRoleReadAccess(role, true);
        return this;
    };
    NCMBAcl.prototype.setsUserAccess = function (key, access) {
        var user = new __1.NCMBUser;
        user.set('objectId', key);
        if (access.read)
            this.setUserReadAccess(user, true);
        if (access.write)
            this.setUserWriteAccess(user, true);
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
        if (Object.keys(this.fields).length === 0) {
            this.setPublicReadAccess(true);
            this.setPublicWriteAccess(true);
        }
        for (var target in this.fields) {
            var targetJSON = {};
            if (this.fields[target].read)
                targetJSON.read = true;
            if (this.fields[target].write)
                targetJSON.write = true;
            if (Object.keys(targetJSON).length > 0) {
                json[target] = targetJSON;
            }
        }
        return json;
    };
    return NCMBAcl;
}());
exports.default = NCMBAcl;
