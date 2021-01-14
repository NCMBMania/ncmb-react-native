class NCMBObject {
  static ncmb: NCMB;

  private className: string;

  private fields: object;
  constructor(name: string) {
    this.fields = {};
    this.className = name;
  }
  
  set(name :string, value :any) :NCMBObject {
    this.fields[name] = value;
    return this;
  }
  
  sets(json: Object) :NCMBObject {
    Object.keys(json).forEach(key => {
      this.set(key, json[key]);
    });
    return this;
  }
  
  get(name :string): any {
    return this.fields[name];
  }
  
  
  static async fetch(): NCMBObject {
    limit = 1;
    return (await this.fetchAll())[0];
  }
  
  async delete() : Promise<boolean> {
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
  
  async save() : Promise<boolean> {
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

export default NCMBObject;
