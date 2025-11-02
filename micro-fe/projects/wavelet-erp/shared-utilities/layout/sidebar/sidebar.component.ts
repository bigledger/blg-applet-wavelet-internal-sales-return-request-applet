import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SessionSelectors } from '../../session-controller/store/selectors';
import { SessionStates } from '../../session-controller/store/states';
import {animateText, onSideNavChange} from '../animations/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [onSideNavChange, animateText]
})
export class AppSidebarComponent implements OnInit {

  @Input() appletName: string;
  @Input() opened: boolean;
  @Input() logoBgColor$: Observable<{background: string}>;
  @Input() sidebarBgColor$: Observable<{background: string}>;
  @Input() menuItems;
  @Input() mainPath: string;

  @Output() toggle = new EventEmitter<boolean>();
  src$ = this.store.select(SessionSelectors.selectAvatar);

  constructor(private readonly store: Store<SessionStates>) {}

  ngOnInit() {}

  onToggle() {
    this.toggle.emit(!this.opened);
  }
}
