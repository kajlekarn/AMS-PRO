// src/app/features/employee/models/attendance.model.ts
export interface Attendance {
    id: number;
    employeeId: number;
    date: string;
    checkIn: string;
    checkOut: string;
    status: 'PRESENT' | 'ABSENT' | 'HALF_DAY';
  }