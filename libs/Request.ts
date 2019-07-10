
interface Header {
  "X-NCMB-Application-Key": string,
  "X-NCMB-Timestamp": string,
  "X-NCMB-Signature": string,
  "Content-Type": string
}

export default class Request {
  public body: any;
  public query: any;
  
  constructor(ncmb: ncmb) {
    this.ncmb = ncmb;
  }
  
  async post(path: string): Response {
    const s: Signature = this.ncmb.Signature();
    const d: date = new Date();
    const method = 'POST';
    signature = s.generate(method, path, d, this.body);
    const body = JSON.stringify(this.body);
    const url = `https://${this.ncmb.fqdn}${path}`;
    const headers: Header = {};
    headers[this.ncmb.applicationKeyName] = this.ncmb.applicationKey;
    headers[this.ncmb.timestampKeyName] = d.toISOString();
    headers[this.ncmb.signatureHeaderName] = signature;
    headers['Content-Type'] = 'application/json';
    return await fetch(url, { method, headers, body });
  }
}