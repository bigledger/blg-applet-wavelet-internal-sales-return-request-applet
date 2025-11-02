import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class TenantService {
  static tenantCode = 'tnt_hassan_code';
  tenant = '';

  constructor(private http: HttpClient) { }
  getCode() {
    return this.tenant;
  }

  setCode(nm: string) {
    this.tenant = nm;
  }
}
