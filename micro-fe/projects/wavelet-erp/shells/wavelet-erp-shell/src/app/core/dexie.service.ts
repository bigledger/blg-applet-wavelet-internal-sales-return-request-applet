import Dexie from 'dexie';

export class DexieService extends Dexie {
  constructor(email: String) {
    super('SHELL_' + email);
    this.version(1).stores({
      active_user: '++id, email, token, applet',
    });
  }
}
