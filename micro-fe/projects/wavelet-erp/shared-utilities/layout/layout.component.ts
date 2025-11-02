import {MediaMatcher} from '@angular/cdk/layout';
import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { SideNavActions } from '../application-controller/store/actions';
import { SideNavSelectors } from '../application-controller/store/selectors';
import { AppStates } from '../application-controller/store/states';
import {onMainContentChange, onSideNavChange} from './animations/animations';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [onMainContentChange, onSideNavChange],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit {

  @Input() appletName: string;
  @Input() menuItems;
  @Input() mainPath: string;

  onSideNavChange: boolean;
  sideNavState$: Observable<boolean>;
  linkText: any;
  mobileQuery: MediaQueryList;
  dir = 'ltr';
  // logoBgColor$ = this.store.select(PersonalizationSelectors.selectLogoBgColor);
  // sidebarBgColor$ = this.store.select(PersonalizationSelectors.selectSidebarBgColor);

  constructor(
    media: MediaMatcher,
    private readonly store: Store<AppStates>
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 960px)');
  }

  ngOnInit() {
    this.sideNavState$ = this.store.select(SideNavSelectors.selectOpened);
    document.body.appendChild(document.getElementById('snav-hamburger'));
  }

  onToggle(toggle: boolean) {
    this.store.dispatch(SideNavActions.toggleSideNav({toggle}));
  }
}
