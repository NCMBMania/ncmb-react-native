
interface Header {
  "X-NCMB-Application-Key": string,
  "X-NCMB-Timestamp": string,
  "X-NCMB-Signature": string,
  "X-NCMB-Apps-Session-Token": string,
  "Content-Type": string
}

export default class Request {
  public body: any;
  public query: any;
  public date: Date;
  constructor(ncmb: ncmb) {
    this.ncmb = ncmb;
  }
  
  async exec(method: string, url: string, bodies: any = null): Response {
    const body = bodies ? JSON.stringify(bodies) : null;
    const headers = this.headers();
    if (body) {
      return await fetch(url, { method, headers, body });
    } else {
      return await fetch(url, { method, headers });
    }
  }
  
  headers(): Header{
    const headers: Header = {};
    headers[this.ncmb.applicationKeyName] = this.ncmb.applicationKey;
    headers[this.ncmb.timestampKeyName] = this.date.toISOString();
    headers[this.ncmb.signatureHeaderName] = signature;
    headers['Content-Type'] = 'application/json';
    if (this.ncmb.sessionToken) headers['X-NCMB-Apps-Session-Token'] = this.ncmb.sessionToken;
    return headers;
  }
  
  url(path, queries: any = null): String {
    const url = `https://${this.ncmb.fqdn}${path}`;
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
  
  async post(path: string): Response {
    const s: Signature = this.ncmb.Signature();
    const method = 'POST';
    this.date = new Date();
    signature = s.generate(method, path, this.date);
    return this.exec(method, this.url(path), this.body);
  }

  async get(path: string, queries: any): Response {
    const s: Signature = this.ncmb.Signature();
    const method = 'GET';
    this.date = new Date();
    signature = s.generate(method, path, this.date, queries);
    return this.exec(method, this.url(path, queries));
  }
  
  async delete(path: string): Response {
    const s: Signature = this.ncmb.Signature();
    const method = 'DELETE';
    this.date = new Date();
    signature = s.generate(method, path, this.date);
    return this.exec(method, this.url(path));
  }
}