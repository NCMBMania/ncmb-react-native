import NCMB, { NCMBRequest } from "../index";
import { JsonObject, NCMBResponse } from "../types/Misc";

class NCMBScript {
  static ncmb: NCMB;
  private scriptName: string = '';
  private method: string = '';
  private _headers: {[s: string]: string} = {};
  private _queries: {[s: string]: any} = {};
  private _bodies: {[s: string]: any} = {};

  constructor(scriptName: string, method: string) {
    this.scriptName = scriptName;
    this.method = method;
  }

  header(name: string, value: string): NCMBScript {
    this._headers[name] = value;
    return this;
  }

  headers(headers: {[s: string]: string}): NCMBScript {
    for (const key in headers) {
      this.header(key, headers[key]);
    }
    return this;
  }

  query(name: string, value: any): NCMBScript {
    this._queries[name] = value;
    return this;
  }

  queries(queries: {[s: string]: any}): NCMBScript {
    for (const key in queries) {
      this.query(key, queries[key]);
    }
    return this;
  }

  body(name: string, value: any): NCMBScript {
    this._bodies[name] = value;
    return this;
  }

  bodies(bodies: {[s: string]: any}): NCMBScript {
    for (const key in bodies) {
      this.body(key, bodies[key]);
    }
    return this;
  }
  
  async execute(): Promise<JsonObject> {
    const r = new NCMBRequest;
    r.script = true;
    if (Object.keys(this._headers).length > 0) {
      r.addHeaders = this._headers;
    }
    switch (this.method) {
      case 'GET': {
        const response = await r.get(this.path(), this._queries);
        const json: NCMBResponse = await response.json();
        if (json.code) {
          // エラー
          throw new Error(`${json.code}: ${json.error}`);
        }
        return json as JsonObject;
      }
      case 'POST': 
      case 'PUT': {
        r.body = this._bodies;
        const method = this.method == 'POST' ? 'post' : 'put';
        const response = await r[method](this.path());
        const json: NCMBResponse = await response.json();
        if (json.code) {
          // エラー
          throw new Error(`${json.code}: ${json.error}`);
        }
        return json as JsonObject;
      }
      case 'DELETE': {
        const response = await r.delete(this.path());
        const json: NCMBResponse = await response.json();
        if (json.code) {
          // エラー
          throw new Error(`${json.code}: ${json.error}`);
        }
        return json as JsonObject;
      }
    }
    return {} as JsonObject;
  }

  path(): string {
    return `/2015-09-01/script/${this.scriptName}`;
  }
}

export default NCMBScript;
