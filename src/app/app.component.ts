import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import angularLoad from 'angular-load';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  showNavbar: boolean = true;

  constructor() {
    localStorage.removeItem('firebase:previous_websocket_failure');
  }
}
