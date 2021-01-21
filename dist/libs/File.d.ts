/// <reference types="node" />
import NCMB, { NCMBQuery, NCMBObject, NCMBAcl } from '../index';
import { expoMediaFormat } from '../types/Misc';
declare class NCMBFile extends NCMBObject {
    static ncmb: NCMB;
    constructor();
    static query(): NCMBQuery;
    static upload(fileName: string, fileData: string | expoMediaFormat | Buffer, acl?: NCMBAcl, contentType?: string | null): Promise<NCMBFile>;
    download(binary?: boolean): Promise<any>;
    static path(fileName: string): string;
    path(): string;
}
export default NCMBFile;
