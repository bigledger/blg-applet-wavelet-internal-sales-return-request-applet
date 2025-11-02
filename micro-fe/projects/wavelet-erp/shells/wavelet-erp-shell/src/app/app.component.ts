import {Component, Input} from '@angular/core';
import {ConnectionService} from 'ng-connection-service';
import {ToastrService} from 'ngx-toastr';
// import '../../../../../../elements/akaun-platform/applets/auth-applet/auth-applet-elements.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  status = 'ONLINE';
  isConnected = true;

  title = 'example-shell';

  constructor(private connectionService: ConnectionService, private toastrService: ToastrService) {
    this.checkInternetAvailability();
  }

  @Input()
  set message(message: string) {
    console.log('tryyyyyy: ', message);

  }
  get message(): string { return this._message; }
  _message: string;

  checkInternetAvailability() {
    let status = 'ONLINE';
    let isConnected = true;
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (isConnected) {
        status = 'ONLINE';
      } else {
        status = 'OFFLINE';
      }

      // TODO add notification component to the lib
      if (status === 'ONLINE') {
        this.toastrService.success('You are ' + status, '', {
          tapToDismiss: true, progressBar: true, timeOut: 1300
        });
      }

      if (status === 'OFFLINE') {
        this.toastrService.warning('You are ' + status, '', {
          tapToDismiss: true, progressBar: true, timeOut: 2000
        });
      }
    });
  }
}
