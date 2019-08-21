import DataStore from './libs/DataStore.ts';
import Signature from './libs/Signature.ts';
import Request from './libs/Request.ts';
import User from './libs/User.ts';
import Acl from './libs/Acl.ts';
import Role from './libs/Role.ts';
import File from './libs/File.ts';

export default class NCMB {
  public applicationKey :string;
  public clientKey :string;
  public fqdn :string;
  public version :string;
  public applicationKeyName :string;
  public signatureMethodName :string;
  public signatureMethodValue :string;
  public signatureVersionName :string;
  public signatureVersionValue :string;
  public timestampKeyName :string;
  public sessionToken: string;
  public currentUser: User;
  public storage: AsyncStorage;
  
  constructor(applicationKey :string, clientKey :string): void {
    this.applicationKey = applicationKey;
    this.clientKey = clientKey;
    this.fqdn = 'mbaas.api.nifcloud.com';
    this.version = '2013-09-01';
    this.applicationKeyName = 'X-NCMB-Application-Key';
    this.signatureHeaderName = 'X-NCMB-Signature';
    this.signatureMethodName = 'SignatureMethod';
    this.signatureMethodValue = 'HmacSHA256';
    this.signatureVersionName = 'SignatureVersion';
    this.signatureVersionValue = '2';
    this.timestampKeyName = 'X-NCMB-Timestamp';
    this.currentUser = null;
    this.User = User(this);
    this.Role = Role(this);
    this.Acl = Acl;
    this.File = File(this);
  }
  
  DataStore(name :string) :DataStore {
    return DataStore(this, name);
  }
  
  Request(method: string, path: string) {
    return new Request(this);
  }
  
  Signature() {
    return new Signature(this);
  }
}

