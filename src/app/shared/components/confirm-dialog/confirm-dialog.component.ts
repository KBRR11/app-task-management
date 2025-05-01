import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';

export interface ConfirmDialogData {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
}

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ],
    animations: [
        trigger('dialogAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0.8)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
            ])
        ])
    ]
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) { }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    isWarningDialog(): boolean {
        return this.data.title.toLowerCase().includes('delete') || 
               this.data.confirmText.toLowerCase().includes('delete');
    }

    isCreateDialog(): boolean {
        return this.data.title.toLowerCase().includes('create') || 
               this.data.confirmText.toLowerCase().includes('create');
    }

    getConfirmButtonColor(): string {
        return this.isWarningDialog() ? 'warn' : 'primary';
    }
}