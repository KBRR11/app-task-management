import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
        MatTooltipModule,
        MatSnackBarModule
    ],
    animations: [
        trigger('taskAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px)' }),
                animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
            ])
        ])
    ]
})
export class TaskListComponent implements OnInit, OnDestroy {
    tasks: Task[] = [];
    filteredTasks: Task[] = [];
    loading = false;
    searchTerm = '';
    filterType: 'all' | 'completed' | 'pending' = 'all';
    private destroy$ = new Subject<void>();

    constructor(
        private taskService: TaskService,
        public authService: AuthService,
        private router: Router,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadTasks();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadTasks(): void {
        this.loading = true;
        this.taskService.getTasks()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.tasks = response.tasks.sort((a, b) => {
                        // Sort by completed status (pending first) then by creation date (newest first)
                        if (a.completed !== b.completed) {
                            return a.completed ? 1 : -1;
                        }
                        return b.createdAt._seconds - a.createdAt._seconds;
                    });
                    this.applyFilters();
                    this.loading = false;
                },
                error: (error) => {
                    this.loading = false;
                    this.showNotification('Failed to load tasks', 'error');
                    console.error('Error loading tasks:', error);
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
            data: { mode: 'create' },
            panelClass: 'task-form-dialog'
        });

        dialogRef.afterClosed().subscribe((result: Task | undefined) => {
            if (result) {
                this.loadTasks();
                this.showNotification('Task created successfully', 'success');
            }
        });
    }

    editTask(task: Task): void {
        const dialogRef = this.dialog.open(TaskFormComponent, {
            width: '500px',
            data: { mode: 'edit', task },
            panelClass: 'task-form-dialog'
        });

        dialogRef.afterClosed().subscribe((result: Task | undefined) => {
            if (result) {
                this.loadTasks();
                this.showNotification('Task updated successfully', 'success');
            }
        });
    }

    toggleTaskCompletion(task: Task): void {
        this.taskService.toggleTaskCompletion(task.id!, !task.completed)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    // Update task completion in local array
                    task.completed = !task.completed;
                    this.showNotification(
                        task.completed ? 'Task marked as completed' : 'Task reopened', 
                        'success'
                    );
                },
                error: (error) => {
                    console.error('Error toggling task completion:', error);
                    this.showNotification('Failed to update task status', 'error');
                }
            });
    }

    deleteTask(task: Task): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: {
                title: 'Delete Task',
                message: `Estas seguro de borrar "${task.title}"?`,
                confirmText: 'Delete',
                cancelText: 'Cancel'
            },
            panelClass: 'confirm-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.taskService.deleteTask(task.id!)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.tasks = this.tasks.filter(t => t.id !== task.id);
                            this.applyFilters();
                            this.showNotification('Task deleted successfully', 'success');
                        },
                        error: (error) => {
                            console.error('Error deleting task:', error);
                            this.showNotification('Failed to delete task', 'error');
                        }
                    });
            }
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
        this.showNotification('You have been logged out', 'info');
    }

    formatDate(date: any): string {
        if (date && date._seconds) {
            return new Date(date._seconds * 1000).toLocaleString();
        }
        return 'Unknown';
    }

    trackByTaskId(index: number, task: Task): string {
        return task.id || index.toString();
    }

    private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: [`snackbar-${type}`]
        });
    }
}