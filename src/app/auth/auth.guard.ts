
import {take, map, switchMap} from 'rxjs/operators';




import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {of} from 'rxjs/internal/observable/of';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredRole = next.data['role'];
    const loginPath = next.data['loginPath'] || '/login';

    return this.authService.firebaseAuth.authState.pipe(
      take(1),
      switchMap((authState): Observable<boolean> => {
        if (!authState) {
          this.router.navigate([loginPath], { queryParams: { returnUrl: state.url } });
          return of(false);
        }
        if (requiredRole) {
          return this.authService.getUserRole(authState.uid).pipe(
            map((role: string): boolean => {
              if (role !== requiredRole) {
                this.router.navigate([loginPath]);
                return false;
              }
              return true;
            })
          );
        }
        return of(true);
      })
    );
  }
}
