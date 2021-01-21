import NCMB, { NCMBQuery, NCMBObject } from '../';
declare class NCMBInstallation extends NCMBObject {
    static ncmb: NCMB;
    constructor();
    static query(): NCMBQuery;
    save(): Promise<boolean>;
}
export default NCMBInstallation;
