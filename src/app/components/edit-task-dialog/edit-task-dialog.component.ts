import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-task-dialog',
  standalone:false,
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.scss']
})
export class EditTaskDialogComponent {
  editTaskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editTaskForm = this.fb.group({
      title: [data.task.title, Validators.required],
      description: [data.task.description, Validators.required]
    });
  }

  save(): void {
    if (this.editTaskForm.valid) {
      this.dialogRef.close(this.editTaskForm.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}