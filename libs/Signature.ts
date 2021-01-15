import NCMB from "..";

const jsSHA = require('jssha');

interface SignatureString {
  SignatureMethod: string;
  where?: string;
  limit?: number;
  order?: string;
  'X-NCMB-Application-Key': string;
  SignatureVersion: string;
  'X-NCMB-Timestamp': string;
}

export default class Signature {
  static ncmb: NCMB;
  
  generate(method :string, path :string, timestamp :date = new Date(), queries: any = {}) :string{
    const signatureString = this.generateSignatureString(timestamp, queries);
    const ary :string[] = [];
    ary.push(method);
    ary.push(NCMB.fqdn);
    ary.push(path);
    ary.push(signatureString);
    const baseString :string = ary.join("\n");
    const sha256 = new jsSHA('SHA-256', 'TEXT');
    sha256.setHMACKey(Signature.ncmb.clientKey, 'TEXT');
    sha256.update(baseString);
    return sha256.getHMAC('B64');
  }
  
  generateSignatureString(timestamp :date, queries :ary) :string{
    const hash :SignatureString = {};
    hash[NCMB.signatureMethodName] = NCMB.signatureMethodValue;
    hash[NCMB.signatureVersionName] = NCMB.signatureVersionValue;
    hash[NCMB.timestampKeyName] = timestamp.toISOString();
    hash[NCMB.applicationKeyName] = Signature.ncmb.applicationKey;
    Object.keys(queries).forEach(k => {
      if (typeof queries[k] === 'object') {
        hash[k] = encodeURIComponent(JSON.stringify(queries[k]));
      } else {
        hash[k] = encodeURIComponent(queries[k]);
      }
    });
    return Object.keys(hash).sort().map(k => `${k}=${hash[k]}`).join('&');
  }
}