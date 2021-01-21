import NCMB, { NCMBObject, NCMBRole, NCMBUser } from "../index";
import { NCMBRelationFormat } from "../types/Misc";
declare class NCMBRelation {
    static ncmb: NCMB;
    private relatedClass;
    private fields;
    private className;
    constructor(className: string);
    add(obj: NCMBObject | NCMBRole | NCMBUser | NCMBObject[] | NCMBRole[] | NCMBUser[]): NCMBRelation;
    remove(obj: NCMBObject | NCMBRole | NCMBUser | NCMBObject[] | NCMBRole[] | NCMBUser[]): NCMBRelation;
    toJSON(): NCMBRelationFormat;
}
export default NCMBRelation;
