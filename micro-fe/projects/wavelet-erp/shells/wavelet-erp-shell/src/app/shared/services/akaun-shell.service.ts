import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class AkaunShellService {
  token: string;
  constructor(private router: Router) {

  }

  setToken(token: string) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }
}
