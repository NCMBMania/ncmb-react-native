import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import NCMB, { NCMBObject, NCMBQuery } from '../index';
import config from './config.json';

describe('Save Data', () => {
  before('Init', async () => {
    new NCMB(config.applicationKey, config.clientKey);
    const promises = []
    for (let index = 0; index < 10; index++) {
      const i = new NCMBObject('Test');
      promises.push(i
        .set('string', `I'm item #${index}`)
        .set('number', index)
        .save());
    }
    await Promise.all(promises);
  });



  it('Retribed Objects', async () => {
    const query = new NCMBQuery('Test');
    const ary = await query.fetchAll();
    assert.equal(10, ary.length);
  });

  it('Delete all data', async () => {
    const query = new NCMBQuery('Test');
    const ary = await query.limit(1000).fetchAll();
    const promises = [];
    ary.forEach(async d => promises.push(d.delete()));
    await Promise.all(promises);
    const query2 = new NCMBQuery('Test');
    const {count, results} = await query2.count().fetchWithCount();
    assert.equal(0, count);
  });
});
