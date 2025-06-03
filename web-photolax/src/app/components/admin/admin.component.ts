import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { PhotoService } from '../../services/photo.service';
import { Photo, PhotoStatus } from '../../models/photo.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DeletePhotoDialogComponent } from './delete-photo-dialog/delete-photo-dialog.component';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, MaterialModule],
    template: `
        <div class="admin-container">
            <h1>Admin Panel</h1>
            <div class="photos-grid">
                <div *ngFor="let photo of photos" class="photo-card">
                    <img [src]="photo.photoBase64 ? 'data:image/jpeg;base64,' + photo.photoBase64 : ''" [alt]="photo.title">
                    <div class="photo-info">
                        <h3>{{ photo.title }}</h3>
                        <p>By: {{ photo.username }}</p>
                        <mat-form-field>
                            <mat-label>Status</mat-label>
                            <mat-select [value]="photo.status" (selectionChange)="updatePhotoStatus(photo.id, $event.value)">
                                <mat-option *ngFor="let status of photoStatuses" [value]="status">
                                    {{status}}
                                </mat-option>
                            </mat-select>
                        </mat-form-field>
                        <button mat-raised-button color="warn" (click)="openDeleteDialog(photo)">
                            Delete Photo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .admin-container {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .photos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px 0;
        }

        .photo-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .photo-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }

        .photo-info {
            padding: 15px;
        }

        .photo-info h3 {
            margin: 0 0 10px 0;
        }

        mat-form-field {
            width: 100%;
            margin-bottom: 10px;
        }

        button {
            width: 100%;
        }
    `]
})
export class AdminComponent implements OnInit {
    photos: Photo[] = [];
    photoStatuses = Object.values(PhotoStatus);

    constructor(
        private photoService: PhotoService,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.loadPhotos();
    }

    loadPhotos() {
        this.photoService.getAllPhotosAdmin().subscribe({
            next: (photos: Photo[]) => {
                this.photos = photos;
            },
            error: (error: any) => {
                console.error('Error loading photos:', error);
                this.toastr.error('Error loading photos');
            }
        });
    }

    updatePhotoStatus(id: number, newStatus: PhotoStatus) {
        this.photoService.updatePhotoStatus(id, newStatus).subscribe({
            next: () => {
                this.toastr.success('Photo status updated successfully');
                this.loadPhotos();
            },
            error: (error) => {
                this.toastr.error('Error updating photo status');
            }
        });
    }

    openDeleteDialog(photo: Photo) {
        const dialogRef = this.dialog.open(DeletePhotoDialogComponent, {
            data: {
                title: photo.title,
                username: photo.username,
                photoBase64: photo.photoBase64
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deletePhoto(photo.id);
            }
        });
    }

    deletePhoto(id: number) {
        this.photoService.deletePhoto(id).subscribe({
            next: () => {
                this.toastr.success('Photo deleted successfully');
                this.loadPhotos();
            },
            error: (error) => {
                this.toastr.error('Error deleting photo');
            }
        });
    }
} 