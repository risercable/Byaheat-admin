import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';
import { AuthService } from '../auth.service';
import {Router} from '@angular/router';
import {GlobalDataService} from '../global-data.service';

@Component({
  selector: 'app-driver-exist',
  templateUrl: './driver-exist.component.html',
  styleUrls: ['./driver-exist.component.css']
})
export class DriverExistComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private appComponent: AppComponent,
    private authService: AuthService,
    public router: Router,
    private globalDataService: GlobalDataService
  ) {
    this.appComponent.showNavbar = false;
   }

  ngOnInit() {
  }

  onLogin() {
    const variables = {
      email: this.email,
      password: this.password
    };

    this.authService.loginUser(variables).subscribe((response) => {
        this.globalDataService.setUser(response);
        void this.router.navigate(['/profile']); // navigateByUrl > navigate for simple string paths
      },
      (error) => {
      }
    );
  }

}
