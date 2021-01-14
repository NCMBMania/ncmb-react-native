import NCMBObject from './Object.ts';
import uuid from 'uuid/v4';
import NCMB from 'ncmb-react-native';

interface dataFormat {
  __type: string,
  iso: string
}
interface authData {
  id: string,
  access_token: string,
  expires: number,
  expiration_date: dateFormat
}

class NCMBUser extends NCMBObject {
  static ncmb: NCMB;
  public className;
  
  constructor() {
    super('users');
    this.className = 'user';
  }
  
  async signUpWith(provider: string, authData: authData): boolean {
    const expireDate = new Date(authData.expires + (new Date()).getTime()).toJSON();
    authData.expiration_date = {
      __type: 'Date',
      iso: expireDate
    };
    delete authData.expires;
    this.fields = { authData: {}};
    this.fields.authData[provider] = authData;
    return await this.signUpByAccount();
  }
  
  async signUpByAccount(): boolean {
    const r = ncmb.Request();
    r.body = this.fields;
    try {
      const response: Respose = await r.post(this.path());
      const json: Object = await response.json();
      if (json.code) {
        // エラー
        throw new Error(`${json.code}: ${json.error}`);
      }
      ncmb.sessionToken = json.sessionToken;
      delete json.sessionToken;
      this.sets(json);
      return true;
    } catch (e) {
      throw e;
    }
  }
  
  static async loginAsAnonymous(): User {
    const r = ncmb.Request();
    r.body = {
      authData: {
        anonymous: {
          id: uuid()
        }
      }
    };
    try {
      const response: Respose = await r.post(this.path());
      const json: Object = await response.json();
      return await this.setUser(json);
    } catch (e) {
      throw e;
    }
  }
  
  static async currentUser(): User {
    if (ncmb.currentUser) return ncmb.currentUser;
    if (!ncmb.storage) return null;
    const string: string = await ncmb.storage.getItem('currentUser');
    if (string === null) {
      return null;
    }
    const json: Object = JSON.parse(string);
    return await this.setUser(json);
  }
  
  static async login(userName: string, password: string): User {
    const r = ncmb.Request();
    const query = {userName, password}
    try {
      const response: Respose = await r.get(`/${ncmb.version}/login`, query);
      const json: Object = await response.json();
      return await this.setUser(json);
    } catch (e) {
      throw e;
    }
  }
  
  static async setUser(json) {
    if (json.code) {
      // エラー
      throw new Error(`${json.code}: ${json.error}`);
    }
    ncmb.sessionToken = json.sessionToken;
    if (ncmb.storage) {
      await ncmb.storage.setItem('currentUser', JSON.stringify(json));
    }
    delete json.sessionToken;
    const user = new ncmb.User();
    user.sets(json)
    ncmb.currentUser = user;
    return user;
  }
  
  static async logout(): Promise<boolean> {
    return await ncmb.storage.removeItem('currentUser');
  }
}
export default NCMBUser;
