import { NCMBUser, NCMBRole } from '../index';
import { NCMBAclFormat } from '../types/Misc';
declare class NCMBAcl {
    private fields;
    constructor();
    set(target: string, action: string, bol: boolean): NCMBAcl;
    sets(obj: NCMBAclFormat): NCMBAcl;
    private setsPublicAccess;
    private setsRoleAccess;
    private setsUserAccess;
    setPublicReadAccess(bol: boolean): NCMBAcl;
    setPublicWriteAccess(bol: boolean): NCMBAcl;
    setUserReadAccess(user: NCMBUser, bol: boolean): NCMBAcl;
    setUserWriteAccess(user: NCMBUser, bol: boolean): NCMBAcl;
    setRoleReadAccess(role: NCMBRole, bol: boolean): NCMBAcl;
    setRoleWriteAccess(role: NCMBRole, bol: boolean): NCMBAcl;
    toJSON(): object;
}
export default NCMBAcl;
