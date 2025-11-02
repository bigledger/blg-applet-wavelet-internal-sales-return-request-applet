import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {BehaviorSubject, Observable} from 'rxjs';

import {ApiVisa, AppLoginContainerModel, UserProfileService} from 'blg-akaun-ts-lib';
import {UserAuthService} from '../../../services/user-auth-service';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent implements OnInit, OnChanges {
  public config: PerfectScrollbarConfigInterface = {};
  profilepic: string;
  token: string;
  isLoggedIn: Observable<boolean>;
  apiVisa: ApiVisa = {
    tenantCode: 'tnt_hassan_code',
    jwt_secret: localStorage.getItem('authToken'),
  };
  @Input() loadingImage: string = 'https://media.giphy.com/media/y1ZBcOGOOtlpC/200.gif';
  profileContainerModel = new AppLoginContainerModel();
  subjectGuid;
  imageGuid;
  imageUrl: any;
  loading: boolean;

  // isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private router: Router,
    private toastr: ToastrService, private userAuthService: UserAuthService,
    private userProfileService: UserProfileService,
  ) {
    // >>>>> STOP THE CODE OF CHECKING EVERY 3 SEC AFTER STOP USING AUTH APPLET CUSTOM ELEMENT
    // this.isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
    // console.log('this.isLoggedIn: ', this.isLoggedIn);
    // this.isLoggedIn.subscribe((data) => {
    //   console.log('data....', data);
    //   if (data === false) {
    //     this.refreshData();
    //     // this.router.navigate(['/home']);
    //   }
    // });
    ///////////////////////////////////////////// <<<<<

  }

  ngOnInit() {
    this.loading=true;
    this.token = localStorage.getItem('authToken');

    this.userProfileService.get(this.apiVisa).subscribe((data: any) => {
      this.profileContainerModel = data.data;
      this.subjectGuid = this.profileContainerModel.appLoginSubject.guid;

      this.profileContainerModel.appLoginSubjectExtList.forEach((ext) => {
        // TODO add this to lib UserProfileConstants.USER_PROFILE_FILE
         if (ext.param_code === 'USER_PROFILE_FILE') {
          this.imageGuid = ext.guid;
          console.log(this.imageGuid);
          this.imageUrl = environment.api_domain + 'core2/platform/dm/identity/userprofile/photo/' + this.imageGuid;
        }
      });
    });
  }

  ngOnChanges() {
    // this.userAuthService.isLoggedIn().subscribe((data) => {
    //   console.log('The state has been changed ::', data, ' ::');
    // });
  }

  logOut() {
    console.log(this.router.url);
    localStorage.clear();
    // this.refreshData();
    // this.isLoggedIn.next(false);
    // this.userAuthService.isLoginSubject.next(false);
    // this.isLoggedIn.next(false);
    // localStorage.setItem('authToken', null);
    this.token = null;
    // this.router.navigate(['/'], { replaceUrl: true });
    this.router.navigateByUrl('/refresh', {skipLocationChange: true}).then(() =>
      this.router.navigate(['/']));
    // localStorage.removeItem(AppConfig.TOKEN_KEY);
  }

  userProfile() {
    this.router.navigateByUrl('/akaun-user-profile-applet/my-profile');
  }

  // This is for Notifications
  notifications: Object[] = [
    {
      round: 'round-danger',
      icon: 'ti-link',
      title: 'Launch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    },
    {
      round: 'round-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    },
    {
      round: 'round-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    },
    {
      round: 'round-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  redirectTo() {
    this.router.navigate(['lazy']);
  }

  @Input()
  set message(message: string) {
    console.log('>>>>>??? ', message);

  }
  get message(): string {
    console.log('>>>>> ', this._message)
    return this._message;
  }
  _message: string;

  refreshData() {
    const timerId = setInterval(() => {
      console.log('...');
      this.isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
      this.isLoggedIn.subscribe((data) => {
        console.log('Authorized....', data);
        if (data === true) {
          setTimeout(() => { clearInterval(timerId); console.log('we stopped'); });
          this.router.navigate(['/']);
        }
      });
      }, 3000);

    // setTimeout(this.refreshData(), x*1000);
    // setTimeout(() => { clearInterval(timerId); alert('stop'); }, 5000);
  }

  private hasToken(): boolean {
    if (localStorage.getItem('authToken')) {
      // console.log('hasToken: True');
      return true;
      // this.router.navigate(['/']);
    } else {
      // console.log('hasToken: False');
      return false;
    }
    // return localStorage.getItem('authToken');
  }

  hideLoader() {
    this.loading = false;
  }
}
