
import {tap, map} from 'rxjs/operators';




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
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.firebaseAuth.authState.pipe(
      map(authState => !!authState),
      tap(authenticated => {
        if (!authenticated) {
            this.router.navigate(['/login']);
        }
      }),);
  }
}
