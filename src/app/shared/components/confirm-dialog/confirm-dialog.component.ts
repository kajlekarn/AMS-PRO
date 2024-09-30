import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="confirm-dialog">
      <div class="dialog-header">
        <h2>{{ data.title }}</h2>
        <button class="close-btn" (click)="onNoClick()">×</button>
      </div>
      <div class="dialog-content">
        <p>{{ data.message }}</p>
      </div>
      <div class="dialog-actions">
        <button class="cancel-btn" (click)="onNoClick()">Cancel</button>
        <button class="confirm-btn" [mat-dialog-close]="true" cdkFocusInitial>OK</button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .dialog-header {
      background: #4a90e2;
      color: white;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
    }
    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
    .dialog-content {
      padding: 24px;
      background: #f8f9fa;
    }
    p {
      color: #333;
      font-size: 1rem;
      line-height: 1.5;
      margin: 0;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      padding: 16px 24px;
      background: white;
    }
    button {
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 500;
      text-transform: uppercase;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
    }
    .cancel-btn {
      background-color: #f1f3f5;
      color: #495057;
      margin-right: 8px;
    }
    .cancel-btn:hover {
      background-color: #e9ecef;
    }
    .confirm-btn {
      background-color: #4a90e2;
      color: white;
    }
    .confirm-btn:hover {
      background-color: #3a80d2;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
