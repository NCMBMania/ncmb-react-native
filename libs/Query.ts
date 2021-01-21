import NCMB, { NCMBUser, NCMBObject, NCMBRequest, NCMBRole, NCMBFile, NCMBGeoPoint, NCMBPush } from '../';
import { NCMBResponse, NCMBPointer } from '../types/Misc';
class NCMBQuery {
  static ncmb: NCMB;
  
  public _where: {[key: string]: any} = {};
  private _limit: number | null = null;
  private _skip: number | null = null;
  private _count: string = '';
  private _order: string | null = null;
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
  regularExpressionTo(name: string, value: RegExp): NCMBQuery {
    return this.setOperand(name, value.toString().slice(1, -1), '$regex');
  }

  near(name: string, geo: NCMBGeoPoint): NCMBQuery {
    return this.setOperand(name, geo.toJSON(), '$nearSphere');
  }

  withinKilometers(name: string, geo: NCMBGeoPoint, distance: number): NCMBQuery {
    this.setOperand(name, geo.toJSON(), '$nearSphere');
    this._where[name]['$maxDistanceInKilometers'] = distance;
    return this;
  }

  withinMiles(name: string, geo: NCMBGeoPoint, distance: number): NCMBQuery {
    this.setOperand(name, geo.toJSON(), '$nearSphere');
    this._where[name]['$maxDistanceInMiles'] = distance;
    return this;
  }
  
  withinRadians(name: string, geo: NCMBGeoPoint, distance: number): NCMBQuery {
    this.setOperand(name, geo.toJSON(), '$nearSphere');
    this._where[name]['$maxDistanceInRadians'] = distance;
    return this;
  }
  
  withinSquare(name: string, southWestGeo: NCMBGeoPoint, northEastGeo: NCMBGeoPoint): NCMBQuery {
    const box = {
      '$box': [southWestGeo.toJSON(), northEastGeo.toJSON()]
    };
    return this.setOperand(name, box, '$within');
  }

  select(name: string, subKey: string, query: NCMBQuery): NCMBQuery {
    const className = query.getClassName();
    if (!this._where[name]) this._where[name] = {};
    this._where[name]["$select"] = {
      query: query.getSelectParams(),
      key: subKey
    };
    return this;
  }

  inQuery(name: string, query: NCMBQuery): NCMBQuery {
    const className = query.getClassName();
    if (!this._where[name]) this._where[name] = {};
    this._where[name]["$inQuery"] = query.getSelectParams()
    return this;
  }

  getClassName(): string {
    switch (this.className) {
      case 'users':
        return 'user';
      case 'roles':
        return 'role';
      case 'installations':
        return 'installation';
      case 'files':
        return 'file';
      default:
        return this.className;
    }
  }

  getSelectParams(): {[s: string]: any} {
    const params: {[s: string]: any} = {
      className: this.className,
      where: this._where
    };
    if (this._skip && this._skip > 0) params.skip = this._skip;
    if (this._limit && this._limit > 0) params.limit = this._limit;
    return params;
  }

  or(queries: NCMBQuery[]): NCMBQuery {
    if (!Array.isArray(this._where['$or'])) {
      this._where['$or'] = [];
    }
    for (const query of queries) {
      this._where['$or'].push(query._where);
    }
    return this;
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
    this._skip = value;
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
  
  relatedTo(obj: NCMBObject | NCMBUser | NCMBRole, key: string): NCMBQuery {
    let className: string;
    if (obj instanceof NCMBUser) {
      className = 'user';
    } else if (obj instanceof NCMBRole) {
      className = 'role';
    } else {
      className = obj.className;
    }
    this._where['$relatedTo'] = {
      object: {
        __type: 'Pointer',
        className,
        objectId: obj.get('objectId')
      },
      key
    }
    return this;
  }

  async fetch(): Promise<NCMBObject | NCMBUser | NCMBRole | NCMBFile> {
    this._limit = 1;
    return (await this.fetchAll())[0];
  }
  
  async fetchWithCount(): Promise<{count: number, results: NCMBObject[]}> {
    this._count = '1';
    const { json, ary } = await this.fetchData();
    return {count: json.count!, results: ary};
  }

  async fetchAll(): Promise<NCMBObject[] | NCMBUser[] | NCMBRole[] | NCMBFile[]> {
    const { ary } = await this.fetchData();
    return ary;
  }
  
  async fetchData(): Promise<{json: NCMBResponse, ary: NCMBObject[]}> {
    const r = new NCMBRequest();
    try {
      const response = await r.get(this.path(), {
        where: this._where,
        skip: this._skip,
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
        let obj: NCMBObject | NCMBUser | NCMBRole | NCMBFile;
        if (this.className === 'users') {
          obj = new NCMBUser;
        } else if (this.className === 'roles') {
          obj = new NCMBRole;
        } else if (this.className === 'files') {
          obj = new NCMBFile;
        } else if (this.className === 'push') {
          obj = new NCMBPush;
        } else {
          obj = new NCMBObject(this.className);
        }
        
        Object.keys(params).forEach(key => {
          if (this._include && key === this._include) {
            const pointer = params[key] as NCMBPointer;
            const child = new NCMBObject(pointer.className!);
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

  path() :string {
    let basePath = '';
    if (['users', 'roles', 'installations', 'files', 'push'].indexOf(this.className) > -1) {
      basePath = `/${NCMB.version}/${this.className}`;
    } else {
      basePath = `/${NCMB.version}/classes/${this.className}`;
    }
    return basePath;
  }  
}

export default NCMBQuery;
