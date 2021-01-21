import NCMB, { NCMBQuery, NCMBObject } from '../';
import { allowType } from '../types/Misc';
declare class NCMBPush extends NCMBObject {
    static ncmb: NCMB;
    constructor();
    static query(): NCMBQuery;
    set(name: string, value: allowType): NCMBPush;
    save(): Promise<boolean>;
    static open(deviceType: string, deviceToken: string, id: string): Promise<boolean>;
}
export default NCMBPush;
