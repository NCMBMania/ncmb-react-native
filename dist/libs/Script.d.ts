import NCMB from "../index";
import { JsonObject } from "../types/Misc";
declare class NCMBScript {
    static ncmb: NCMB;
    private scriptName;
    private method;
    private _headers;
    private _queries;
    private _bodies;
    constructor(scriptName: string, method: string);
    header(name: string, value: string): NCMBScript;
    headers(headers: {
        [s: string]: string;
    }): NCMBScript;
    query(name: string, value: any): NCMBScript;
    queries(queries: {
        [s: string]: any;
    }): NCMBScript;
    body(name: string, value: any): NCMBScript;
    bodies(bodies: {
        [s: string]: any;
    }): NCMBScript;
    execute(): Promise<JsonObject>;
    path(): string;
}
export default NCMBScript;
