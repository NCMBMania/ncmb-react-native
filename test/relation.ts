import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import NCMB, { NCMBObject, NCMBRelation } from '../index';
import config from './config.json';
import NCMBQuery from '../libs/Query';

describe('Object API', () => {
  before('Init', () => {
    new NCMB(config.applicationKey, config.clientKey);
  });

  it('Create relation', async () => {
    const item1 = new NCMBObject('Test');
    await item1.set('message', 'Hello, world from item1').save();
    const item2 = new NCMBObject('Test');
    await item2.set('message', 'Hello, world from item2').save();

    const relation = new NCMBRelation('Test');
    relation.add(item1).add(item2);

    const mainObj = new NCMBObject('Main');
    await mainObj.set('relation', relation).save();

    assert.isTrue(!!mainObj.get('objectId'));

    await item1.delete();
    await item2.delete();
    await mainObj.delete();
  });

  it('Create relation and retribute', async () => {
    const item1 = new NCMBObject('Test');
    await item1.set('message', 'Hello, world from item1').save();
    const item2 = new NCMBObject('Test');
    await item2.set('message', 'Hello, world from item2').save();

    const relation = new NCMBRelation('Test');
    relation.add(item1).add(item2);

    const mainObj = new NCMBObject('Main');
    await mainObj.set('relation', relation).save();

    assert.isTrue(!!mainObj.get('objectId'));

    const query = new NCMBQuery('Test');
    const ary = await query.relatedTo(mainObj, 'relation').fetchAll();
    assert.equal(ary.length, 2);
  });

  it('Create relation and remove', async () => {
    const item1 = new NCMBObject('Test');
    await item1.set('message', 'Hello, world from item1').save();
    const item2 = new NCMBObject('Test');
    await item2.set('message', 'Hello, world from item2').save();

    const relation = new NCMBRelation('Test');
    relation.add(item1).add(item2);

    const mainObj = new NCMBObject('Main');
    await mainObj.set('relation', relation).save();

    assert.isTrue(!!mainObj.get('objectId'));

    await mainObj.fetch();

    const relation2 = new NCMBRelation('Test');
    relation2.remove(item1);
    await mainObj.set('relation', relation2).save();

    const query = new NCMBQuery('Test');
    const ary = await query.relatedTo(mainObj, 'relation').fetchAll();
    assert.equal(ary.length, 1);
  });
});