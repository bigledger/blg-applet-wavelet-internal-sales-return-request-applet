import {Compiler, Component, Input} from '@angular/core';
import {ConnectionService} from 'ng-connection-service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {AppletLoaderModule} from './modules/applet-loader/applet-loader.module';
import {StorgeEnum} from './models/storge.enum';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  status = 'ONLINE';
  isConnected = true;

  title = 'example-shell';

  constructor(private connectionService: ConnectionService,
              private toastrService: ToastrService,
              private compiler: Compiler,
              private router: Router
  ) {

    console.log('this.router.config constructor=============', this.router.config);
    const sub = this.router.events.subscribe(async routerEvent => {
      // console.log('routerEvent==000===', routerEvent);


      const es_module_url = sessionStorage.getItem(StorgeEnum.es_module_url);
      const appletMFTag = sessionStorage.getItem(StorgeEnum.appletMFTag);
      const routerLink = sessionStorage.getItem(StorgeEnum.routerLink);

      if (es_module_url && appletMFTag && routerLink) {
        sub.unsubscribe();
        console.log('es_module_url: ', es_module_url);
        console.log('appletMFTag: ', appletMFTag);
        this.createDynamicRoute(es_module_url, appletMFTag, routerLink);
        console.log('routerEvent===111==', routerEvent);
      }
    });
    this.checkInternetAvailability();
  }

  _message: string;

  get message(): string {
    return this._message;
  }

  @Input()
  set message(message: string) {
    console.log('tryyyyyy: ', message);

  }

  createDynamicRoute(es_module_url, appletMFTag, routerLink) {
    console.log('createDynamic');
    const appRoutes = [...this.router.config];
    appRoutes[0].children.forEach((appletRoute) => {
      if (appletRoute.data && appletRoute.data.appletLoader) {
        console.log('appletRoute.path');
        appletRoute.path = routerLink;
        console.log('appletRoute.path updated');
      }
    });

    this.router.resetConfig(appRoutes);
    this.router.navigate([routerLink]);

  }

  checkInternetAvailability() {
    let status = 'ONLINE';
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
