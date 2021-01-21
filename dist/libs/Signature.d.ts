import NCMB from "..";
export default class Signature {
    static ncmb: NCMB;
    generate(method: string, path: string, timestamp?: Date, queries?: any): string;
    generateSignatureString(timestamp: Date, queries: any): string;
}
