import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class AppSidebarComponent implements OnDestroy, OnInit {

  constructor(
  ) {

  }
  ngOnInit() {}

  ngOnDestroy(): void {
  }
}
