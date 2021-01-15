import NCMB from '../';
import NCMBRequest from './Request';
import NCMBUser from './User';
import NCMBAcl from './Acl';

class NCMBObject {
  static ncmb: NCMB;

  private className: string;
  private fields: JsonObject;

  constructor(name: string) {
    this.fields = {};
    this.className = name;
  }
  
  set(name :string, value :allowType) :NCMBObject {
    this.fields[name] = value;
    return this;
  }
  
  sets(json: JsonObject) :NCMBObject {
    Object.keys(json).forEach(key => {
      this.set(key, json[key] as JsonObject);
    });
    return this;
  }
  
  get(name :string): any {
    return this.fields[name];
  }
  
  /*
  static async fetch(): Promise<NCMBObject> {
    return (await this.fetchAll())[0];
  }
  */
  
  async delete() : Promise<boolean> {
    const r = new NCMBRequest;
    r.body = this.fields;
    try {
      const response = await r.delete(this.path());
      const body: string = await response.text();
      if (body == '') return true;
      const json: NCMBResponse = JSON.parse(body);
      if (json.code) {
        // エラー
        throw new Error(`${json.code}: ${json.error}`);
      }
      return true;
    } catch (e) {
      throw e;
    }
  }
  
  toJSON(): object {
    const json: JsonObject = {};
    Object.keys(this.fields).forEach(key => {
      if (['objectId', 'updateDate', 'createDate'].indexOf(key) > -1) return;
      if (this.fields[key] === null) {
        json[key] = null;
        return;
      }
      switch (this.fields[key]!.constructor.name) {
      case 'Number':
        json[key] = this.fields[key];
        break;
      case 'NCMBObject':
      case 'NCMBUser':
        // Pointer
        const obj = this.fields[key] as NCMBObject;
        json[key] = {
          '__type': 'Pointer',
          'className': obj.className,
          'objectId': obj.get('objectId')
        }
        break;
      case 'Date':
        const date = this.fields[key] as Date;
        json[key] = {
          '__type': 'Date',
          'iso': date.toISOString()
        };
        break;
      case 'NCMBAcl':
        const acl = this.fields[key] as NCMBAcl;
        json[key] = acl.toJSON();
        break;
      default:
        const func: Function | null = this.fields[key]!.toJSON;
        if (typeof func === 'function') {
          json[key] = func();
        } else {
          json[key] = this.fields[key];
        }
      };
    });
    return json;
  }
  
  async save() : Promise<boolean> {
    const r = new NCMBRequest;
    r.body = this.toJSON();
    try {
      const method = this.fields.objectId ? 'put' : 'post';
      const response = await r[method](this.path());
      const json: ResponseError | JsonObject = await response.json();
      if (json.code) {
        // エラー
        throw new Error(`${json.code}: ${json.error}`);
      }
      this.sets(json as JsonObject);
      return true;
    } catch (e) {
      throw e;
    }
  }
  
  path() :string {
    let basePath = '';
    if (['users', 'roles', 'files'].indexOf(this.className) > -1) {
      basePath = `/${NCMB.version}/${this.className}`;
    } else {
      basePath = `/${NCMB.version}/classes/${this.className}`;
    }
    if (this.fields.objectId) {
      return `${basePath}/${this.fields.objectId}`;
    } else {
      return basePath;
    }
  }
  /*
  static path() :string {
    if (['users', 'roles'].indexOf() > -1) {
      return `/${NCMBObject.ncmb.version}/${name}`;
    } else {
      return `/${NCMBObject.ncmb.version}/classes/${name}`;
    }
  }
  */
}

export default NCMBObject;
