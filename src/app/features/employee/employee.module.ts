import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EmployeeRoutingModule } from './employee-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { LeaveRequestComponent } from './components/leave-request/leave-request.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DocumentService } from './services/document.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmployeeRoutingModule,
    SharedModule,
    AttendanceComponent,
    LeaveRequestComponent,
    ProfileComponent  // Import ProfileComponent as a standalone component
  ],
  providers: [DocumentService]
})
export class EmployeeModule { }