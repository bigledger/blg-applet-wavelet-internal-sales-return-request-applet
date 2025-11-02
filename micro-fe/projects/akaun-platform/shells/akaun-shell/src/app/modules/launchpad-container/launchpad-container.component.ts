import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

// TODO add this to the Lib
import {UserAuthService} from '../../../services/user-auth-service';

@Component({
  selector: 'app-launchpad-applet',
  templateUrl: './launchpad-container.component.html',
  styleUrls: ['./launchpad-container.component.scss']
})
export class LaunchpadContainerComponent implements OnInit {

  launchpadPanal = 'Default';
  seasons: string[] = ['Default', 'Celmonze'];
  constructor(private router: Router, private route: ActivatedRoute, private userAuthService: UserAuthService) {
    userAuthService.isLoginSubject.next(false);

  }

  ngOnInit() {
  }

  changeLaunchpadPanal() {
    console.log('changeLaunchpadPanal: ', this.launchpadPanal);
    if (this.launchpadPanal === 'Default') {
      console.log('navigateByUrl');
      this.router.navigate(['default-panel'], { relativeTo: this.route });
    } else if (this.launchpadPanal ===  'Celmonze') {
      this.router.navigate(['celmonze-panel'], { relativeTo: this.route });
    }
  }

}
