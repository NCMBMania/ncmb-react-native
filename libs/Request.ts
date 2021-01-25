import NCMB from '../index';
import NCMBSignature from './Signature';
// import { HttpMethod } from '../types/Misc';

const CONTENT_TYPE = 'Content-Type';
const ContentType = {
  Json: 'application/json',
  Multi: 'multipart/form-data'
} as const;

const HttpMethod = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Delete: 'DELETE'
} as const;

class NCMBRequest {
  static ncmb: NCMB;
  public body: any;
  public query: any;
  public date: Date | null = null;
  public addHeaders: {[s: string]: string} = {};
  public script: boolean = false;

  constructor() {
  }
  
  async exec(method: string, url: string, signature: string, bodies: any = null, file: any = null): Promise<Response> {
    const body = bodies ? JSON.stringify(bodies) : null;
    const headers = this.headers(signature);
    if (!file) {
      headers.set(CONTENT_TYPE, ContentType.Json);
    }
    if (Object.keys(this.addHeaders).length > 0) {
      for (const key in this.addHeaders) {
        headers.set(key, this.addHeaders[key]);
      }
    }
    if (body) {
      return await fetch(url, { method, headers, body });
    } else if (file) {
      return await fetch(url, { method, headers, body: file });
    } else {
      return await fetch(url, { method, headers });
    }
  }
  
  headers(signature: string): Headers {
    const headers: HeadersInit = new Headers();
    headers.set(NCMB.applicationKeyName, NCMBRequest.ncmb.applicationKey);
    headers.set(NCMB.timestampKeyName, this.date!.toISOString());
    headers.set(NCMB.signatureHeaderName, signature);
    if(NCMBRequest.ncmb.sessionToken) {
      headers.set(NCMB.sessionHeaderKeyName, NCMBRequest.ncmb.sessionToken);
    }
    return headers;
  }
  
  url(path: string, queries: any = null): string {
    const url = `https://${this.script ? NCMB.fqdn_script : NCMB.fqdn}${path}`;
    if (queries == null) return url;
    const query = Object.keys(queries).map(k => {
      if (typeof queries[k] === 'object') {
        return `${k}=${encodeURIComponent(JSON.stringify(queries[k]))}`
      } else {
        return `${k}=${encodeURIComponent(queries[k])}`
      }
    }).join('&');
    return `${url}?${query}`;
  }
  
  async post(path: string, file: any = null): Promise<Response> {
    const s = new NCMBSignature;
    s.script = this.script;
    const method = HttpMethod.Post;
    this.date = new Date();
    const signature = s.generate(method, path, this.date);
    return this.exec(method, this.url(path), signature, this.body, file);
  }

  async put(path: string): Promise<Response> {
    const s = new NCMBSignature;
    s.script = this.script;
    const method = HttpMethod.Put;
    this.date = new Date();
    const signature = s.generate(method, path, this.date);
    return this.exec(method, this.url(path), signature, this.body);
  }

  queries(queries: any): {[key: string]: string} {
    const filteredQuery: {[key: string]: string} = {};
    for (const key in queries) {
      if (queries[key] && queries[key] !== '') {
        filteredQuery[key] = queries[key];
      }
    }
    return filteredQuery;
  }

  async get(path: string, queries?: any): Promise<Response> {
    const s = new NCMBSignature;
    s.script = this.script;
    const method = HttpMethod.Get;
    this.date = new Date();
    const q = this.queries(queries);
    const signature = s.generate(method, path, this.date, q);
    return this.exec(method, this.url(path, q), signature);
  }
  
  async delete(path: string): Promise<Response> {
    const s = new NCMBSignature;
    s.script = this.script;
    const method = HttpMethod.Delete;
    this.date = new Date();
    const signature = s.generate(method, path, this.date);
    return this.exec(method, this.url(path), signature);
  }
}

export default NCMBRequest;
