import DataStore from './DataStore.ts';

export default (ncmb :NCMB) => {
  class User extends DataStore(ncmb, 'users') {
    public className;
    
    constructor() {
      super();
      this.className = 'user';
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
        Object.keys(json).forEach(key => {
          this.set(key, json[key]);
        });
        return true;
      } catch (e) {
        throw e;
      }
    }
    
    static async login(userName: string, password: string): User {
      const r = ncmb.Request();
      const query = {userName, password}
      try {
        const response: Respose = await r.get(`/${ncmb.version}/login`, query);
        const json: Object = await response.json();
        if (json.code) {
          // エラー
          throw new Error(`${json.code}: ${json.error}`);
        }
        ncmb.sessionToken = json.sessionToken;
        delete json.sessionToken;
        const user = new ncmb.User();
        Object.keys(json).forEach(key => {
          user.set(key, json[key]);
        });
        ncmb.currentUser = user;
        return user;
      } catch (e) {
        throw e;
      }
    }
  }
  return User;
}
