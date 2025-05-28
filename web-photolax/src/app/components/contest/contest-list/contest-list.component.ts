import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { ContestService } from '../../../services/contest.service';
import { AuthService } from '../../../services/auth.service';
import { Contest } from '../../../models/contest.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-contest-list',
    standalone: true,
    imports: [CommonModule, RouterModule, MaterialModule],
    template: `
        <div class="contest-list-container">
            <div class="header">
                <h1>Photography Contests</h1>
                <button *ngIf="authService.getCurrentUser()?.role === 'ADMIN'"
                        mat-raised-button 
                        color="primary"
                        routerLink="new">
                    Create New Contest
                </button>
            </div>

            <div class="contests-grid">
                <mat-card *ngFor="let contest of contests">
                    <mat-card-header>
                        <mat-card-title>{{ contest.title }}</mat-card-title>
                        <mat-card-subtitle>
                            Participants: {{ contest.max_participants }}
                        </mat-card-subtitle>
                    </mat-card-header>
                    <mat-card-content>
                        <p><strong>Start Date:</strong> {{ contest.start_date | date }}</p>
                        <p><strong>End Date:</strong> {{ contest.end_date | date }}</p>
                    </mat-card-content>
                    <mat-card-actions>
                        <button mat-button color="primary" [routerLink]="[contest.contest_id]">
                            View Details
                        </button>
                        <button *ngIf="authService.getCurrentUser()?.role === 'ADMIN'"
                                mat-button 
                                color="accent"
                                [routerLink]="[contest.contest_id, 'edit']">
                            Edit
                        </button>
                        <button *ngIf="authService.getCurrentUser()?.role === 'ADMIN'"
                                mat-button 
                                color="warn"
                                (click)="deleteContest(contest.contest_id!)">
                            Delete
                        </button>
                    </mat-card-actions>
                </mat-card>
            </div>
        </div>
    `,
    styles: [`
        .contest-list-container {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .contests-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }

        mat-card {
            height: 100%;
        }

        mat-card-content {
            margin: 16px 0;
        }

        mat-card-actions {
            padding: 8px;
            display: flex;
            justify-content: flex-start;
            gap: 8px;
        }
    `]
})
export class ContestListComponent implements OnInit {
    contests: Contest[] = [];

    constructor(
        private contestService: ContestService,
        public authService: AuthService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.loadContests();
    }

    loadContests(): void {
        this.contestService.getContests().subscribe({
            next: (contests) => {
                this.contests = contests;
            },
            error: (error) => {
                this.toastr.error(error.error?.message || 'Error loading contests');
            }
        });
    }

    deleteContest(id: number): void {
        if (confirm('Are you sure you want to delete this contest?')) {
            this.contestService.deleteContest(id).subscribe({
                next: () => {
                    this.toastr.success('Contest deleted successfully');
                    this.loadContests();
                },
                error: (error) => {
                    this.toastr.error(error.error?.message || 'Error deleting contest');
                }
            });
        }
    }
} 