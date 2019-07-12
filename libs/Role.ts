import DataStore from './DataStore.ts';

export default (ncmb :NCMB) => {
  class Role extends DataStore(ncmb, 'roles') {
    public className: string;
    public users: [User];
    public roles: [Role];
    
    constructor() {
      super();
      this.className = 'role';
      this.users = [];
      this.roles = [];
    }
    
    addUser(user: User): Role {
      this.users.push(user);
      return this;
    }
    
    convert(name: string): object {
      const belongType: string = `belong${name}`;
      const lowerName: string = `${name.toLowerCase()}s`;
      const json: object = {};
      this[lowerName].forEach(obj => {
        if (!json[belongType]) {
          json[belongType] = {
            '__op': 'AddRelation',
            'objects': []
          };
        }
        json[belongType].objects.push({
          '__type': 'Pointer',
          'className': name.toLowerCase(),
        'objectId': obj.get('objectId')
        });
      });
      return json[belongType];
    }
    
    toJSON(): object {
      const json: object = super.toJSON();
      if (this.users.length > 0) json.belongUser = this.convert('User');
      if (this.roles.length > 0) json.belongRole = this.convert('Role');
      return json;
    }
  }
  return Role;
}
