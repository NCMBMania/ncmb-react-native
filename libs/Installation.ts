import NCMB, { NCMBQuery, NCMBObject, NCMBRequest } from '../index';
class NCMBInstallation extends NCMBObject {
  static ncmb: NCMB;
  constructor() {
    super('installations');
    this.fields = {
      sdk: 'React Native',
      sdkVersion: '2.0.10'
    };
  }
  
  static query(): NCMBQuery {
    return new NCMBQuery('installations');
  }

  async save() : Promise<boolean> {
    if (!this.fields.deviceToken || this.fields.deviceToken === '') {
      throw new Error('Device Token is required.');
    }
    if (!this.fields.deviceType || ['ios', 'android'].indexOf(this.fields.deviceType) === -1) {
      throw new Error('Device type has to be ios or android');
    }
    return super.save();
  }
}

export default NCMBInstallation;
