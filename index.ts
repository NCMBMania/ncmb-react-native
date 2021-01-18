import NCMBObject from './libs/Object';
import NCMBQuery from './libs/Query';
import NCMBSignature from './libs/Signature';
import NCMBRequest from './libs/Request';
import NCMBUser from './libs/User';
import NCMBRole from './libs/Role';
import NCMBFile from './libs/File';
import NCMBAcl from './libs/Acl';
import NCMBRelation from './libs/Relation';
import NCMBGeoPoint from './libs/GeoPoint';

import { NCMBStorage } from './types/Misc';

class NCMB {
  public applicationKey :string;
  public clientKey :string;
  static fqdn = 'mbaas.api.nifcloud.com';
  static version = '2013-09-01';
  static applicationKeyName = 'X-NCMB-Application-Key';
  static signatureMethodName = 'SignatureMethod';
  static signatureMethodValue = 'HmacSHA256';
  static signatureHeaderName = 'X-NCMB-Signature';
  static signatureVersionName = 'SignatureVersion';
  static signatureVersionValue = '2';
  static timestampKeyName = 'X-NCMB-Timestamp';
  static sessionHeaderKeyName = 'X-NCMB-Apps-Session-Token';
  public sessionToken: string | null = null;
  public currentUser: NCMBUser | null = null;
  public storage: NCMBStorage | null = null;
  
  constructor(applicationKey :string, clientKey :string) {
    this.applicationKey = applicationKey;
    this.clientKey = clientKey;
    NCMBUser.ncmb = this;
    NCMBObject.ncmb = this;
    NCMBQuery.ncmb = this;
    NCMBFile.ncmb = this;
    NCMBRole.ncmb = this;
    NCMBRequest.ncmb = this;
    NCMBSignature.ncmb = this;
  }
}

export default NCMB;
export {
  NCMBUser,
  NCMBObject,
  NCMBQuery,
  NCMBFile,
  NCMBAcl,
  NCMBRole,
  NCMBRequest,
  NCMBRelation,
  NCMBGeoPoint,
};
