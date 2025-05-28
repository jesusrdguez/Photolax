import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { ContestService } from '../../../services/contest.service';
import { PhotoService } from '../../../services/photo.service';
import { AuthService } from '../../../services/auth.service';
import { Contest } from '../../../models/contest.model';
import { PhotoCard } from '../../../models/photo.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-contest-detail',
    standalone: true,
    imports: [CommonModule, MaterialModule],
    template: `
        <div class="contest-detail-container" *ngIf="contest">
            <div class="header">
                <div class="title-section">
                    <h1>{{ contest.title }}</h1>
                    <p class="dates">
                        From {{ contest.start_date | date }} to {{ contest.end_date | date }}
                    </p>
                    <p class="participants">
                        Maximum Participants: {{ contest.max_participants }}
                    </p>
                </div>
                
                <div class="actions" *ngIf="authService.isAuthenticated()">
                    <button mat-raised-button color="primary" (click)="uploadPhoto()">
                        Upload Photo
                    </button>
                </div>
            </div>

            <div class="photos-section">
                <h2>Contest Photos</h2>
                
                <div class="photos-grid" *ngIf="photos.length > 0; else noPhotos">
                    <mat-card *ngFor="let photo of photos">
                        <img [src]="photo.imageUrl" [alt]="photo.title" class="photo-image">
                        <mat-card-content>
                            <h3>{{ photo.title }}</h3>
                            <p>By {{ photo.userFullName }}</p>
                            <p>Votes: {{ photo.voteCount }}</p>
                        </mat-card-content>
                        <mat-card-actions>
                            <button mat-button color="primary" (click)="viewPhoto(photo.photo_id)">
                                View Details
                            </button>
                            <button mat-button color="accent" (click)="voteForPhoto(photo.photo_id)">
                                Vote
                            </button>
                        </mat-card-actions>
                    </mat-card>
                </div>
                
                <ng-template #noPhotos>
                    <p class="no-photos">No photos have been submitted to this contest yet.</p>
                </ng-template>
            </div>
        </div>
    `,
    styles: [`
        .contest-detail-container {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
        }

        .title-section h1 {
            margin: 0 0 8px 0;
        }

        .dates, .participants {
            color: rgba(0, 0, 0, 0.6);
            margin: 4px 0;
        }

        .photos-section h2 {
            margin-bottom: 20px;
        }

        .photos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }

        .photo-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }

        mat-card-content {
            padding: 16px;
        }

        mat-card-content h3 {
            margin: 0 0 8px 0;
        }

        .no-photos {
            text-align: center;
            color: rgba(0, 0, 0, 0.6);
            padding: 40px;
        }
    `]
})
export class ContestDetailComponent implements OnInit {
    contest?: Contest;
    photos: PhotoCard[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private contestService: ContestService,
        private photoService: PhotoService,
        public authService: AuthService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        const contestId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadContest(contestId);
        this.loadPhotos(contestId);
    }

    loadContest(id: number): void {
        this.contestService.getContestById(id).subscribe({
            next: (contest) => {
                this.contest = contest;
            },
            error: (error) => {
                this.toastr.error(error.error?.message || 'Error loading contest');
                this.router.navigate(['/contests']);
            }
        });
    }

    loadPhotos(contestId: number): void {
        this.photoService.getPhotos(contestId).subscribe({
            next: (photos) => {
                this.photos = photos;
            },
            error: (error) => {
                this.toastr.error(error.error?.message || 'Error loading photos');
            }
        });
    }

    uploadPhoto(): void {
        // This will be implemented later with a dialog component
        this.toastr.info('Photo upload feature coming soon');
    }

    viewPhoto(photoId: number): void {
        this.router.navigate(['/photos', photoId]);
    }

    voteForPhoto(photoId: number): void {
        if (!this.authService.isAuthenticated()) {
            this.toastr.error('Please login to vote');
            return;
        }

        this.photoService.getPhotoById(photoId).subscribe({
            next: (photo) => {
                if (photo.user?.user_id === this.authService.getCurrentUser()?.user_id) {
                    this.toastr.error('You cannot vote for your own photo');
                    return;
                }

                // Implement voting logic
                this.toastr.info('Voting feature coming soon');
            },
            error: (error) => {
                this.toastr.error(error.error?.message || 'Error checking photo');
            }
        });
    }
} 