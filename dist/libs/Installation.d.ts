import NCMB, { NCMBQuery, NCMBObject } from '../index';
declare class NCMBInstallation extends NCMBObject {
    static ncmb: NCMB;
    constructor();
    static query(): NCMBQuery;
    save(): Promise<boolean>;
}
export default NCMBInstallation;
