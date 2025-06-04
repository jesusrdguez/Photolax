import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { PhotoService } from '../../services/photo.service';
import { ContestService } from '../../services/contest.service';
import { VoteService } from '../../services/vote.service';
import { AuthService } from '../../services/auth.service';
import { Photo, PhotoStatus, PhotoDisplay } from '../../models/photo.model';
import { Contest } from '../../models/contest.model';
import { ToastrService } from 'ngx-toastr';
import { switchMap, tap, map } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';

@Component({
    selector: 'app-rally-photos',
    standalone: true,
    imports: [CommonModule, MaterialModule],
    template: `
        <div class="rally-container">
            <h1 class="rally-title">{{ contest?.title || 'Loading...' }}</h1>
            
            <!-- Photo Grid -->
            <div class="photos-grid">
                <div *ngFor="let photo of photos" 
                     class="photo-item"
                     (click)="openPhoto(photo)">
                    <img [src]="'data:image/jpeg;base64,' + photo.photoBase64" 
                         [alt]="photo.title"
                         class="photo-image">
                    <div *ngIf="hasVoted(photo.id)" class="voted-indicator">
                        <mat-icon>favorite</mat-icon>
                    </div>
                </div>
            </div>

            <!-- Enlarged Photo Modal -->
            <div *ngIf="selectedPhoto" class="photo-modal" (click)="closePhoto($event)">
                <div class="modal-content">
                    <img [src]="'data:image/jpeg;base64,' + selectedPhoto.photoBase64" 
                         [alt]="selectedPhoto.title"
                         class="enlarged-photo">
                    
                    <div class="modal-controls">
                        <button mat-icon-button 
                                class="vote-button" 
                                [disabled]="!canVote || hasVoted(selectedPhoto.id)"
                                (click)="voteForPhoto($event, selectedPhoto.id)">
                            <mat-icon>{{ hasVoted(selectedPhoto.id) ? 'favorite' : 'favorite_border' }}</mat-icon>
                        </button>
                        <button mat-raised-button color="primary" (click)="closePhoto($event)">CLOSE</button>
                    </div>
                </div>
            </div>

            <!-- Votes Remaining Indicator -->
            <div class="votes-indicator" *ngIf="authService.isLoggedIn()">
                Votes remaining: {{ remainingVotes }}
            </div>
        </div>
    `,
    styles: [`
        .rally-container {
            min-height: 100vh;
            background-color: #1A1D1B;
            color: #DAD7CD;
            padding: 20px;
        }

        .rally-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 30px;
            color: #DAD7CD;
        }

        .photos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px;
        }

        .photo-item {
            position: relative;
            aspect-ratio: 1;
            cursor: pointer;
            overflow: hidden;
            transition: transform 0.3s ease;
        }

        .photo-item:hover {
            transform: scale(1.02);
        }

        .photo-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .voted-indicator {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            padding: 5px;
        }

        .voted-indicator mat-icon {
            color: #ff4081;
        }

        .photo-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }

        .enlarged-photo {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
        }

        .modal-controls {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .vote-button {
            background-color: white;
        }

        .vote-button[disabled] {
            opacity: 0.5;
        }

        .votes-indicator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.8);
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 0.9rem;
        }
    `]
})
export class RallyPhotosComponent implements OnInit {
    contest: Contest | null = null;
    photos: PhotoDisplay[] = [];
    selectedPhoto: PhotoDisplay | null = null;
    votedPhotoIds: Set<number> = new Set();
    remainingVotes: number = 3;
    canVote: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private contestService: ContestService,
        private photoService: PhotoService,
        private voteService: VoteService,
        public authService: AuthService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.route.params.pipe(
            switchMap(params => this.contestService.getContestByTitle(params['title'])),
            switchMap(contest => {
                if (!contest?.id) {
                    throw new Error('Contest not found');
                }
                this.contest = contest;
                return forkJoin({
                    photos: this.photoService.getPhotosByContestAndStatus(contest.id),
                    userVotes: this.authService.isLoggedIn() ? this.voteService.getUserVotes() : of([])
                });
            })
        ).subscribe({
            next: ({ photos, userVotes }) => {
                this.photos = photos;
                
                this.votedPhotoIds = new Set(userVotes.map(vote => vote.photoId));
                
                const votesInThisContest = userVotes.filter(vote => 
                    this.photos.some(photo => photo.id === vote.photoId)
                );
                this.remainingVotes = 3 - votesInThisContest.length;
                
                this.canVote = this.authService.isLoggedIn() && this.remainingVotes > 0;
            },
            error: (error) => {
                console.error('Error loading rally photos:', error);
                this.toastr.error('Error loading photos');
            }
        });
    }

    openPhoto(photo: PhotoDisplay) {
        this.selectedPhoto = photo;
    }

    closePhoto(event: MouseEvent) {
        if (
            event.target === event.currentTarget || 
            (event.target as HTMLElement).tagName === 'BUTTON'
        ) {
            this.selectedPhoto = null;
        }
    }

    hasVoted(photoId: number): boolean {
        return this.votedPhotoIds.has(photoId);
    }

    voteForPhoto(event: MouseEvent, photoId: number) {
        event.stopPropagation(); // Prevent modal from closing

        if (!this.authService.isLoggedIn()) {
            this.toastr.warning('Please log in to vote for photos');
            return;
        }

        if (this.remainingVotes <= 0) {
            this.toastr.warning('You have used all your votes for this rally');
            return;
        }

        if (this.hasVoted(photoId)) {
            this.toastr.warning('You have already voted for this photo');
            return;
        }

        this.voteService.voteForPhoto(photoId).subscribe({
            next: (vote) => {
                this.votedPhotoIds.add(photoId);
                this.remainingVotes--;
                this.canVote = this.remainingVotes > 0;
                this.toastr.success('Vote registered successfully');
            },
            error: (error) => {
                console.error('Error voting for photo:', error);
                this.toastr.error('Error registering vote');
            }
        });
    }
} 