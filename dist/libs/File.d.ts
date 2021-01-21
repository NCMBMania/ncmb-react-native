/// <reference types="node" />
import NCMB, { NCMBQuery, NCMBObject, NCMBAcl } from '..';
import { expoMediaFormat } from '../types/Misc';
declare class NCMBFile extends NCMBObject {
    static ncmb: NCMB;
    constructor();
    static query(): NCMBQuery;
    static upload(fileName: string, fileData: string | expoMediaFormat | Buffer, contentType?: string | null, acl?: NCMBAcl): Promise<NCMBFile>;
    download(binary?: boolean): Promise<any>;
    static path(fileName: string): string;
    path(): string;
}
export default NCMBFile;
