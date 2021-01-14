import NCMBObject from './libs/Object';
import NCMBQuery from './libs/Query';
import Signature from './libs/Signature';
import Request from './libs/Request';
import NCMBUser from './libs/User';
import NCMBRole from './libs/Role';
import NCMBFile from './libs/File';
import NCMBAcl from './libs/Acl';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NCMB {
  public applicationKey :string;
  public clientKey :string;
  public fqdn :string;
  public version :string;
  public applicationKeyName :string;
  public signatureMethodName :string;
  public signatureMethodValue :string;
  public signatureHeaderName :string;
  public signatureVersionName :string;
  public signatureVersionValue :string;
  public timestampKeyName :string;
  public sessionToken: string | null;
  public currentUser: NCMBUser | null;
  public storage: typeof AsyncStorage;
  
  constructor(applicationKey :string, clientKey :string) {
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
    this.sessionToken = null;
    this.currentUser = null;
    this.storage = AsyncStorage;
    NCMBUser.ncmb = this;
    NCMBObject.ncmb = this;
    NCMBQuery.ncmb = this;
    NCMBFile.ncmb = this;
    NCMBRole.ncmb = this;
  }
  
  Request(method: string, path: string) {
    return new Request(this);
  }
  
  Signature() {
    return new Signature(this);
  }
}

export default NCMB;
export { NCMBUser, NCMBObject, NCMBQuery, NCMBFile, NCMBAcl, NCMBRole };
