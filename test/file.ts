import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import NCMB, { NCMBRole, NCMBUser, NCMBFile } from '../index';
import config from './config.json';
import fs from 'fs';
import { promisify } from 'util';
import NCMBAcl from '../libs/Acl';
describe('Managing File', () => {
  before('Init', async function() {
    new NCMB(config.applicationKey, config.clientKey);
  });

  it('Upload text as text file', async () => {
    const fileName = 'test.csv';
    const file = await NCMBFile.upload(fileName, '1,2,3');
    assert.equal(fileName, file.get('fileName'));
  });

  it('Upload binary from local file', async function () {
    this.timeout(100000);
    const fileName = 'test.jpg';
    const blob = await promisify(fs.readFile)(`./test/${fileName}`);
    const file = await NCMBFile.upload(fileName, blob);
    assert.equal(fileName, file.get('fileName'));
  });

  it('Upload file and delete it', async () => {
    const fileName = 'test.csv';
    const file = await NCMBFile.upload(fileName, '1,2,3');
    assert.equal(fileName, file.get('fileName'));
    await file.delete();
  });

  it('Upload text and download it', async () => {
    const text = '1,2,3';
    const fileName = 'test.csv';
    const file = await NCMBFile.upload(fileName, text);
    assert.equal(fileName, file.get('fileName'));
    const download = await file.download();
    assert.equal(text, download);
  });
  
  it('Upload binary file and download it', async function() {
    this.timeout(100000);
    const fileName = 'test.jpg';
    const blob = await promisify(fs.readFile)(`./test/${fileName}`);
    const file = await NCMBFile.upload(fileName, blob);
    assert.equal(fileName, file.get('fileName'));
    const download = await file.download(true) as Blob;
    assert.equal(download.type, 'image/jpeg');
  });

  it('Retribute files', async function() {
    const query = NCMBFile.query();
    const files = await query.fetchAll();
    assert.isTrue(files[0] instanceof NCMBFile);
  });

  it('Delete all files', async () => {
    const query = NCMBFile.query();
    const files = await query.fetchAll();
    const promises = [];
    files.forEach(f => promises.push(f.delete()));
    await Promise.all(promises);
    const count = await query.fetchAll();
    assert.equal(count.length, 0);
  });

  it('Upload several files', async () => {
    const promises = [];
    for (let i = 0; i < 3; i++) {
      promises.push(NCMBFile.upload(`${i}.txt`, `Hello, #${i}`));
    }
    for (let i = 0; i < 3; i++) {
      promises.push(NCMBFile.upload(`${i}.csv`, `${i},2,3`));
    }
    await Promise.all(promises);
    const query = NCMBFile.query();
    const files = await query.fetchAll();
    assert.equal(files.length, 6);
    const files2 = await query.regularExpressionTo('fileName', /^.*?\.txt/).fetchAll();
    assert.equal(files2.length, 3);
    const files3 = await query.greaterThan('fileSize', 8).fetchAll();
    assert.equal(files3.length, 3);
    const deletes = [];
    files.forEach(f => deletes.push(f.delete()));
    await Promise.all(deletes);
  });

  it('Upload file with ACL', async () => {
    const userNameAndPassword = 'tester';
    const user = new NCMBUser;
    user.set('userName', userNameAndPassword).set('password', userNameAndPassword );
    await user.signUpByAccount();
    await NCMBUser.login(userNameAndPassword, userNameAndPassword);
    const loginUser = await NCMBUser.currentUser();
    if (!loginUser) throw new Error('Login failed');
    const acl = new NCMBAcl;
    acl
      .setPublicReadAccess(false)
      .setUserWriteAccess(loginUser, true)
      .setUserReadAccess(loginUser, true);
    const text = '1,2,3';
    const fileName = 'acl2.csv';
    const file = await NCMBFile.upload(fileName, text, acl);

    const sessionToken = NCMBUser.ncmb.sessionToken;
    NCMBUser.ncmb.sessionToken = null;
    try {
      const file = new NCMBFile;
      file.set('fileName', fileName);
      await file.download();
      assert.isTrue(false);
    } catch (e) {
      assert.equal(e.message, 'E403001: No access with ACL.');
    }
    NCMBUser.ncmb.sessionToken = sessionToken;
    const download = await file.download();
    assert.equal(text, download);
    file.delete();
    loginUser.delete();
    NCMBUser.logout();
  });
});
