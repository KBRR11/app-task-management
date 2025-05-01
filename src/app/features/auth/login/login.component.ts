import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../core/auth/auth.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface AnimatedTask {
    icon: string;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatSnackBarModule
    ],
    animations: [
        trigger('loginAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(30px)' }),
                animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ]),
        trigger('fadeInAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-out', style({ opacity: 1 }))
            ])
        ])
    ]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    errorMessage = '';
    animatedTasks: AnimatedTask[] = [
        { icon: 'check_circle' },
        { icon: 'event_note' },
        { icon: 'assignment_turned_in' },
        { icon: 'task_alt' },
        { icon: 'today' },
        { icon: 'list_alt' }
    ];

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit(): void {
        // If user is already logged in, redirect to tasks
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/tasks']);
        }
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            // Highlight form errors
            this.loginForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        const email = this.loginForm.get('email')?.value;

        this.authService.authenticate(email).subscribe({
            next: () => {
                this.loading = false;
                this.showNotification('Login successful!', 'success');
                this.router.navigate(['/tasks']);
            },
            error: (error) => {
                this.loading = false;

                if (error.notFound) {
                    // User not found, show dialog to create new account
                    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                        width: '370px',
                        data: {
                            title: 'Crear Nueva Cuenta',
                            message: 'Usuario no encontrado. Te gustaría crear una nueva cuenta?',
                            confirmText: 'Crear Cuenta',
                            cancelText: 'Cancelar'
                        },
                        panelClass: 'confirm-dialog'
                    });

                    dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                            // User confirmed, create account
                            this.createAccount(email);
                        }
                    });
                } else {
                    this.errorMessage = 'Authentication failed. Please try again.';
                }
            }
        });
    }

    private createAccount(email: string): void {
        this.loading = true;

        this.authService.createUser(email).subscribe({
            next: () => {
                this.loading = false;
                this.showNotification('Account created successfully!', 'success');
                this.router.navigate(['/tasks']);
            },
            error: () => {
                this.loading = false;
                this.errorMessage = 'Failed to create account. Please try again.';
            }
        });
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