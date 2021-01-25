import NCMB from '../index';
declare class NCMBRequest {
    static ncmb: NCMB;
    body: any;
    query: any;
    date: Date | null;
    addHeaders: {
        [s: string]: string;
    };
    script: boolean;
    constructor();
    exec(method: string, url: string, signature: string, bodies?: any, file?: any): Promise<Response>;
    headers(signature: string): Headers;
    url(path: string, queries?: any): string;
    post(path: string, file?: any): Promise<Response>;
    put(path: string): Promise<Response>;
    queries(queries: any): {
        [key: string]: string;
    };
    get(path: string, queries?: any): Promise<Response>;
    delete(path: string): Promise<Response>;
}
export default NCMBRequest;
