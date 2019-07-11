export default class Acl {
  private fields: object;
  constructor() {
    this.fields = {};
  }
  
  set(target: string, action: string, bol: boolean): Acl {
    if (!this.fields[target])
      this.fields[target] = {};
    this.fields[target][action] = bol;
    return this;
  }
  
  setPublicReadAccess(bol: boolean): Acl {
    return this.set('*', 'read', bol);
  }
  
  setPublicWriteAccess(bol: boolean): Acl {
    return this.set('*', 'write', bol);
  }
  
  setUserReadAccess(user: User, bol: boolean): Acl {
    return this.set(user.get('objectId'), 'read', bol);
  }
  
  setUserWriteAccess(user: User, bol: boolean): Acl {
    return this.set(user.get('objectId'), 'write', bol);
  }
  
  setRoleReadAccess(role: Role, bol: boolean): Acl {
    return this.set(role.get('roleName'), 'read', bol);
  }
  
  setRoleWriteAccess(): Acl {
    return this.set(role.get('roleName'), 'write', bol);
  }
  
  toJSON(): object {
    const json: object = {};
    for(let target in this.fields){
      const targetJSON: object = {};
      if (this.fields[target].read) targetJSON.read = true;
      if (this.fields[target].write) targetJSON.write = true;
      json[target] = targetJSON;
    }
    return json;
  }
}
