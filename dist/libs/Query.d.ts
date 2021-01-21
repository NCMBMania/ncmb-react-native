import NCMB, { NCMBUser, NCMBObject, NCMBRole, NCMBFile, NCMBGeoPoint } from '../';
import { NCMBResponse } from '../types/Misc';
declare class NCMBQuery {
    static ncmb: NCMB;
    _where: {
        [key: string]: any;
    };
    private _limit;
    private _skip;
    private _count;
    private _order;
    private _include;
    private className;
    constructor(name: string);
    equalTo(name: string, value: any): NCMBQuery;
    notEqualTo(name: string, value: any): NCMBQuery;
    greaterThan(name: string, value: any): NCMBQuery;
    greaterThanOrEqualTo(name: string, value: any): NCMBQuery;
    lessThan(name: string, value: any): NCMBQuery;
    lessThanOrEqualTo(name: string, value: any): NCMBQuery;
    in(name: string, value: any): NCMBQuery;
    notIn(name: string, value: any): NCMBQuery;
    exists(name: string): NCMBQuery;
    notExists(name: string): NCMBQuery;
    inArray(name: string, value: any): NCMBQuery;
    notInArray(name: string, value: any): NCMBQuery;
    allInArray(name: string, value: any): NCMBQuery;
    regularExpressionTo(name: string, value: RegExp): NCMBQuery;
    near(name: string, geo: NCMBGeoPoint): NCMBQuery;
    withinKilometers(name: string, geo: NCMBGeoPoint, distance: number): NCMBQuery;
    withinMiles(name: string, geo: NCMBGeoPoint, distance: number): NCMBQuery;
    withinRadians(name: string, geo: NCMBGeoPoint, distance: number): NCMBQuery;
    withinSquare(name: string, southWestGeo: NCMBGeoPoint, northEastGeo: NCMBGeoPoint): NCMBQuery;
    select(name: string, subKey: string, query: NCMBQuery): NCMBQuery;
    inQuery(name: string, query: NCMBQuery): NCMBQuery;
    getClassName(): string;
    getSelectParams(): {
        [s: string]: any;
    };
    or(queries: NCMBQuery[]): NCMBQuery;
    setOperand(name: string, value: any, operand?: string): NCMBQuery;
    limit(value: number): NCMBQuery;
    skip(value: number): NCMBQuery;
    order(name: string, desc?: boolean): NCMBQuery;
    count(): NCMBQuery;
    include(name: string): NCMBQuery;
    relatedTo(obj: NCMBObject | NCMBUser | NCMBRole, key: string): NCMBQuery;
    fetch(): Promise<NCMBObject | NCMBUser | NCMBRole | NCMBFile>;
    fetchWithCount(): Promise<{
        count: number;
        results: NCMBObject[];
    }>;
    fetchAll(): Promise<NCMBObject[] | NCMBUser[] | NCMBRole[] | NCMBFile[]>;
    fetchData(): Promise<{
        json: NCMBResponse;
        ary: NCMBObject[];
    }>;
    path(): string;
}
export default NCMBQuery;
