// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User as UserModel } from '../models/user.model';
import { environment } from '../../../environments/environment';

interface User {
  id: string; // or number, depending on your API response
  username: string;
  role: string; // Add this line
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<boolean> {
    // Check for default admin credentials
    if (username === 'admin123' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin123',
        username: 'admin123',
        role: 'ADMIN',
        token: 'fake-jwt-token'
      };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      this.currentUserSubject.next(adminUser);
      return of(true);
    }

    // Proceed with actual API call for other credentials
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        map(user => {
          if (user && user.token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return true;
          }
          return false;
        }),
        catchError(() => of(false))
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    
    // Clear browser history
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, '', window.location.href);
    };
  }

  isAuthenticated(): boolean {
    // return !!this.currentUserValue && !!this.currentUserValue.token;
     // Check if there's a valid token or user session
     return !!localStorage.getItem('currentUser');
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserValue;
    return user ? roles.includes(user.role) : false;
  }

  getToken(): string | null {
    return this.currentUserValue ? this.currentUserValue.token : null;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}