import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import NCMB, { NCMBObject, NCMBQuery, NCMBUser } from '../index';
import config from './config.json';
import { LocalStorage } from 'node-localstorage';

describe('User API', () => {
  before('Init', async () => {
    const ncmb = new NCMB(config.applicationKey, config.clientKey);
    ncmb.storage = new LocalStorage('./scratch');
  });

  it('Register user', async () => {
    const user = new NCMBUser;
    user
      .set('userName', 'tester')
      .set('password', 'tester');
    await user.signUpByAccount();
    assert.isTrue(!!user.get('objectId'));
    await user.delete();
    NCMBUser.logout();
  });

  it('Request sign up email', async () => {
    await NCMBUser.logout();
    // const bol = await NCMBUser.requestSignUpEmail(`tester-${Math.random().toString(32).substring(2)}@${config.test.domain}`);
    // assert.isTrue(bol);
  });

  it('Login with userName and password', async () => {
    const user = new NCMBUser;
    user
      .set('userName', 'tester')
      .set('password', 'tester');
    await user.signUpByAccount();
    const user2 = await NCMBUser.login('tester', 'tester');
    assert.equal(user.get('objectId'), user2.get('objectId'));
    await user2.delete();
    NCMBUser.logout();
  });

  it('Login with mailAddress and password', async () => {
    await NCMBUser.logout();
    const user = await NCMBUser.loginWithMailAddress(config.test.emailAddress, config.test.password);
    assert.isTrue(!!user.get('objectId'));
    NCMBUser.logout();
  });

  it('Re-use login data from localStorage', async () => {
    const tmpUser = await NCMBUser.loginWithMailAddress(config.test.emailAddress, config.test.password);
    NCMBUser.ncmb.sessionToken = null;
    const user = await NCMBUser.currentUser();
    if (user === null) return;
    assert.equal(user.get('objectId'), tmpUser.get('objectId'));
    NCMBUser.logout();
  });

  it('Login as anonymous', async () => {
    const user = await NCMBUser.loginAsAnonymous();
    assert.isTrue(!!user.get('objectId'));
    await user.delete();
  })
})