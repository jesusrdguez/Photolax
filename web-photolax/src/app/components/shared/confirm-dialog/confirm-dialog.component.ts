import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface DialogData {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
}

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    template: `
        <h2 mat-dialog-title>{{ data.title }}</h2>
        <mat-dialog-content>
            <p>{{ data.message }}</p>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button [mat-dialog-close]="false">
                {{ data.cancelText }}
            </button>
            <button mat-raised-button color="warn" [mat-dialog-close]="true">
                {{ data.confirmText }}
            </button>
        </mat-dialog-actions>
    `,
    styles: [`
        :host {
            display: block;
            padding: 20px;
            max-width: 400px;
        }

        h2 {
            margin: 0;
            font-size: 24px;
            color: #333;
        }

        p {
            margin: 20px 0;
            font-size: 16px;
            line-height: 1.5;
            color: #666;
        }

        mat-dialog-actions {
            margin-bottom: -10px;
            padding: 8px 0;
        }
    `]
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }
} 