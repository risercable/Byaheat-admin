
import {take, map} from 'rxjs/operators';




import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.firebaseAuth.authState.pipe(
      map(authState => {
        // Check if the user is authenticated
        if (!authState) {
          // Redirect if not authenticated
          this.router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
        return true;
      }),
      take(1) // Ensure the observable completes after the first emission
    );
  }
}
