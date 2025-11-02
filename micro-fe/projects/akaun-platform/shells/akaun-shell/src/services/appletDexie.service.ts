import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import {DexieService} from '../app/core/dexie.service';

@Injectable( {providedIn: 'root'})
export class IamDexieService {
  table: Dexie.Table<any>;
  dexieService;

  constructor() {
  }

  async get(data: string) {
    let code = '';
    this.table = this.dexieService.table('applet_settings');
    await this.table.get(data).then((value: any) =>  {
      code = value.tenantCode;
    });
    return code;
  }

  getAll() {
    this.table = this.dexieService.table('applet_settings');
    return this.table.toArray();
  }

  add(code: string, data: string) {
    this.table.add({tenantCode: code}, data);  }

  put(code: string , data: string) {
    this.table = this.dexieService.table('applet_settings');
    return this.table.put({tenantCode: code}, data);
  }

  initialiseDB(code: string) {
    this.dexieService = new DexieService(code);
    this.table = this.dexieService.table('applet_settings');
  }
}
