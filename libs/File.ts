import NCMB, { NCMBQuery, NCMBObject, NCMBAcl, NCMBRequest } from '../index';
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
      /* @ts-ignore */
      if (typeof fileData === 'object' && fileData.uri && fileData.uri.match(/^file:\/\//)) {
        form.append('file', fileData);
      /* @ts-ignore */
      } else if (typeof fileData === 'object' && fileData.uri && fileData.uri.match(/^data:/)) {
        /* @ts-ignore */
        const file = await fetch(fileData.uri);
        const blob = await file.blob();
        form.append('file', blob);
      } else if (fileData instanceof Buffer) {
        contentType = contentType || 'application/octet-stream';
        form.append('file', fileData, { contentType });
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

  async download(fileType: string = 'text'): Promise<any> {
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
    switch (fileType.toUpperCase()) {
      case 'TEXT':
        return await response.text();
      case 'BINARY':
        return await response.blob();
      case 'DATAURI':
        return await this.getDataUri(await response.blob());
    }
  }

  private getDataUri(blob: Blob) {
    return new Promise((res, _) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        res(reader.result);
      }
      reader.readAsDataURL(blob);
    });
  }
  static path(fileName: string): string {
    return `/${NCMB.version}/files/${fileName}`;
  }

  path(): string {
    return `/${NCMB.version}/files/${this.get('fileName')}`;
  }
}

export default NCMBFile;
