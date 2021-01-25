import { describe, it, before } from 'mocha';

import { assert } from 'chai';
import NCMB, { NCMBObject, NCMBGeoPoint } from '../index';
import config from './config.json';

describe('Object API', () => {
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

  it('Update object', async () => {
    const obj = new NCMBObject('Test');
    await obj
      .set('message', 'first message')
      .save();
    await obj
      .set('message', 'second message')
      .save();
    const obj2 = new NCMBObject('Test');
    obj2.set('objectId', obj.get('objectId'));
    await obj2.fetch();
    assert.equal(obj.get('objectId'), obj2.get('objectId'));
    await obj2.delete();
  });

  it('Set and get date object', async () => {
    const obj = new NCMBObject('Test');
    await obj
      .set('date', new Date)
      .save();
    const obj2 = new NCMBObject('Test');
    obj2.set('objectId', obj.get('objectId'));
    await obj2.fetch();
    assert.isTrue(obj2.get('date') instanceof Date);
    await obj2.delete();
  });

  it('Using increments', async () => {
    const obj = new NCMBObject('Test');
    await obj
      .set('num', 1)
      .save();
      await obj.setIncrement('num', 1).save();
    const obj2 = new NCMBObject('Test');
    obj2.set('objectId', obj.get('objectId'));
    await obj2.fetch();
    assert.equal(obj2.get('num'), 2);
    await obj.setIncrement('num', 2).save();
    const obj3 = new NCMBObject('Test');
    obj3.set('objectId', obj.get('objectId'));
    await obj3.fetch();
    assert.equal(obj3.get('num'), 4);
    await obj.delete();
  });

  it('Add array', async () => {
    const obj = new NCMBObject('Test');
    await obj
      .set('ary', ['first'])
      .save();
    await obj
      .add('ary', 'second')
      .save();
    await obj.fetch();
    assert.equal(JSON.stringify(obj.get('ary')), JSON.stringify(['first', 'second']));
  });

  it('Remove array', async () => {
    const obj = new NCMBObject('Test');
    await obj
      .set('ary', ['first', 'second'])
      .save();
    await obj
      .remove('ary', 'second')
      .save();
    await obj.fetch();
    assert.equal(JSON.stringify(obj.get('ary')), JSON.stringify(['first']));
  });

  it('Add unique array', async () => {
    const obj = new NCMBObject('Test');
    await obj
      .set('ary', ['first', 'second'])
      .save();
    await obj
      .addUnique('ary', ['second', 'third'])
      .save();
    await obj.fetch();
    assert.equal(JSON.stringify(obj.get('ary')), JSON.stringify(['first', 'second', 'third']));
  });

  it('Save with GetPoint', async () => {
    const obj = new NCMBObject('Test');
    const geo = new NCMBGeoPoint(30.0, 130.0);
    await obj
      .set('geo', geo)
      .save();
    assert.isTrue(!!obj.get('objectId'));
    await obj.fetch();
    console.log(obj);
    await obj.delete();
  });
});
