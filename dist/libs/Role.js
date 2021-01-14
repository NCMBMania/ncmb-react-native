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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Object_1 = __importDefault(require("./Object"));
var NCMBRole = /** @class */ (function (_super) {
    __extends(NCMBRole, _super);
    function NCMBRole() {
        var _this = _super.call(this, 'roles') || this;
        _this.className = 'role';
        _this.users = [];
        _this.roles = [];
        return _this;
    }
    NCMBRole.prototype.addUser = function (user) {
        this.users.push(user);
        return this;
    };
    NCMBRole.prototype.convert = function (name) {
        var belongType = "belong" + name;
        var lowerName = name.toLowerCase() + "s";
        var json = {};
        this[lowerName].forEach(function (obj) {
            if (!json[belongType]) {
                json[belongType] = {
                    '__op': 'AddRelation',
                    'objects': []
                };
            }
            json[belongType].objects.push({
                '__type': 'Pointer',
                'className': name.toLowerCase(),
                'objectId': obj.get('objectId')
            });
        });
        return json[belongType];
    };
    NCMBRole.prototype.toJSON = function () {
        var json = _super.prototype.toJSON.call(this);
        if (this.users.length > 0)
            json.belongUser = this.convert('User');
        if (this.roles.length > 0)
            json.belongRole = this.convert('Role');
        return json;
    };
    return NCMBRole;
}(Object_1.default));
exports.default = NCMBRole;
