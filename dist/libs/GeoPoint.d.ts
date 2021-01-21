import { NCMBGeoPointFormat } from "../types/Misc";
declare class NCMBGeoPoint {
    latitude: number;
    longitude: number;
    constructor(latitude: number, longitude: number);
    toJSON(): NCMBGeoPointFormat;
}
export default NCMBGeoPoint;
