import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface TaskFormData {
  mode: 'create' | 'edit';
  task?: Task;
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  loading = false;
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskFormData
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required]],
      completed: [false]
    });
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.task) {
      this.taskForm.patchValue({
        title: this.data.task.title,
        description: this.data.task.description,
        completed: this.data.task.completed
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const taskData: Partial<Task> = {
      ...this.taskForm.value,
      userId: this.authService.currentUserValue?.id
    };

    if (this.data.mode === 'create') {
      this.createTask(taskData);
    } else {
      this.updateTask(this.data.task!.id!, taskData);
    }
  }

  private createTask(taskData: Partial<Task>): void {
    this.taskService.createTask(taskData).subscribe({
      next: (response) => {
        this.loading = false;
        this.dialogRef.close(response.task);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to create task. Please try again.';
      }
    });
  }

  private updateTask(id: string, taskData: Partial<Task>): void {
    this.taskService.updateTask(id, taskData).subscribe({
      next: (response) => {
        this.loading = false;
        this.dialogRef.close(response.task);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Failed to update task. Please try again.';
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}