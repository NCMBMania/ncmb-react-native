import NCMB, { NCMBUser, NCMBRole, NCMBFile, NCMBInstallation, NCMBPush } from '../index';
import { JsonObject, allowType } from '../types/Misc';
declare class NCMBObject {
    static ncmb: NCMB;
    className: string;
    fields: JsonObject;
    constructor(name: string);
    set(name: string, value: allowType): NCMBObject | NCMBUser | NCMBRole | NCMBFile | NCMBInstallation | NCMBPush;
    sets(json: JsonObject): NCMBObject | NCMBUser | NCMBRole | NCMBFile | NCMBInstallation | NCMBPush;
    get(name: string): allowType;
    setIncrement(name: string, value: number): NCMBObject | NCMBUser | NCMBInstallation | NCMBPush;
    add(name: string, value: any): NCMBObject | NCMBUser | NCMBInstallation | NCMBPush;
    addUnique(name: string, value: any): NCMBObject | NCMBUser | NCMBInstallation | NCMBPush;
    remove(name: string, value: any): NCMBObject | NCMBUser | NCMBInstallation | NCMBPush;
    fetch(): Promise<NCMBObject | NCMBUser | NCMBRole | NCMBFile | NCMBInstallation | NCMBPush>;
    delete(): Promise<boolean>;
    toJSON(): JsonObject;
    toPointer(): JsonObject;
    save(): Promise<boolean>;
    path(): string;
}
export default NCMBObject;
