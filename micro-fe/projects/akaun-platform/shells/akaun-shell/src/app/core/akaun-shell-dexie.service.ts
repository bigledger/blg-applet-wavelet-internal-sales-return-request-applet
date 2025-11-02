import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import {DexieService} from './dexie.service';

@Injectable()
export class AkaunShellDexieService {
  table: Dexie.Table<ActiveUser, number>;
  dexieService;
  dbName = 'SHELL';

  constructor() {
  }

  getAll() {
    return this.table.toArray();
  }

  add(data) {
    return this.table.add(data);
  }

  update(id, data) {
    return this.table.update(id, data);
  }

  remove(id) {
    return this.table.delete(id);
  }

  setDbName(email: string) {
    this.dbName += '_' + email;
  }

  getDbName() {
    return this.dbName;
  }

  createDB(email: string, token: string, applet: string) {
    console.log('I will try to create-group service');
    this.dexieService = new DexieService(email);
    this.table = this.dexieService.table('active_user');
    this.table.add({email: email, token: token, applet: applet});
  }
}

export interface ActiveUser {
  email: string;
  token: string;
  applet: string;
}
