import NCMB, { NCMBQuery, NCMBObject, NCMBAcl, NCMBRequest } from '..';
import FormData from 'form-data';
import { JsonObject, expoMediaFormat } from '../types/Misc';

class NCMBFile extends NCMBObject {
  static ncmb: NCMB;
  
  constructor() {
    super('files');
  }
  
  static query(): NCMBQuery {
    return new NCMBQuery('files');
  }

  static async upload(fileName: string, fileData: string | expoMediaFormat | Buffer, acl?: NCMBAcl, contentType?: string | null): Promise<NCMBFile> {
    const r = new NCMBRequest;
    try {
      const form = new FormData();
      if (fileData instanceof Buffer) {
        contentType = contentType || 'application/octet-stream';
        form.append('file', fileData, { contentType });
      } else if (typeof fileData === 'object') {
        form.append('file', {
          name: fileName,
          type: fileData.type,
          uri: fileData.uri
        });
      } else {
        form.append('file', fileData);
      }
      form.append('acl', JSON.stringify((acl || new NCMBAcl).toJSON()));
      const response = await r.post(NCMBFile.path(fileName), form);
      const json: JsonObject = await response.json();
      if (json.code) {
        // エラー
        throw new Error(`${json.code}: ${json.error}`);
      }
      const file = new NCMBFile;
      return file.sets(json) as NCMBFile;
    } catch (e) {
      throw e;
    }
  }

  async download(binary: boolean = false): Promise<any> {
    const r = new NCMBRequest;
    const response = await r.get(this.path());
    if (response.status > 400) {
      const json: JsonObject = await response.json();
      if (json.code) {
        // エラー
        throw new Error(`${json.code}: ${json.error}`);
      } else {
        throw new Error(`Server error ${response.status}`);
      }
    }
    return binary ? await response.blob() : await response.text();
  }

  static path(fileName: string): string {
    return `/${NCMB.version}/files/${fileName}`;
  }

  path(): string {
    return `/${NCMB.version}/files/${this.get('fileName')}`;
  }
}

export default NCMBFile;
