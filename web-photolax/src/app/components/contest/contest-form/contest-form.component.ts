import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { ContestService } from '../../../services/contest.service';
import { Contest } from '../../../models/contest.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-contest-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MaterialModule],
    template: `
        <div class="contest-form-container">
            <mat-card>
                <mat-card-header>
                    <mat-card-title>{{ isEditMode ? 'Edit Contest' : 'Create New Contest' }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <form [formGroup]="contestForm" (ngSubmit)="onSubmit()">
                        <mat-form-field appearance="fill">
                            <mat-label>Title</mat-label>
                            <input matInput formControlName="title" required>
                            <mat-error *ngIf="contestForm.get('title')?.hasError('required')">
                                Title is required
                            </mat-error>
                        </mat-form-field>

                        <mat-form-field appearance="fill">
                            <mat-label>Start Date</mat-label>
                            <input matInput [matDatepicker]="startPicker" formControlName="start_date" required>
                            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                            <mat-datepicker #startPicker></mat-datepicker>
                            <mat-error *ngIf="contestForm.get('start_date')?.hasError('required')">
                                Start date is required
                            </mat-error>
                        </mat-form-field>

                        <mat-form-field appearance="fill">
                            <mat-label>End Date</mat-label>
                            <input matInput [matDatepicker]="endPicker" formControlName="end_date" required>
                            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                            <mat-datepicker #endPicker></mat-datepicker>
                            <mat-error *ngIf="contestForm.get('end_date')?.hasError('required')">
                                End date is required
                            </mat-error>
                        </mat-form-field>

                        <mat-form-field appearance="fill">
                            <mat-label>Maximum Participants</mat-label>
                            <input matInput type="number" formControlName="max_participants" required min="1">
                            <mat-error *ngIf="contestForm.get('max_participants')?.hasError('required')">
                                Maximum participants is required
                            </mat-error>
                            <mat-error *ngIf="contestForm.get('max_participants')?.hasError('min')">
                                Must be at least 1
                            </mat-error>
                        </mat-form-field>

                        <div class="form-actions">
                            <button mat-button type="button" routerLink="/contests">Cancel</button>
                            <button mat-raised-button color="primary" type="submit" [disabled]="contestForm.invalid">
                                {{ isEditMode ? 'Update' : 'Create' }}
                            </button>
                        </div>
                    </form>
                </mat-card-content>
            </mat-card>
        </div>
    `,
    styles: [`
        .contest-form-container {
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
        }

        mat-form-field {
            width: 100%;
            margin-bottom: 16px;
        }

        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 16px;
        }
    `]
})
export class ContestFormComponent implements OnInit {
    contestForm: FormGroup;
    isEditMode = false;
    contestId?: number;

    constructor(
        private fb: FormBuilder,
        private contestService: ContestService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) {
        this.contestForm = this.fb.group({
            title: ['', Validators.required],
            start_date: ['', Validators.required],
            end_date: ['', Validators.required],
            max_participants: ['', [Validators.required, Validators.min(1)]]
        });
    }

    ngOnInit(): void {
        this.contestId = Number(this.route.snapshot.paramMap.get('id'));
        if (this.contestId) {
            this.isEditMode = true;
            this.loadContest();
        }
    }

    loadContest(): void {
        this.contestService.getContestById(this.contestId!).subscribe({
            next: (contest) => {
                this.contestForm.patchValue({
                    ...contest,
                    start_date: new Date(contest.start_date),
                    end_date: new Date(contest.end_date)
                });
            },
            error: (error) => {
                this.toastr.error(error.error?.message || 'Error loading contest');
                this.router.navigate(['/contests']);
            }
        });
    }

    onSubmit(): void {
        if (this.contestForm.valid) {
            const contest: Contest = {
                ...this.contestForm.value,
                contest_id: this.isEditMode ? this.contestId : undefined
            };

            const request = this.isEditMode
                ? this.contestService.updateContest(this.contestId!, contest)
                : this.contestService.createContest(contest);

            request.subscribe({
                next: () => {
                    this.toastr.success(
                        this.isEditMode
                            ? 'Contest updated successfully'
                            : 'Contest created successfully'
                    );
                    this.router.navigate(['/contests']);
                },
                error: (error) => {
                    this.toastr.error(
                        error.error?.message ||
                        (this.isEditMode
                            ? 'Error updating contest'
                            : 'Error creating contest')
                    );
                }
            });
        }
    }
} 