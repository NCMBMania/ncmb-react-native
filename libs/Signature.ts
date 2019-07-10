const jsSHA = require('jssha');

interface SignatureString {
  SignatureMethod: string;
  where: string;
  limit: number;
  order: string;
  'X-NCMB-Application-Key': string;
  SignatureVersion: string;
  'X-NCMB-Timestamp': string;
}

export default class Signature {
  private ncmb;
  
  constructor(ncmb :NCMB) {
    this.ncmb = ncmb;
  }
  
  generate(method :string, path :string, timestamp :date, queries: any = {}) :string{
    const signatureString = this.generateSignatureString(timestamp, queries);
    const ary :string[] = [];
    ary.push(method);
    ary.push(this.ncmb.fqdn);
    ary.push(path);
    ary.push(signatureString);
    const baseString :string = ary.join("\n");
    const sha256 = new jsSHA('SHA-256', 'TEXT');
    sha256.setHMACKey(this.ncmb.clientKey, 'TEXT');
    sha256.update(baseString);
    return sha256.getHMAC('B64');
  }
  
  generateSignatureString(timestamp :date, queries :ary) :string{
    const hash :SignatureString = {};
    hash[this.ncmb.signatureMethodName] = this.ncmb.signatureMethodValue;
    hash[this.ncmb.signatureVersionName] = this.ncmb.signatureVersionValue;
    hash[this.ncmb.timestampKeyName] = timestamp.toISOString();
    hash[this.ncmb.applicationKeyName] = this.ncmb.applicationKey;
    if (queries.where) {
      hash.where = encodeURIComponent(JSON.stringify(queries.where));
    }
    return Object.keys(hash).sort().map(k => `${k}=${hash[k]}`).join('&');
  }
}