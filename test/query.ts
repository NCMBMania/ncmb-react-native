import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import NCMB, { NCMBObject, NCMBQuery } from '../index';
import config from './config.json';

describe('Query API', () => {
  before('Init', async () => {
    new NCMB(config.applicationKey, config.clientKey);
    const promises = []
    for (let index = 0; index < 5; index++) {
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
    assert.equal(5, ary.length);
  });

  it('Or query', async () => {
    const query1 = new NCMBQuery('Test');
    const query2 = new NCMBQuery('Test');
    const query = new NCMBQuery('Test');
    query1.equalTo('number', 0);
    query2.equalTo('number', 2);
    const ary = await query.or([query1, query2]).fetchAll();
    assert.equal(ary.length, 2);
    assert.isTrue(ary.map(a => a.get('number')).indexOf(0) > -1);
    assert.isTrue(ary.map(a => a.get('number')).indexOf(2) > -1);
    assert.isTrue(ary.map(a => a.get('number')).indexOf(3) === -1);
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

  it('Using select (sub query)', async () => {
    const promises = []
    for (let index = 0; index < 5; index++) {
      const i = new NCMBObject('Test');
      promises.push(i
        .set('string', `I'm item #${index}`)
        .set('number', index)
        .save());
      const j = new NCMBObject('Test2');
      promises.push(j
        .set('string', `I'm test2 #${index}`)
        .set('num', index)
        .save());
    }
    await Promise.all(promises);

    const queryTest = new NCMBQuery('Test');
    const queryTest2 = new NCMBQuery('Test2');
    queryTest2.in('num', [1,4]);
    const ary = await queryTest.select('number', 'num', queryTest2).fetchAll();
    ary.forEach(a => {
      assert.isTrue([1, 4].indexOf(a.get('number')) > -1);
    });
  });

  it('Using inQuery (sub query)', async () => {
    const promises = []
    const ary = [];
    for (let index = 0; index < 5; index++) {
      const i = new NCMBObject('Test');
      promises.push(i
        .set('string', `I'm item #${index}`)
        .set('number', index)
        .save());
      ary.push(i);
    }
    const res = await Promise.all(promises);
    const promises2 = []
    const ary2 = [];
    for (let index = 0; index < 5; index++) {
      const i = new NCMBObject('Test2');
      promises2.push(i
        .set('string', `I'm test2 #${index}`)
        .set('num', ary[index])
        .save());
      ary2.push(i);
    }
    const res2 = await Promise.all(promises2);
    const queryTest = new NCMBQuery('Test');
    const queryTest2 = new NCMBQuery('Test2');
    queryTest.in('number', [1,4]);
    const ary3 = await queryTest2.inQuery('num', queryTest).include('num').fetchAll();
    assert.equal(ary3.length, 2);
    ary3.forEach(a => {
      assert.isTrue([1, 4].indexOf(a.get('num').get('number')) > -1);
    });
  });

  after('Delete all', async () => {
    ['Test', 'Test2'].forEach(async className => {
      const query = new NCMBQuery(className);
      const ary = await query.limit(1000).fetchAll();
      const promises = [];
      ary.forEach(async d => promises.push(d.delete()));
      await Promise.all(promises);
    });
  });
});
