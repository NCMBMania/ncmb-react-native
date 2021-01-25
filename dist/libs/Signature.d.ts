import NCMB from "../index";
export default class Signature {
    static ncmb: NCMB;
    script: boolean;
    generate(method: string, path: string, timestamp?: Date, queries?: any): string;
    generateSignatureString(timestamp: Date, queries: any): string;
}
