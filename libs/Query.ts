import NCMB from '../';
import NCMBObject from './Object';
import NCMBRequest from './Request';

class NCMBQuery {
  static ncmb: NCMB;
  
  private _where: {[key: string]: any} = {};
  private _limit: number = 10;
  private _count: string = '';
  private _offset: number = 0;
  private _order: string = 'createDate';
  private _include: string = '';
  private className: string;

  constructor(name: string) {
    this.className = name;
  }
  
  equalTo(name: string, value: any): NCMBQuery {
    return this.setOperand(name, value);
  }
  
  notEqualTo(name: string, value: any): NCMBQuery {
    return this.setOperand(name, value, '$ne');
  }
  greaterThan(name: string, value: any): NCMBQuery {
    return this.setOperand(name, value, '$gt');
  }
  greaterThanOrEqualTo(name: string, value: any): NCMBQuery {
    return this.setOperand(name, value, '$gte');
  }
  lessThan(name: string, value: any): NCMBQuery {
    return this.setOperand(name, value, '$lt');
  }
  lessThanOrEqualTo(name: string, value: any): NCMBQuery {
    return this.setOperand(name, value, '$lte');
  }
  in(name: string, value: any): NCMBQuery {
    return this.setOperand(name, value, '$in');
  }
  notIn(name: string, value: any): NCMBQuery {
    return this.setOperand(name, value, '$nin');
  }
  exists(name: string): NCMBQuery {
    return this.setOperand(name, true, '$exists');
  }
  notExists(name: string): NCMBQuery {
    return this.setOperand(name, false, '$exists');
  }
  inArray(name: string, value: any): NCMBQuery {
    return this.setOperand(name, value, '$inArray');
  }
  notInArray(name: string, value: any): NCMBQuery {
    return this.setOperand(name, value, '$ninArray');
  }
  allInArray(name: string, value: any): NCMBQuery {
    return this.setOperand(name, value, '$all');
  }
  
  setOperand(name: string, value: any, operand?: string): NCMBQuery {
    let condition = this._where[name];
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
      this._where[name] = value;
    } else {
      condition[operand] = value;
      this._where[name] = condition;
    }
    return this;
  }
  
  limit(value: number): NCMBQuery {
    this._limit = value;
    return this;
  }
  
  skip(value: number): NCMBQuery {
    this._offset = value;
    return this;
  }
  
  order(name: string, desc: boolean = false): NCMBQuery {
    if (desc) {
      this._order = `-${name}`;
    } else {
      this._order = name
    }
    return this;
  }
  count(): NCMBQuery {
    this._count = '1';
    return this;
  }
  include(name: string): NCMBQuery {
    this._include = name;
    return this;
  }
  
  async fetch(): Promise<NCMBObject> {
    this._limit = 1;
    return (await this.fetchAll())[0];
  }
  
  async fetchWithCount(): Promise<{count: number, results: NCMBObject[]}> {
    this._count = '1';
    const { json, ary } = await this.fetchData();
    return {count: json.count!, results: ary};
  }

  async fetchAll(): Promise<NCMBObject[]> {
    const { ary } = await this.fetchData();
    return ary;
  }
  
  async fetchData(): Promise<{json: NCMBResponse, ary: NCMBObject[]}> {
    const r = new NCMBRequest();
    try {
      const response = await r.get(this.path(), {
        where: this._where,
        offset: this._offset,
        limit: this._limit,
        order: this._order,
        include: this._include,
        count: this._count
      });
      const json = (await response.json()) as NCMBResponse;
      if (json.code) {
        // エラー
        throw new Error(`${json.code}: ${json.error}`);
      }
      const ary = [] as NCMBObject[];
      for (let params of json.results!) {
        const obj = new NCMBObject(this.className);
        Object.keys(params).forEach(key => {
          if (this._include && key === this._include) {
            const pointer = params[key] as NCMBPointer;
            const child = new NCMBObject(pointer.className);
            delete pointer.className;
            delete params[pointer.__type!];
            child.sets(pointer);
            obj.set(key, child);
          } else {
            obj.set(key, params[key]);
          }
        });
        ary.push(obj);
      }
      return {json, ary};
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
        const obj: NCMBQuery = this.fields[key];
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
    
  path() :string {
    let basePath = '';
    if (['users', 'roles', 'files'].indexOf(this.className) > -1) {
      basePath = `/${NCMB.version}/${this.className}`;
    } else {
      basePath = `/${NCMB.version}/classes/${this.className}`;
    }
    return basePath;
  }
  
  /*
  static path() :string {
    if (['users', 'roles'].indexOf(name) > -1) {
      return `/${ncmb.version}/${name}`;
    } else {
      return `/${ncmb.version}/classes/${name}`;
    }
  }
  */
}

export default NCMBQuery;
