import NCMB, { NCMBQuery, NCMBObject, NCMBRequest } from '../';
import { v4 as uuidv4 } from 'uuid';
import { authData, NCMBResponse } from '../types/Misc';
import { NCMBBasicLogin } from '../types/Misc';

class NCMBUser extends NCMBObject {
  static ncmb: NCMB;
  constructor() {
    super('users');
  }
  
  static query(): NCMBQuery {
    return new NCMBQuery('users');
  }

  async signUpWith(provider: string, authData: authData): Promise<boolean> {
    const expireDate = new Date(authData.expires! + (new Date()).getTime()).toJSON();
    authData.expiration_date = {
      __type: 'Date',
      iso: expireDate
    };
    delete authData.expires;
    this.fields = { authData: {}};
    this.fields.authData[provider] = authData;
    return await this.signUpByAccount();
  }
  
  async signUpByAccount(): Promise<boolean> {
    const r = new NCMBRequest();
    r.body = this.fields;
    try {
      const response = await r.post(this.path());
      const json = (await response.json()) as NCMBResponse;
      if (json.code) {
        // エラー
        throw new Error(`${json.code}: ${json.error}`);
      }
      NCMBUser.ncmb.sessionToken = json.sessionToken!;
      delete json.sessionToken;
      this.sets(json);
      return true;
    } catch (e) {
      throw e;
    }
  }

  static async requestSignUpEmail(mailAddress: string): Promise<boolean> {
    const r = new NCMBRequest;
    r.body = { mailAddress }
    const response = await r.post(`/${NCMB.version}/requestMailAddressUserEntry`);
    const json = (await response.json()) as NCMBResponse;
    if (json.code) {
      // エラー
      throw new Error(`${json.code}: ${json.error}`);
    }
    return !!json.createDate;
  }

  static async requestPasswordReset(mailAddress: string): Promise<boolean> {
    const r = new NCMBRequest;
    r.body = { mailAddress }
    const response = await r.post(`/${NCMB.version}/requestPasswordReset`);
    const json = (await response.json()) as NCMBResponse;
    if (json.code) {
      // エラー
      throw new Error(`${json.code}: ${json.error}`);
    }
    return !!json.createDate;
  }
  
  static async loginAsAnonymous(): Promise<NCMBUser> {
    const r = new NCMBRequest();
    r.body = {
      authData: {
        anonymous: {
          id: uuidv4()
        }
      }
    };
    try {
      const response = await r.post(NCMBUser.path());
      const json = (await response.json()) as NCMBResponse;
      return await this.setUser(json);
    } catch (e) {
      throw e;
    }
  }

  static path() {
    return `/${NCMB.version}/users`;
  }
  
  static async currentUser(): Promise<NCMBUser | null> {
    const { ncmb } = NCMBUser;
    if (ncmb.currentUser) return ncmb.currentUser;
    if (!ncmb.storage) return null;
    const str = await ncmb.storage.getItem('currentUser');
    if (str === null) {
      return null;
    }
    const json: NCMBResponse = JSON.parse(str);
    return await NCMBUser.setUser(json);
  }
  
  static async login(userName: string, password: string): Promise<NCMBUser> {
    const query = {userName, password};
    return NCMBUser.loginWithUserNameOrMailAddress(query);
  }

  static async loginWithMailAddress(mailAddress: string, password: string): Promise<NCMBUser> {
    const query = {mailAddress, password};
    return NCMBUser.loginWithUserNameOrMailAddress(query);
  }

  static async loginWithUserNameOrMailAddress(query: NCMBBasicLogin): Promise<NCMBUser> {
    const r = new NCMBRequest;
    const response = await r.get(`/${NCMB.version}/login`, query);
    const json = (await response.json()) as NCMBResponse;
    return await NCMBUser.setUser(json);
  }
  
  static async setUser(json: NCMBResponse): Promise<NCMBUser> {
    if (json.code) {
      // エラー
      throw new Error(`${json.code}: ${json.error}`);
    }
    NCMBUser.ncmb.sessionToken = json.sessionToken!;
    if (NCMBUser.ncmb.storage) {
      await NCMBUser.ncmb.storage.setItem('currentUser', JSON.stringify(json));
    }
    delete json.sessionToken;
    const user = new NCMBUser();
    user.sets(json)
    NCMBUser.ncmb.currentUser = user;
    return user;
  }
  
  static async logout(): Promise<boolean> {
    NCMBUser.ncmb.sessionToken = null;
    if (NCMBUser.ncmb.storage) {
      await NCMBUser.ncmb.storage.removeItem('currentUser');
    }
    return true;
  }
}
export default NCMBUser;
