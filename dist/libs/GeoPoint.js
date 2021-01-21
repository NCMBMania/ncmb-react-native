"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NCMBGeoPoint = /** @class */ (function () {
    function NCMBGeoPoint(latitude, longitude) {
        this.latitude = 0;
        this.longitude = 0;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    NCMBGeoPoint.prototype.toJSON = function () {
        return {
            __type: 'GeoPoint',
            latitude: this.latitude,
            longitude: this.longitude
        };
    };
    return NCMBGeoPoint;
}());
exports.default = NCMBGeoPoint;
