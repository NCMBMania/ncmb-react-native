import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import NCMB, { NCMBObject, NCMBQuery } from '../index';
import config from './config.json';

describe('Save Data', () => {
  before('Init', async () => {
    new NCMB(config.applicationKey, config.clientKey);
    
  });
  it('', () => {

  })
})