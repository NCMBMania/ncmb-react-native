import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import NCMB, { NCMBObject } from '../index';
import config from './config.json';

describe('Save Data', () => {
  before('Init', () => {
    new NCMB(config.applicationKey, config.clientKey);
  });

  it('Save successful', async () => {
    const obj = new NCMBObject('Test');
    await obj
      .set('message', 'Hello, world')
      .save();
    assert.isTrue(!!obj.get('objectId'));
    await obj.delete();
  });

  it('Save successful with number, date, object, array, pointer', async () => {
    const obj = new NCMBObject('Test');
    await obj
      .set('message', 'Hello, world')
      .set('number', 500)
      .set('date', new Date)
      .set('object', {a: 'b', c: 'd'})
      .set('array', [1, 2, 3, 'test'])
      .save();
    assert.isTrue(!!obj.get('objectId'));
    const obj2 = new NCMBObject('Test');
    await obj2
      .set('obj', obj)
      .save();
    assert.isTrue(!!obj2.get('objectId'));
    await obj.delete();
    await obj2.delete();
  });
});
