import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import NCMB, { NCMBGeoPoint, NCMBObject, NCMBQuery } from '../index';
import config from './config.json';
import stations from './yamanote.json';

describe('Query API', () => {
  before('Init', async () => {
    new NCMB(config.applicationKey, config.clientKey);
    const promises = [];
    stations.forEach(s => {
      const station = new NCMBObject('Station');
      promises.push(station
        .set('name', s.name)
        .set('geo', new NCMBGeoPoint(s.latitude, s.longitude))
        .save());
    });
    await Promise.all(promises);
  });

  it('Count station', async () => {
    const query = new NCMBQuery('Station');
    const {count, results} = await query.limit(100).fetchWithCount();
    assert.equal(count, 29);
  });

  it('Find stations near by Tokyo tower', async () => {
    const tokyoTower = new NCMBGeoPoint(35.6585805, 139.7454329);
    const query = new NCMBQuery('Station');
    const ary = await query.withinKilometers('geo', tokyoTower, 2).fetchAll();
    ary.forEach(s => {
      assert.isTrue(['田町駅', '新橋駅', '浜松町駅'].indexOf(s.get('name')) > -1);
    });
    const ary2 = await query.withinKilometers('geo', tokyoTower, 3).fetchAll();
    ary2.forEach(s => {
      assert.isTrue(['田町駅', '有楽町駅', '新橋駅', '浜松町駅'].indexOf(s.get('name')) > -1);
    });
  });

  it('Find stations around bunkamura and NTT', async () => {
    const geo1 = new NCMBGeoPoint(35.6622568, 139.7148997);
    const geo2 = new NCMBGeoPoint(35.6206607, 139.7049691);
    const query = new NCMBQuery('Station');
    const ary = await query.withinSquare('geo', geo1, geo2).fetchAll();
    assert.equal(ary.length, 1);
    ary.forEach(s => {
      assert.isTrue(['恵比寿駅'].indexOf(s.get('name')) > -1);
    });
  });

  after('Delete data', async () => {
    const query = new NCMBQuery('Station');
    const stations = await query.limit(100).fetchAll();
    const promises = [];
    stations.forEach(s => {
      const station = new NCMBObject('Station');
      promises.push(s.delete());
    });
    await Promise.all(promises);
  });
});