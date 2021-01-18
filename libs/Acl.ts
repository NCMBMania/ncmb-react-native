import {NCMBUser, NCMBRole} from '..'
import { NCMBAclFormat, NCMBAclFormatKey } from '../types/Misc';

class NCMBAcl {
  private fields: NCMBAclFormat;
  constructor() {
    this.fields = {}
  }
    
  set(target: string, action: string, bol: boolean): NCMBAcl {
    if (typeof target !== 'string') throw new Error('target has to be string');
    if (!this.fields[target])
      this.fields[target] = {};
    this.fields[target][action] = bol;
    return this;
  }

  sets(obj: NCMBAclFormat): NCMBAcl {
    for (const key in obj) {
      if (key === '*') {
        this.setsPublicAccess(key, obj[key]);
        continue;
      }
      const m = key.match(/^role:(.*?)$/);
      if (m) {
        this.setsRoleAccess(m[1], obj[key]);
        continue;
      }
      this.setsUserAccess(key, obj[key]);
    }
    return this;
  }

  private setsPublicAccess(key: string, access: NCMBAclFormatKey): NCMBAcl {
    if (access.read) this.setPublicReadAccess(true);
    if (access.write) this.setPublicWriteAccess(true);
    return this;
  }

  private setsRoleAccess(roleName: string, access: NCMBAclFormatKey): NCMBAcl {
    const role = new NCMBRole();
    role.set('roleName', roleName);
    if (access.read) this.setRoleReadAccess(role, true);
    if (access.write) this.setRoleReadAccess(role, true);
    return this;
  }
  
  private setsUserAccess(key: string, access: NCMBAclFormatKey): NCMBAcl {
    const user = new NCMBUser;
    user.set('objectId', key);
    if (access.read) this.setUserReadAccess(user, true);
    if (access.write) this.setUserWriteAccess(user, true);
    return this;
  }

  setPublicReadAccess(bol: boolean): NCMBAcl {
    return this.set('*', 'read', bol);
  }
  
  setPublicWriteAccess(bol: boolean): NCMBAcl {
    return this.set('*', 'write', bol);
  }
  
  setUserReadAccess(user: NCMBUser, bol: boolean): NCMBAcl {
    return this.set(user.get('objectId'), 'read', bol);
  }
  
  setUserWriteAccess(user: NCMBUser, bol: boolean): NCMBAcl {
    return this.set(user.get('objectId'), 'write', bol);
  }
  
  setRoleReadAccess(role: NCMBRole, bol: boolean): NCMBAcl {
    return this.set(role.get('roleName'), 'read', bol);
  }
  
  setRoleWriteAccess(role: NCMBRole, bol: boolean): NCMBAcl {
    return this.set(role.get('roleName'), 'write', bol);
  }
  
  toJSON(): object {
    const json: NCMBAclFormat = {};
    if (Object.keys(this.fields).length === 0) {
      this.setPublicReadAccess(true);
      this.setPublicWriteAccess(true);
    }
    for(let target in this.fields){
      const targetJSON: NCMBAclFormatKey = {};
      if (this.fields[target].read) targetJSON.read = true;
      if (this.fields[target].write) targetJSON.write = true;
      if (Object.keys(targetJSON).length > 0) {
        json[target] = targetJSON;
      }
    }
    return json;
  }
}

export default NCMBAcl;
