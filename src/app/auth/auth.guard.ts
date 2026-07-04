import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { GlobalDataService } from '../global-data.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private globalDataService: GlobalDataService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredRole = next.data['role'];
    const loginPath = next.data['loginPath'] || '/login';

    const user = this.globalDataService.getUser();

    if (!user) {
      void this.router.navigate([loginPath], { queryParams: { returnUrl: state.url } });
      return of(false);
    }

    if (requiredRole) {
      const role = (user.driverData && user.driverData.role) || user.role;
      if (role !== requiredRole) {
        void this.router.navigate([loginPath]);
        return of(false);
      }
    }

    return of(true);
  }
}
