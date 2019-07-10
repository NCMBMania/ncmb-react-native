export default (ncmb :NCMB, name: string) => {
  class DataStore {
    constructor() {
      this.fields = {};
    }
    
    set(name :string, value :any) :DataStore {
      this.fields[name] = value;
      return this;
    }
    
    get(name :string): any {
      return this.fields[name];
    }
    
    async save() :boolean {
      // 署名を作成
      // POSTでデータ保存
      const r = ncmb.Request();
      r.body = this.fields;
      try {
        const response: Respose = await r.post(this.path());
        if (response === 415) {
          throw new Error('No content-type error')
          return false;
        }
        const json: Object = await response.json();
        if (json.code) {
          // エラー
          throw new Error(`${json.code}: ${json.error}`);
        }
        Object.keys(json).forEach(key => {
          this.set(key, json[key]);
        })
        return true;
      } catch (e) {
        throw e;
      }
    }
    
    path() :string {
      return `/${ncmb.version}/classes/${name}`;
    }
  }
  
  return DataStore;
}