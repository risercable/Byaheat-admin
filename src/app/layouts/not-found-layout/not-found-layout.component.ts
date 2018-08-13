import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found-layout',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class NotFoundLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
