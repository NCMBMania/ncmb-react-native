import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import NCMB, { NCMBScript } from '../index';
import config from './config.json';

describe('Script API', () => {
  before('Init', () => {
    new NCMB(config.applicationKey, config.clientKey);
  });

  it('GET request', async () => {
    const script = new NCMBScript('get.js', 'GET');
    const json = await script
      .header('test-header', 'test-header-value')
      .headers({
        'NCMB-ANOTHER-HEADER1': 'NCMB-ANOTHER-VALUE1',
        'NCMB-ANOTHER-HEADER2': 'NCMB-ANOTHER-VALUE2'
      })
      .query('a', 'b')
      .queries({
        c: 'd',
        e: 'f'
      })
      .execute();
    assert.equal(Object.keys(json.query).length, 3);
    assert.equal(json.query.a, 'b');
    assert.equal(json.headers['test-header'], 'test-header-value');
    assert.equal(json.headers['ncmb-another-header1'], 'NCMB-ANOTHER-VALUE1');
    assert.equal(json.headers['ncmb-another-header2'], 'NCMB-ANOTHER-VALUE2');
  });

  it('POST request', async () => {
    const script = new NCMBScript('post.js', 'POST');
    const json = await script
      .header('test-header', 'test-header-value')
      .headers({
        'NCMB-ANOTHER-HEADER1': 'NCMB-ANOTHER-VALUE1',
        'NCMB-ANOTHER-HEADER2': 'NCMB-ANOTHER-VALUE2'
      })
      .body('g', ['h', 'i'])
      .bodies({
        j: ['k', 'l'],
        m: 100
      })
      .execute();
    assert.equal(Object.keys(json.body).length, 3);
    assert.equal(JSON.stringify(json.body.g), JSON.stringify(['h', 'i']));
    assert.equal(json.headers['test-header'], 'test-header-value');
    assert.equal(json.headers['ncmb-another-header1'], 'NCMB-ANOTHER-VALUE1');
    assert.equal(json.headers['ncmb-another-header2'], 'NCMB-ANOTHER-VALUE2');
  });

  it('PUT request', async () => {
    const script = new NCMBScript('put.js', 'PUT');
    const json = await script
      .header('test-header', 'test-header-value')
      .headers({
        'NCMB-ANOTHER-HEADER1': 'NCMB-ANOTHER-VALUE1',
        'NCMB-ANOTHER-HEADER2': 'NCMB-ANOTHER-VALUE2'
      })
      .body('g', ['h', 'i'])
      .bodies({
        j: ['k', 'l'],
        m: 100
      })
      .execute();
    assert.equal(Object.keys(json.body).length, 3);
    assert.equal(JSON.stringify(json.body.g), JSON.stringify(['h', 'i']));
    assert.equal(json.headers['test-header'], 'test-header-value');
    assert.equal(json.headers['ncmb-another-header1'], 'NCMB-ANOTHER-VALUE1');
    assert.equal(json.headers['ncmb-another-header2'], 'NCMB-ANOTHER-VALUE2');
  });

  it('DELETE request', async () => {
    const script = new NCMBScript('delete.js', 'DELETE');
    const json = await script
      .header('test-header', 'test-header-value')
      .headers({
        'NCMB-ANOTHER-HEADER1': 'NCMB-ANOTHER-VALUE1',
        'NCMB-ANOTHER-HEADER2': 'NCMB-ANOTHER-VALUE2'
      })
      .execute();
    assert.equal(json.headers['test-header'], 'test-header-value');
    assert.equal(json.headers['ncmb-another-header1'], 'NCMB-ANOTHER-VALUE1');
    assert.equal(json.headers['ncmb-another-header2'], 'NCMB-ANOTHER-VALUE2');
  });
});