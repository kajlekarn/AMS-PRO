import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      if (state.url === '/login') {
        // If trying to access login page while authenticated, redirect to dashboard
        this.router.navigate(['/dashboard']);
        return false;
      }
      return true;
    } else {
      if (state.url !== '/login') {
        // If not authenticated and trying to access a protected route, redirect to login
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
      }
      return true;
    }
  }
}
