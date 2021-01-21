"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NCMBRelation = /** @class */ (function () {
    function NCMBRelation(className) {
        this.relatedClass = null;
        this.fields = {};
        this.className = null;
        this.className = className;
        switch (className) {
            case 'user':
                this.relatedClass = "/users";
                break;
            case 'role':
                this.relatedClass = "/roles";
                break;
            case 'installation':
                this.relatedClass = "/installations";
                break;
            default:
                this.relatedClass = "/classes/" + className;
        }
    }
    NCMBRelation.prototype.add = function (obj) {
        var _this = this;
        if (!this.fields.objects) {
            this.fields = {
                __op: 'AddRelation',
                objects: []
            };
        }
        if (!Array.isArray(obj)) {
            obj = [obj];
        }
        obj.forEach(function (o) {
            if (o.className !== _this.className) {
                throw new Error('Relation objects can be input just from instance of same class with first input.');
            }
            _this.fields.objects.push(o);
        });
        return this;
    };
    NCMBRelation.prototype.remove = function (obj) {
        var _this = this;
        if (!this.fields.objects) {
            this.fields = {
                __op: 'RemoveRelation',
                objects: []
            };
        }
        if (!Array.isArray(obj)) {
            obj = [obj];
        }
        obj.forEach(function (o) {
            if (o.className !== _this.className) {
                throw new Error('Relation objects can be input just from instance of same class with first input.');
            }
            _this.fields.objects.push(o);
        });
        return this;
    };
    NCMBRelation.prototype.toJSON = function () {
        var json = {
            __op: this.fields.__op,
            objects: []
        };
        for (var _i = 0, _a = this.fields.objects; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj;
            json.objects.push(obj.toPointer());
        }
        return json;
    };
    return NCMBRelation;
}());
exports.default = NCMBRelation;
