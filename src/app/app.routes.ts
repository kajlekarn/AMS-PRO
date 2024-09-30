import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AttendanceComponent } from './features/attendance/attendance.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'attendance', component: AttendanceComponent, canActivate: [AuthGuard] },
  // Other routes protected by AuthGuard
  // { path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard] },
  // { path: 'attendance', component: AttendanceComponent, canActivate: [AuthGuard] },
  // { path: 'leave', component: LeaveComponent, canActivate: [AuthGuard] },
  // { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  // { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
];