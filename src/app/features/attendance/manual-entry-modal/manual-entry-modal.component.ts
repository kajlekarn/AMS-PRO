import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-manual-entry-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './manual-entry-modal.component.html',
  styleUrls: ['./manual-entry-modal.component.css']
})
export class ManualEntryModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ManualEntryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.updateSize('auto', 'auto'); // Let content determine size
    // Initialize data object if it's empty
    this.data = this.data || {};
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.dialogRef.close(this.data);
    }
  }
}
