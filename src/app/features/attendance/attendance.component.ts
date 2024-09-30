import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ManualEntryModalComponent } from './manual-entry-modal/manual-entry-modal.component';
import { ShiftChangeModalComponent } from './shift-change-modal/shift-change-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  private dialogRef: MatDialogRef<ManualEntryModalComponent> | null = null;
  attendanceData: any[] = [];
  filteredData: any[] = [];
  currentDate: Date = new Date();
  searchTerm: string = '';
  statusFilter: string = 'All';

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.loadAttendanceData();
    this.applyFilters();
  }

  loadAttendanceData() {
    // TODO: Replace this with an API call to fetch real attendance data
    this.attendanceData = [
      { id: 1, employeeId: 'EMP001', name: 'John Doe', department: 'IT', clockIn: '09:00', clockOut: '17:00', totalHours: 8, status: 'Present' },
      { id: 2, employeeId: 'EMP002', name: 'Jane Smith', department: 'HR', clockIn: '08:45', clockOut: '16:45', totalHours: 8, status: 'Present' },
      { id: 3, employeeId: 'EMP003', name: 'Mike Johnson', department: 'Finance', clockIn: '09:15', clockOut: '17:30', totalHours: 8.25, status: 'Late' },
      { id: 4, employeeId: 'EMP004', name: 'Emily Brown', department: 'Marketing', clockIn: '', clockOut: '', totalHours: 0, status: 'Absent' },
    ];
  }

  applyFilters() {
    this.filteredData = this.attendanceData.filter(entry => {
      const matchesSearch = entry.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            entry.employeeId.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'All' || entry.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  openManualEntryModal() {
    const dialogRef = this.dialog.open(ManualEntryModalComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addManualEntry(result);
      }
    });
  }

  openShiftChangeModal() {
    // TODO: Implement shift change modal
    console.log('Open shift change modal');
    const dialogRef = this.dialog.open(ShiftChangeModalComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateShift(result);
      }
    });
  }

  updateShift(shiftChange: any) {
    // Implement shift change logic here
    console.log('Shift changed:', shiftChange);
  }

  calculateTotalHours(clockIn: string, clockOut: string): number {
    if (!clockIn || !clockOut) return 0;
    const start = new Date(`2000-01-01T${clockIn}`);
    const end = new Date(`2000-01-01T${clockOut}`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.round(diff * 100) / 100;
  }

  addManualEntry(entry: any) {
    const newEntry = {
      id: this.attendanceData.length + 1,
      ...entry,
      totalHours: this.calculateTotalHours(entry.clockIn, entry.clockOut),
      status: this.determineStatus(entry.clockIn)
    };
    this.attendanceData.push(newEntry);
  }

  determineStatus(clockIn: string): string {
    if (!clockIn) return 'Absent';
    const startTime = new Date(`2000-01-01T09:00`);
    const actualTime = new Date(`2000-01-01T${clockIn}`);
    return actualTime <= startTime ? 'Present' : 'Late';
  }

  editAttendance(id: number) {
    console.log('Edit attendance for ID:', id);
    const entry = this.attendanceData.find(e => e.id === id);
    if (entry) {
      const dialogRef = this.dialog.open(ManualEntryModalComponent, {
        width: '400px',
        data: { ...entry }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const index = this.attendanceData.findIndex(e => e.id === id);
          this.attendanceData[index] = {
            ...this.attendanceData[index],
            ...result,
            totalHours: this.calculateTotalHours(result.clockIn, result.clockOut),
            status: this.determineStatus(result.clockIn)
          };
        }
      });
    }
  }

  deleteAttendance(id: number) {
    // Find the index of the entry to be deleted
    const index = this.attendanceData.findIndex(entry => entry.id === id);
    
    if (index !== -1) {
      // Remove the entry from the array
      this.attendanceData.splice(index, 1);
      
      // Re-apply filters to update the view
      this.applyFilters();
    }
  }
}
