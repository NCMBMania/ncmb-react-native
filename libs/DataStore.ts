export default (ncmb :NCMB, name: string) => {
  const where = {};
  let limit: number = 10;
  let offset: number = 0;
  let order: string = 'createDate';
  let include: string = '';
  
  class DataStore {
    constructor() {
      this.fields = {};
      this.className = name;
    }
    
    set(name :string, value :any) :DataStore {
      this.fields[name] = value;
      return this;
    }
    
    sets(json: Object) :DataStore {
      Object.keys(json).forEach(key => {
        this.set(key, json[key]);
      });
      return this;
    }
    
    get(name :string): any {
      return this.fields[name];
    }
    
    static equalTo(name: string, value: any): DataStore {
      return this.setOperand(name, value);
    }
    
    static notEqualTo(name: string, value: any): DataStore {
      return this.setOperand(name, value, '$ne');
    }
    static greaterThan(name: string, value: any): DataStore {
      return this.setOperand(name, value, '$gt');
    }
    static greaterThanOrEqualTo(name: string, value: any): DataStore {
      return this.setOperand(name, value, '$gte');
    }
    static lessThan(name: string, value: any): DataStore {
      return this.setOperand(name, value, '$lt');
    }
    static lessThanOrEqualTo(name: string, value: any): DataStore {
      return this.setOperand(name, value, '$lte');
    }
    static in(name: string, value: any): DataStore {
      return this.setOperand(name, value, '$in');
    }
    static notIn(name: string, value: any): DataStore {
      return this.setOperand(name, value, '$nin');
    }
    static exists(name: string): DataStore {
      return this.setOperand(name, true, '$exists');
    }
    static notExists(name: string): DataStore {
      return this.setOperand(name, false, '$exists');
    }
    static inArray(name: string, value: any): DataStore {
      return this.setOperand(name, value, '$inArray');
    }
    static notInArray(name: string, value: any): DataStore {
      return this.setOperand(name, value, '$ninArray');
    }
    static allInArray(name: string, value: any): DataStore {
      return this.setOperand(name, value, '$all');
    }
    
    static setOperand(name: string, value: any, operand): DataStore {
      let condition = where[name];
      if (!condition) condition = {};
      if (value) {
        switch (value.constructor.name) {
        case 'DataStore':
        case 'User':
          value = {
            '__type': 'Pointer',
            'className': value.className,
            'objectId': value.get('objectId')
          }
        }
      }
      if (!operand) {
        where[name] = value;
      } else {
        condition[operand] = value;
        where[name] = condition;
      }
      return this;
    }
    
    static limit(value: number): DataStore {
      limit = value;
      return this;
    }
    
    static skip(value: number): DataStore {
      offset = value;
      return this;
    }
    
    static order(name: string, desc: boolean = false): DataStore {
      if (desc) {
        order = `-${name}`;
      } else {
        order = name
      }
      return this;
    }
    
    static include(name: String): DataStore {
      include = name;
      return this;
    }
    
    static async fetch(): DataStore {
      limit = 1;
      return (await this.fetchAll())[0];
    }
    
    static async fetchAll(): [DataStore] {
      const r = ncmb.Request();
      try {
        const response: Respose = await r.get(this.path(), {where, offset, limit, order, include});
        const json: Object = await response.json();
        if (json.code) {
          // エラー
          throw new Error(`${json.code}: ${json.error}`);
        }
        const ary: [DataStore] = [];
        for (let params of json.results) {
          const obj: DataStore = new this;
          Object.keys(params).forEach(key => {
            if (include && key === include) {
              const Obj = ncmb.DataStore(params[key].className);
              const child = new Obj;
              delete params[key].className;
              delete params[key.__type];
              child.sets(params[key]);
              obj.set(key, child);
            } else {
              obj.set(key, params[key]);
            }
          });
          ary.push(obj);
        }
        return ary;
      } catch (e) {
        throw e;
      }
    }
    
    async delete() :boolean {
      const r = ncmb.Request();
      r.body = this.fields;
      try {
        const response: Respose = await r.delete(this.path());
        const body: string = await response.text();
        if (body == '') return true;
        const json: Object = JSON.parse(body);
        if (json.code) {
          // エラー
          throw new Error(`${json.code}: ${json.error}`);
        }
        return false;
      } catch (e) {
        throw e;
      }
    }
    
    toJSON(): object {
      const json: object = {};
      Object.keys(this.fields).forEach(key => {
        if (['objectId', 'updateDate', 'createDate'].indexOf(key) > -1) return;
        if (!isNaN(this.fields[key])) {
          // number
          json[key] = this.fields[key];
          return;
        }
        if (this.fields[key] === null) {
          json[key] = null;
          return;
        }
        switch (this.fields[key].constructor.name) {
        case 'DataStore':
        case 'User':
          // Pointer
          const obj: DataStore = this.fields[key];
          json[key] = {
            '__type': 'Pointer',
            'className': obj.className,
            'objectId': obj.get('objectId')
          }
          break;
        case 'Date':
          const date = this.fields[key];
          json[key] = {
            '__type': 'Date',
            'iso': date.toISOString()
          };
          break;
        case 'Acl':
          json[key] = this.fields[key].toJSON();
          break;
        default:
          if (typeof this.fields[key].toJSON === 'function') {
            json[key] = this.fields[key].toJSON();
          } else {
            json[key] = this.fields[key];
          }
        };
      });
      return json;
    }
    
    async save() :boolean {
      const r = ncmb.Request();
      r.body = this.toJSON();
      try {
        const method = this.fields.objectId ? 'put' : 'post';
        const response: Respose = await r[method](this.path());
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
      let basePath = '';
      if (['users', 'roles', 'files'].indexOf(name) > -1) {
        basePath = `/${ncmb.version}/${name}`;
      } else {
        basePath = `/${ncmb.version}/classes/${name}`;
      }
      if (this.fields.objectId) {
        return `${basePath}/${this.fields.objectId}`;
      } else {
        return basePath;
      }
    }
    
    static path() :string {
      if (['users', 'roles'].indexOf(name) > -1) {
        return `/${ncmb.version}/${name}`;
      } else {
        return `/${ncmb.version}/classes/${name}`;
      }
    }
  }
  
  return DataStore;
}