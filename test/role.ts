import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import NCMB, { NCMBRole, NCMBUser } from '../index';
import config from './config.json';

describe('Managing Role', () => {
  before('Init', async () => {
    new NCMB(config.applicationKey, config.clientKey);
    
  });
  it('Create new role', async () => {
    const role = new NCMBRole;
    role
      .set('roleName', 'admin');
    await role.save();
    assert.isTrue(!!role.get('objectId'));
    await role.delete();
  });

  it('Add user to role', async () => {
    const roleName = 'admin';
    const role = new NCMBRole;
    role
      .set('roleName', roleName);
    await role.save();
    assert.isTrue(!!role.get('objectId'));

    const user = new NCMBUser;
    user
      .set('userName', 'tester')
      .set('password', 'tester');
    await user.signUpByAccount();

    await role.addUser(user).save();

    const query = NCMBRole.query();
    const role2 = await (query.equalTo('roleName', roleName).fetch()) as NCMBRole;
    const users = await role2.fetchUser();
    assert.equal(user.get('objectId'), users[0].get('objectId'));
    await role.delete();
    await user.delete();
    NCMBUser.logout();
  });

  it('Find role', async () => {
    const roleName = 'admin';
    const role = new NCMBRole;
    role
      .set('roleName', roleName);
    await role.save();
    assert.isTrue(!!role.get('objectId'));

    const query = NCMBRole.query();
    const role2 = await (query.equalTo('roleName', roleName).fetch()) as NCMBRole;

    assert.equal(role2.get('objectId'), role.get('objectId'))
    await role.delete();
  });

  it('Add role to role', async () => {
    const roleName = 'admin';
    const role = new NCMBRole;
    role
      .set('roleName', roleName);
    await role.save();
      assert.isTrue(!!role.get('objectId'));

    const role2 = new NCMBRole;
    role2
      .set('roleName', 'admin2');
    await role2.save();

    await role.addRole(role2).save();
    const query = NCMBRole.query();
    const role3 = await (query.equalTo('roleName', roleName).fetch()) as NCMBRole;
    const roles = await role3.fetchRole();
    assert.equal(role2.get('objectId'), roles[0].get('objectId'));
    await role.delete();
    await role2.delete();
  });

})