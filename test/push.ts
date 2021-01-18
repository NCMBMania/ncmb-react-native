import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import NCMB, { NCMBObject, NCMBGeoPoint, NCMBPush } from '../index';
import config from './config.json';
import NCMBQuery from '../libs/Query';

describe('Push API', () => {
  before('Init', () => {
    new NCMB(config.applicationKey, config.clientKey);
  });

  it('Save successful', async () => {
    const push = new NCMBPush;
    await push
      .set('immediateDeliveryFlag', true)
      .set('target', ['ios'])
      .save();
    assert.isTrue(!!push.get('objectId'));
  });

  it('Save and fetch', async () => {
    const push = new NCMBPush;
    await push
      .set('immediateDeliveryFlag', true)
      .set('message', 'Hello')
      .set('target', ['ios'])
      .save();
    assert.isTrue(!!push.get('objectId'));
    const push2 = new NCMBPush;
    await push2.set('objectId', push.get('objectId')).fetch();
    assert.equal(push2.get('message'), 'Hello');
  });

  it('Save and update', async () => {
    const push = new NCMBPush;
    await push
      .set('immediateDeliveryFlag', true)
      .set('message', 'Hello')
      .set('target', ['ios'])
      .save();
    await push.set('message', 'Hello, again').save();
    const push2 = new NCMBPush;
    await push2.set('objectId', push.get('objectId')).fetch();
    assert.equal(push2.get('message'), 'Hello, again');
  });

  it('Save and update with searchCondition', async () => {
    const query = NCMBPush.query();
    query
      .equalTo('objectId', 'aaa');
    const push = new NCMBPush;
    await push
      .set('immediateDeliveryFlag', true)
      .set('message', 'Hello')
      .set('searchCondition', query)
      .set('target', ['ios'])
      .save();
    assert.isTrue(!!push.get('objectId'));
    await push.fetch();
  });

  it('Query and delete all', async () => {
    const query = NCMBPush.query();
    const ary = await query.limit(1000).fetchAll();
    const p = [];
    ary.forEach(a => {
      p.push(a.delete());
    })
    await Promise.all(p);
  });
});