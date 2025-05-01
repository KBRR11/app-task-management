import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatToolbarModule,
        MatButtonToggleModule,
        MatProgressSpinnerModule,
    ]
})
export class TaskListComponent implements OnInit {
    tasks: Task[] = [];
    filteredTasks: Task[] = [];
    loading = false;
    searchTerm = '';
    filterType: 'all' | 'completed' | 'pending' = 'all';

    constructor(
        private taskService: TaskService,
        private authService: AuthService,
        private router: Router,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.loading = true;
        this.taskService.getTasks().subscribe({
            next: (response) => {
                this.tasks = response.tasks;
                this.applyFilters();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    applyFilters(): void {
        let result = this.tasks;

        // Apply status filter
        if (this.filterType === 'completed') {
            result = result.filter(task => task.completed);
        } else if (this.filterType === 'pending') {
            result = result.filter(task => !task.completed);
        }

        // Apply search filter if there is a search term
        if (this.searchTerm.trim()) {
            const term = this.searchTerm.toLowerCase().trim();
            result = result.filter(task =>
                task.title.toLowerCase().includes(term) ||
                task.description.toLowerCase().includes(term)
            );
        }

        this.filteredTasks = result;
    }

    onFilterChange(filterType: 'all' | 'completed' | 'pending'): void {
        this.filterType = filterType;
        this.applyFilters();
    }

    onSearch(event: Event): void {
        this.searchTerm = (event.target as HTMLInputElement).value;
        this.applyFilters();
    }

    addTask(): void {
        const dialogRef = this.dialog.open(TaskFormComponent, {
            width: '500px',
            data: { mode: 'create' }
        });

        dialogRef.afterClosed().subscribe((result: Task | undefined) => {
            if (result) {
                this.loadTasks();
            }
        });
    }

    editTask(task: Task): void {
        const dialogRef = this.dialog.open(TaskFormComponent, {
            width: '500px',
            data: { mode: 'edit', task }
        });

        dialogRef.afterClosed().subscribe((result: Task | undefined) => {
            if (result) {
                this.loadTasks();
            }
        });
    }

    toggleTaskCompletion(task: Task): void {
        this.taskService.toggleTaskCompletion(task.id!).subscribe({
            next: () => {
                // Update task completion in local array
                task.completed = !task.completed;
            }
        });
    }

    deleteTask(task: Task): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: {
                title: 'Delete Task',
                message: `Are you sure you want to delete "${task.title}"?`,
                confirmText: 'Delete',
                cancelText: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.taskService.deleteTask(task.id!).subscribe({
                    next: () => {
                        this.tasks = this.tasks.filter(t => t.id !== task.id);
                        this.applyFilters();
                    }
                });
            }
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    formatDate(date: any): string {
        if (date && date._seconds) {
            return new Date(date._seconds * 1000).toLocaleString();
        }
        return 'Unknown';
    }
}