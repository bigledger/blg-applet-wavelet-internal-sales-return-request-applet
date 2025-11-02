import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private route: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
    // TODO samira check if user is login or not from the server or indexdb
    if(localStorage.getItem('authToken')){
      return true;
    }else {
      this.route.navigateByUrl('auth/login');
      return false;
    }

    // TODO later might check permission for this applet or user

    // if (user.isAuthenticated()) {
    //   console.log('User login');
    //   return true;
    //
    // } else {
    //   console.log('User is not login, redirect to login page');
    //   this.route.navigateByUrl('/login');
    //   return false;
    // }
  }

}
