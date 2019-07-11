import DataStore from './DataStore.ts';

export default (ncmb :NCMB) => {
  class Role extends DataStore(ncmb, 'roles') {
    constructor() {
      super();
    }
  }
  return Role;
}
