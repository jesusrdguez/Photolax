import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-photo-dialog',
    standalone: true,
    imports: [CommonModule, MaterialModule],
    template: `
        <h2 mat-dialog-title>Delete Photo</h2>
        <mat-dialog-content>
            <p>Are you sure you want to delete this photo?</p>
            <p>Title: {{ data.title }}</p>
            <p>By: {{ data.username }}</p>
            <div class="photo-preview">
                <img [src]="'data:image/jpeg;base64,' + data.photoBase64" [alt]="data.title">
            </div>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>Cancel</button>
            <button mat-raised-button color="warn" [mat-dialog-close]="true">Delete</button>
        </mat-dialog-actions>
    `,
    styles: [`
        .photo-preview {
            max-width: 300px;
            margin: 16px auto;
        }
        .photo-preview img {
            width: 100%;
            height: auto;
            border-radius: 4px;
        }
        mat-dialog-content {
            min-width: 300px;
        }
    `]
})
export class DeletePhotoDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DeletePhotoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string; username: string; photoBase64: string }
    ) {}
} 