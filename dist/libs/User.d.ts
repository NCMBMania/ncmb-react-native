import NCMB, { NCMBQuery, NCMBObject } from '../index';
import { authData, NCMBResponse, NCMBBasicLogin } from '../types/Misc';
declare class NCMBUser extends NCMBObject {
    static ncmb: NCMB;
    constructor();
    static query(): NCMBQuery;
    signUpWith(provider: string, authData: authData): Promise<boolean>;
    signUpByAccount(): Promise<boolean>;
    static requestSignUpEmail(mailAddress: string): Promise<boolean>;
    static requestPasswordReset(mailAddress: string): Promise<boolean>;
    static loginAsAnonymous(): Promise<NCMBUser>;
    static path(): string;
    static currentUser(): Promise<NCMBUser | null>;
    static login(userName: string, password: string): Promise<NCMBUser>;
    static loginWithMailAddress(mailAddress: string, password: string): Promise<NCMBUser>;
    static loginWithUserNameOrMailAddress(query: NCMBBasicLogin): Promise<NCMBUser>;
    static setUser(json: NCMBResponse): Promise<NCMBUser>;
    static logout(): Promise<boolean>;
}
export default NCMBUser;
