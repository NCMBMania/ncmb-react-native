import NCMB, { NCMBRequest, NCMBUser, NCMBAcl, NCMBRole, NCMBFile, NCMBInstallation, NCMBPush, NCMBGeoPoint } from '../index';
import { NCMBResponse, JsonObject, allowType, NCMBAclFormat, NCMBDate, NCMBGeoPointFormat } from '../types/Misc'
class NCMBObject {
  static ncmb: NCMB;
  public className: string;
  public fields: JsonObject;

  constructor(name: string) {
    this.fields = {};
    this.className = name;
  }
  
  set(name :string, value :allowType): NCMBObject | NCMBUser | NCMBRole | NCMBFile | NCMBInstallation | NCMBPush {
    switch (name) {
      case 'createDate':
      case 'updateDate':
        this.fields[name] = new Date(value);
        break;
      case 'acl':
        const acl = new NCMBAcl;
        acl.sets(value as NCMBAclFormat);
        this.fields[name] = acl;
        break;
      default:
        this.fields[name] = value;
        break;
    }

    if (value && typeof value === 'object' && value.__type === 'GeoPoint') {
      value = value as NCMBGeoPointFormat;
      this.fields[name] = new NCMBGeoPoint(value.latitude, value.longitude);
    }
    if (value && typeof value === 'object' && value.__type === 'Date') {
      this.fields[name] = new Date((value as NCMBDate).iso);
    }
    return this;
  }
  
  sets(json: JsonObject) :NCMBObject | NCMBUser | NCMBRole | NCMBFile | NCMBInstallation | NCMBPush {
    Object.keys(json).forEach(key => {
      this.set(key, json[key] as JsonObject);
    });
    return this;
  }
  
  get(name :string): allowType {
    return this.fields[name];
  }
  
  setIncrement(name: string, value: number): NCMBObject | NCMBUser | NCMBInstallation | NCMBPush {
    if (!this.get('objectId')) {
      return this.set(name, value);
    }
    return this.set(name, {
      __op: 'Increment',
      amount: value
    });
  }

  add(name: string, value: any): NCMBObject | NCMBUser | NCMBInstallation | NCMBPush{
    if (!Array.isArray(value)) {
      value = [value];
    }
    if (!this.get('objectId')) {
      return this.set(name, value);
    }
    return this.set(name, {
      __op: 'Add',
      objects: value
    });
  }

  addUnique(name: string, value: any): NCMBObject | NCMBUser | NCMBInstallation | NCMBPush {
    if (!Array.isArray(value)) {
      value = [value];
    }
    if (!this.get('objectId')) {
      return this.set(name, value);
    }
    return this.set(name, {
      __op: 'AddUnique',
      objects: value
    });
  }

  remove(name: string, value: any): NCMBObject | NCMBUser | NCMBInstallation | NCMBPush {
    if (!Array.isArray(value)) {
      value = [value];
    }
    return this.set(name, {
      __op: 'Remove',
      objects: value
    });
  }

  async fetch(): Promise<NCMBObject | NCMBUser | NCMBRole | NCMBFile | NCMBInstallation | NCMBPush> {
    const r = new NCMBRequest();
    const response = await r.get(this.path(), {
    });
    const json = (await response.json()) as NCMBResponse;
    if (json.code) {
      // エラー
      throw new Error(`${json.code}: ${json.error}`);
    }
    this.sets(json);
    return this;
  }
  
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
  
  toJSON(): JsonObject {
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
      case 'NCMBInstallation':
      case 'NCMBPush':
        // Pointer
        const obj = this.fields[key] as NCMBObject;
        json[key] = obj.toPointer();
        break;
      case 'Date':
        const date = this.fields[key] as Date;
        json[key] = {
          '__type': 'Date',
          'iso': date.toISOString()
        };
        break;
      case 'NCMBGeoPoint':
        const geo = this.fields[key] as NCMBGeoPoint;
        json[key] = geo.toJSON();
        break;
      case 'NCMBAcl':
        const acl = this.fields[key] as NCMBAcl;
        json[key] = acl.toJSON();
        break;
      default:
        const func: Function | null = this.fields[key]!.toJSON;
        if (typeof func === 'function') {
          json[key] = func.bind(this.fields[key])();
        } else {
          json[key] = this.fields[key];
        }
      };
    });
    return json;
  }
  
  toPointer(): JsonObject {
    return {
      '__type': 'Pointer',
      'className': this.className,
      'objectId': this.get('objectId')
    };
  }

  async save() : Promise<boolean> {
    const r = new NCMBRequest;
    r.body = this.toJSON();
    try {
      const method = this.fields.objectId ? 'put' : 'post';
      const response = await r[method](this.path());
      const json: NCMBResponse = await response.json();
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
    if (['users', 'roles', 'files', 'installations', 'push'].indexOf(this.className) > -1) {
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
    if (['users', 'roles'].indexOf('') > -1) {
      return `/${NCMB.version}/${name}`;
    } else {
      return `/${NCMB.version}/classes/${name}`;
    }
  }
  */
}

export default NCMBObject;
