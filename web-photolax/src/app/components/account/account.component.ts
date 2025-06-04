import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-account',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule
    ],
    template: `
    <div class="noise-overlay">
        <div class="page-container">
            <div class="top-header">
                <div class="header-links">
                    <a routerLink="/" class="header-item">HOME</a>
                    <a routerLink="/rules" class="header-item text-lg font-medium">RULES</a>
                    <a routerLink="/rallies" class="header-item text-lg font-medium">RALLIES</a>
                    <a [routerLink]="authService.isLoggedIn() ? '/account' : '/login'" class="header-item text-lg font-medium">
                        {{ authService.isLoggedIn() ? 'ACCOUNT' : 'LOGIN' }}
                    </a>
                </div>
            </div>

            <h1 class="accountTitle reveal-text">ACCOUNT</h1>
            <div class="line"></div>    
            <div class="account-box">
            
                <form [formGroup]="accountForm">
                    <mat-form-field appearance="fill">
                        <mat-label>Username</mat-label>
                        <input matInput formControlName="username" readonly>
                    </mat-form-field>

                    <mat-form-field appearance="fill">
                        <mat-label>First Name</mat-label>
                        <input matInput formControlName="firstName" [readonly]="!isEditing">
                        <mat-error *ngIf="accountForm.get('firstName')?.errors?.['required']">
                            First name is required
                        </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="fill">
                        <mat-label>Last Name</mat-label>
                        <input matInput formControlName="lastName" [readonly]="!isEditing">
                        <mat-error *ngIf="accountForm.get('lastName')?.errors?.['required']">
                            Last name is required
                        </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="fill">
                        <mat-label>Email</mat-label>
                        <input matInput formControlName="email" type="email" [readonly]="!isEditing">
                        <mat-error *ngIf="accountForm.get('email')?.errors?.['required']">
                            Email is required
                        </mat-error>
                        <mat-error *ngIf="accountForm.get('email')?.errors?.['email']">
                            Please enter a valid email
                        </mat-error>
                    </mat-form-field>

                    <div class="button-container">
                        <button mat-raised-button
                                (click)="isEditing ? saveChanges() : startEditing()"
                                [disabled]="isEditing && !accountForm.valid">
                            {{ isEditing ? 'SAVE CHANGES' : 'EDIT PROFILE   ' }}
                        </button>

                        <button mat-raised-button (click)="confirmDelete()">
                            DELETE ACCOUNT
                        </button>

                        <button mat-raised-button (click)="logout()">
                            LOG OUT
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `,
    styles: [`        
        .noise-overlay {
            position: relative;
            z-index: 99;
            overflow: hidden;
        }

        .noise-overlay::before {
            pointer-events: none;
            content: "";
            will-change: transform;
            animation: 1s steps(4) 0s infinite normal none running noise-animation;
            background-image: url(data:image/png;base64,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);
            width: 200%;
            height: 200%;
            display: block;
            position: absolute;
            top: -50%;
            left: -50%;
            z-index: 99;
        }

        @keyframes noise-animation {
            0% { transform: translate(0, 0); }
            25% { transform: translate(-5%, 5%); }
            50% { transform: translate(5%, -5%); }
            75% { transform: translate(-10%, 10%); }
            100% { transform: translate(0, 0); }
        }

        .page-container {
            display: flex;
            flex-direction: column;            
            min-height: 100vh;
            background-color: #1A1D1B;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            position: relative;
            color: #DAD7CD;
        }

        .top-header {
            display: flex;
            justify-content: center;
            padding: 60px 0;
        }

        .header-links {
            display: flex;
            gap: 70px;
        }

        .header-item {
            font-size: 1rem;
            text-transform: uppercase;
            color: #DAD7CD;
            text-decoration: none;
            position: relative;
            padding-bottom: 5px;
            transition: all 0.3s ease;
        }

        .header-item:hover {
            color:rgb(255, 255, 255);
        }

        .header-item::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 1.4px;
            background-color: white;
            transition: width 0.3s ease;
        }

        .header-item:hover::after {
            width: 100%;
        }

        .accountTitle {
            margin: 3px 0 2px 20px;
            font-size: 4vw;
            color: #DAD7CD;
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.8s ease forwards;
        }

        .line {
            border-bottom: 2px solid #DAD7CD;
            width: 90%;
            margin-left: 20px;
            transform: scaleX(0);
            animation: expandLine 1s ease forwards 0.5s;
        }

        .account-box {
            background: #1A1D1B;
            padding: 40px;
            border-radius: 8px;
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .button-container {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 20px;
        }

        mat-form-field {
            width: 100%;
        }

        @media (max-width: 600px) {
            .account-box {
                padding: 20px;
            }

            .button-container {
                flex-direction: column;
            }

            button {
                width: 100%;
            }
        }

        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes expandLine {
            to {
                transform: scaleX(1);
            }
        }
    `]
})
export class AccountComponent implements OnInit {
    accountForm: FormGroup;
    isEditing = false;
    originalData: any;

    constructor(
        private fb: FormBuilder,
        public authService: AuthService,
        private router: Router,
        private toastr: ToastrService,
        private dialog: MatDialog
    ) {
        this.accountForm = this.fb.group({
            username: [{value: '', disabled: true}],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit() {
        this.loadUserData();
    }

    loadUserData() {
        this.authService.getCurrentUser().subscribe({
            next: (user) => {
                this.originalData = { ...user };
                this.accountForm.patchValue(user);
                console.log('user: ', user);
                this.accountForm.disable();
            },
            error: (error) => {
                this.toastr.error('Error loading user data');
                this.router.navigate(['/login']);
            }
        });
    }

    startEditing() {
        this.isEditing = true;
        this.accountForm.get('firstName')?.enable();
        this.accountForm.get('lastName')?.enable();
        this.accountForm.get('email')?.enable();
    }

    saveChanges() {
        if (this.accountForm.valid) {
            const changes = this.accountForm.value;
            
            const updatedFields = Object.keys(changes).reduce((acc: any, key) => {
                if (changes[key] !== this.originalData[key]) {
                    acc[key] = changes[key];
                }
                return acc;
            }, {});

            if (Object.keys(updatedFields).length === 0) {
                this.toastr.info('No changes made');
                this.isEditing = false;
                this.accountForm.disable();
                return;
            }

            this.authService.updateUser(updatedFields).subscribe({
                next: (response) => {
                    this.toastr.success('Profile updated successfully');
                    this.originalData = { ...this.accountForm.value };
                    this.isEditing = false;
                    this.accountForm.disable();
                },
                error: (error) => {
                    if (error.error?.message.includes('username')) {
                        this.accountForm.get('username')?.setErrors({ taken: true });
                    }
                    if (error.error?.message.includes('email')) {
                        this.accountForm.get('email')?.setErrors({ taken: true });
                    }
                    this.toastr.error(error.error?.message || 'Error updating profile');
                }
            });
        }
    }

    confirmDelete() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Delete Account',
                message: 'Are you sure you want to delete your account? This action cannot be undone.',
                confirmText: 'Delete',
                cancelText: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteAccount();
            }
        });
    }

    deleteAccount() {
        this.authService.deleteAccount().subscribe({
            next: () => {
                this.toastr.success('Account deleted successfully');
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.toastr.error(error.error?.message || 'Error deleting account');
            }
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }
} 