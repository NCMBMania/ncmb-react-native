import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import NCMB, { NCMBObject, NCMBGeoPoint, NCMBInstallation } from '../index';
import config from './config.json';

describe('Installation API', () => {
  before('Init', () => {
    new NCMB(config.applicationKey, config.clientKey);
  });

  it('Save successful', async () => {
    const installation = new NCMBInstallation;
    await installation
      .set('deviceToken', 'aaa')
      .set('deviceType', 'ios')
      .save();
    assert.isTrue(!!installation.get('objectId'));
    await installation.delete();
  });

  it('Update successful', async () => {
    const installation = new NCMBInstallation;
    await installation
      .set('deviceToken', 'aaa')
      .set('deviceType', 'ios')
      .set('message', 'Hi!')
      .save();
    assert.isTrue(!!installation.get('objectId'));
    await installation
      .set('message', 'Hello')
      .save();
    await installation.fetch();
    assert.equal(installation.get('message'), 'Hello');
    await installation.delete();
  });

  it('Duplication error', async () => {
    const token = 'aaa';
    const installation = new NCMBInstallation;
    await installation
      .set('deviceToken', token)
      .set('deviceType', 'ios')
      .save();
    assert.isTrue(!!installation.get('objectId'));
    const installation2 = new NCMBInstallation;
    try {
      await installation2
        .set('deviceToken', token)
        .set('deviceType', 'ios')
        .save();
      assert.isTrue(false);
    } catch (e) {
      assert.equal(e.message, 'E409001: Duplication Error');
    }
    await installation.delete();
  });

  it('Nessesary fields', async () => {
    try {
      const installation = new NCMBInstallation;
      await installation
        .set('sdkVersion', '1.0.0')
        .set('deviceType', 'ios')
        .save();
    } catch (e) {
      assert.equal(e.message, 'Device Token is required.');
    }
    try {
      const installation = new NCMBInstallation;
      await installation
        .set('deviceToken', 'aaa')
        .set('deviceType', 'mac')
        .save();
    } catch (e) {
      assert.equal(e.message, 'Device type has to be ios or android');
    }
  });

  it('Query', async () => {
    const promises = [];
    for (let i = 0; i < 5; i++) {
      const installation = new NCMBInstallation;
      promises.push(installation
        .set('deviceToken', `aaa${i}`)
        .set('deviceType', 'ios')
        .save()
      );
    }
    await Promise.all(promises);
    const query = NCMBInstallation.query();
    const ary = await query.fetchAll();
    assert.equal(ary.length, 5);
    const del = [];
    ary.forEach(i => del.push(i.delete()));
    await Promise.all(del);
  });
});