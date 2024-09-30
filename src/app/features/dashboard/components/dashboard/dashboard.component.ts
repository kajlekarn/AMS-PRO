import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { interval, Subscription, Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

Chart.register(...registerables);

interface Notification {
  id: number;
  message: string;
  time: Date;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('notificationAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  employeeData = [
    { name: 'John Doe', department: 'IT', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present' },
    { name: 'Jane Smith', department: 'HR', checkIn: '09:15 AM', checkOut: '05:45 PM', status: 'Present' },
    { name: 'Mike Johnson', department: 'Marketing', checkIn: '10:00 AM', checkOut: '--', status: 'Late' },
    { name: 'Sarah Williams', department: 'Finance', checkIn: '--', checkOut: '--', status: 'Absent' },
    { name: 'Emily Brown', department: 'Sales', checkIn: '09:30 AM', checkOut: '06:15 PM', status: 'Present' },
    { name: 'David Lee', department: 'IT', checkIn: '--', checkOut: '--', status: 'On Leave' },
    { name: 'Lisa Wang', department: 'HR', checkIn: '08:45 AM', checkOut: '05:30 PM', status: 'Present' },
    { name: 'Tom Wilson', department: 'Marketing', checkIn: '09:10 AM', checkOut: '06:05 PM', status: 'Present' },
    { name: 'Anna Garcia', department: 'Finance', checkIn: '09:20 AM', checkOut: '--', status: 'Late' },
    { name: 'James Taylor', department: 'Sales', checkIn: '--', checkOut: '--', status: 'Absent' },
  ];

  filteredData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  statusFilter = 'All';
  searchTerm = '';
  currentSort = { column: 'name', direction: 'asc' };

  presentCount = 0;
  absentCount = 0;
  lateCount = 0;
  leaveCount = 0;

  dateRange = { start: '', end: '' };
  isLoading = false;
  private updateSubscription!: Subscription;
  private chart!: Chart<ChartType, ChartData, unknown>;

  notifications: Notification[] = [];
  unreadNotifications = 0;
  showNotifications = false;
  private destroy$ = new Subject<void>();
  private notificationId = 0;

  ngOnInit() {
    this.filteredData = [...this.employeeData];
    this.updateStats();
    this.createChart();
    this.simulateRealTimeUpdates();
    this.simulateNotifications();
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  simulateRealTimeUpdates() {
    this.updateSubscription = interval(30000).subscribe(() => {
      this.isLoading = true;
      // Simulate API call delay
      setTimeout(() => {
        this.updateRandomEmployeeStatus();
        this.filterData();
        this.updateStats();
        this.updateChart();
        this.isLoading = false;
      }, 1000);
    });
  }

  simulateNotifications() {
    interval(20000) // Simulate a new notification every 20 seconds
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const types: ('info' | 'warning' | 'success' | 'error')[] = ['info', 'warning', 'success', 'error'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const messages = {
          info: 'New employee onboarded',
          warning: 'Server load high',
          success: 'Project milestone achieved',
          error: 'Payroll system error'
        };
        this.addNotification(messages[randomType], randomType);
      });
  }

  updateRandomEmployeeStatus() {
    const randomIndex = Math.floor(Math.random() * this.employeeData.length);
    const statuses = ['Present', 'Absent', 'Late', 'On Leave'];
    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
    this.employeeData[randomIndex].status = newStatus;
  }

  updateChart() {
    if (this.chart) {
      (this.chart.data as any).datasets[0].data = [this.presentCount, this.absentCount, this.lateCount, this.leaveCount];
      this.chart.update();
    }
  }

  createChart() {
    const config: ChartConfiguration<'doughnut', number[], string> = {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent', 'Late', 'On Leave'],
        datasets: [{
          data: [this.presentCount, this.absentCount, this.lateCount, this.leaveCount],
          backgroundColor: ['#4CAF50', '#F44336', '#FFC107', '#2196F3'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Employee Attendance'
          }
        }
      }
    };

    this.chart = new Chart('attendanceChart', config as any);
  }

  updateStats() {
    this.presentCount = this.filteredData.filter(e => e.status === 'Present').length;
    this.absentCount = this.filteredData.filter(e => e.status === 'Absent').length;
    this.lateCount = this.filteredData.filter(e => e.status === 'Late').length;
    this.leaveCount = this.filteredData.filter(e => e.status === 'On Leave').length;
  }

  onDateRangeChange() {
    this.filterData();
  }

  filterData() {
    this.filteredData = this.employeeData.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            employee.department.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            employee.status.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'All' || employee.status === this.statusFilter;
      const matchesDateRange = this.isWithinDateRange(employee.checkIn);
      return matchesSearch && matchesStatus && matchesDateRange;
    });
    this.sortData();
  }

  isWithinDateRange(checkInTime: string): boolean {
    if (!this.dateRange.start || !this.dateRange.end || checkInTime === '--') {
      return true;
    }
    const checkIn = new Date(checkInTime);
    const start = new Date(this.dateRange.start);
    const end = new Date(this.dateRange.end);
    return checkIn >= start && checkIn <= end;
  }

  sortData() {
    this.filteredData.sort((a, b) => {
      const aValue = a[this.currentSort.column];
      const bValue = b[this.currentSort.column];
      if (aValue < bValue) return this.currentSort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.currentSort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onSort(column: string) {
    if (this.currentSort.column === column) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.column = column;
      this.currentSort.direction = 'asc';
    }
    this.sortData();
  }

  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get pageCount() {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  onSearch() {
    this.filterData();
  }

  onStatusFilterChange() {
    this.filterData();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.filterData();
  }

  addNotification(message: string, type: 'info' | 'warning' | 'success' | 'error') {
    this.notificationId++;
    this.notifications.unshift({ 
      id: this.notificationId,
      message, 
      time: new Date(), 
      read: false, 
      type 
    });
    this.unreadNotifications++;
  }

  toggleNotifications(event: Event) {
    event.stopPropagation(); // Prevent the click from propagating to the document
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(notification: Notification) {
    if (!notification.read) {
      notification.read = true;
      this.unreadNotifications--;
    }
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      if (!notification.read) {
        notification.read = true;
      }
    });
    this.unreadNotifications = 0;
  }

  removeNotification(id: number) {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      if (!this.notifications[index].read) {
        this.unreadNotifications--;
      }
      this.notifications.splice(index, 1);
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const notificationIcon = document.querySelector('.notification-icon');
    const notificationPanel = document.querySelector('.notification-panel');
    if (this.showNotifications && 
        notificationIcon && 
        notificationPanel && 
        !notificationIcon.contains(event.target as Node) && 
        !notificationPanel.contains(event.target as Node)) {
      this.showNotifications = false;
    }
  }

  // ... existing methods ...
}