import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router'
@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: []
})
export class AppBlankComponent implements OnInit {
  token: string;
  constructor(
    private route: Router
  ) {}
  ngOnInit() {
    // this.token = localStorage.getItem('authToken');
    // console.log('Blank Page get authToken:::', this.token);
    // if (!this.token) {
    //   this.route.navigate(['./iam/login']);
    // }
  }
}
