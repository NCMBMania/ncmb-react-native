import NCMB, { NCMBUser, NCMBObject, NCMBQuery } from '../index';
import { JsonObject } from '../types/Misc';
declare class NCMBRole extends NCMBObject {
    static ncmb: NCMB;
    users: NCMBUser[];
    roles: NCMBRole[];
    constructor();
    static query(): NCMBQuery;
    addUser(user: NCMBUser): NCMBRole;
    addRole(role: NCMBRole): NCMBRole;
    fetchUser(): Promise<NCMBUser[]>;
    fetchRole(): Promise<NCMBRole[]>;
    fetchRelated(key: string): Promise<NCMBUser[] | NCMBRole[] | NCMBObject[]>;
    getObjects(name: string): NCMBUser[] | NCMBRole[];
    convert(name: string): JsonObject;
    toJSON(): object;
}
export default NCMBRole;
