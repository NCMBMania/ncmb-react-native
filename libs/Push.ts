import NCMB, { NCMBQuery, NCMBObject, NCMBRequest } from '../';
import { allowType, NCMBResponse } from '../types/Misc';

class NCMBPush extends NCMBObject {
  static ncmb: NCMB;
  constructor() {
    super('push');
  }
  
  static query(): NCMBQuery {
    return new NCMBQuery('push');
  }

  set(name :string, value :allowType): NCMBPush {
    if (name === 'searchCondition' && value) {
      if (value instanceof NCMBQuery) {
        return super.set(name, value._where);
      }
      if (typeof value === 'object') {
        return super.set(name, value);
      }
      throw new Error('Search condition has to be NCMBQuery or object');
    }
    return super.set(name, value);
  }

  async save() : Promise<boolean> {
    if (!this.fields.deliveryTime && !this.fields.immediateDeliveryFlag) {
      throw new Error('Push has to set deliveryTime or immediateDeliveryFlag.');
    }
    if (!this.fields.target || !Array.isArray(this.fields.target)) {
      throw new Error('Push has to set target.');
    }
    return super.save();
  }

  static async open(deviceType: string, deviceToken: string, id: string): Promise<boolean> {
    const r = new NCMBRequest;
    r.body = { deviceType, deviceToken };
    const response = await r.post(`/${NCMB.version}/push/${id}/openNumber`);
    const json = (await response.json()) as NCMBResponse;
    if (json.code) {
      // エラー
      throw new Error(`${json.code}: ${json.error}`);
    }
    return !!json.updateDate;
  }
}

export default NCMBPush;
