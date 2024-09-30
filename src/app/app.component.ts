import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './features/navbar/navbar.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RouterLink } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoginPage: boolean = false;
  isSidebarCollapsed: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.urlAfterRedirects === '/login';
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.authService.isAuthenticated()) {
          window.history.pushState(null, '', window.location.href);
        }
      }
    });

    window.onpopstate = () => {
      if (this.authService.isAuthenticated()) {
        window.history.pushState(null, '', window.location.href);
      }
    };
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSidebarToggled(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}