import NCMBObject from './Object';

class NCMBFile extends NCMBObject {
  static ncmb: NCMB;
  
  public className;

  constructor() {
    super('files');
    this.className = 'file';
    this.data = null;
  }
  
  async upload(fileName: string, fileData: any, acl: Acl): Boolean {
    const r = ncmb.Request();
    try {
      this.fields.objectId = fileName;
      const form = new FormData();
      if (typeof fileData === 'object') {
        form.append('file', {
          name: fileName,
          type: fileData.type,
          uri: fileData.uri
        });
      } else {
        form.append('file', fileData);
      }
      form.append('acl', JSON.stringify((acl || ncmb.Acl.default()).toJSON()));
      const response: Respose = await r.post(this.path(), form);
      const json: Object = await response.json();
      if (json.code) {
        // エラー
        throw new Error(`${json.code}: ${json.error}`);
      }
      Object.keys(json).forEach(key => {
        this.set(key, json[key]);
      });
      return true;
    } catch (e) {
      throw e;
    }
  }
}

export default NCMBFile;
