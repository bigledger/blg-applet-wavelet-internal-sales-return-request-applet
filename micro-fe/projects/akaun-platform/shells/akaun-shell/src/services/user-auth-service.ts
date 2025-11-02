import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private router: Router) {

  }

  /**
   * if we have token the user is loggedIn
   * @returns {boolean}
   */
  private hasToken(): boolean {
    if (localStorage.getItem('authToken')) {
      console.log('hasToken: True');
      return true;
      // this.router.navigate(['/']);
    } else {
      console.log('hasToken: False');
      return false;
    }
    // return localStorage.getItem('authToken');
  }

  /**
   *
   * @returns {Observable<T>}
   */
  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }
}
