import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
        MaterialModule
    ],
    template: `
        <div class="page-container">
            <div class="account-box">
                <h2>Account Settings</h2>
                
                <form [formGroup]="accountForm">
                    <!-- Username field -->
                    <mat-form-field appearance="fill">
                        <mat-label>Username</mat-label>
                        <input matInput formControlName="username" readonly>
                        <mat-hint>Username cannot be changed</mat-hint>
                    </mat-form-field>

                    <!-- First Name field -->
                    <mat-form-field appearance="fill">
                        <mat-label>First Name</mat-label>
                        <input matInput formControlName="firstName" [readonly]="!isEditing">
                        <mat-error *ngIf="accountForm.get('firstName')?.errors?.['required']">
                            First name is required
                        </mat-error>
                    </mat-form-field>

                    <!-- Last Name field -->
                    <mat-form-field appearance="fill">
                        <mat-label>Last Name</mat-label>
                        <input matInput formControlName="lastName" [readonly]="!isEditing">
                        <mat-error *ngIf="accountForm.get('lastName')?.errors?.['required']">
                            Last name is required
                        </mat-error>
                    </mat-form-field>

                    <!-- Email field -->
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
                        <!-- Edit/Save button -->
                        <button mat-raised-button color="primary" 
                                (click)="isEditing ? saveChanges() : startEditing()"
                                [disabled]="isEditing && !accountForm.valid">
                            {{ isEditing ? 'Save Changes' : 'Edit Profile' }}
                        </button>

                        <!-- Delete Account button -->
                        <button mat-raised-button color="warn" (click)="confirmDelete()">
                            Delete Account
                        </button>

                        <!-- Logout button -->
                        <button mat-raised-button (click)="logout()">
                            Log Out
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `,
    styles: [`
        .page-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
            background-color: black;
            background-size: cover;
            background-position: center;
        }

        .account-box {
            background: rgba(0, 0, 0, 0.9);
            padding: 40px;
            border-radius: 8px;
            width: 100%;
            max-width: 500px;
        }

        h2 {
            text-align: center;
            margin-bottom: 30px;
            color: white;
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
    `]
})
export class AccountComponent implements OnInit {
    accountForm: FormGroup;
    isEditing = false;
    originalData: any;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
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
        // Cargar los datos del usuario
        this.loadUserData();
    }

    loadUserData() {
        this.authService.getCurrentUser().subscribe({
            next: (user) => {
                this.originalData = { ...user };
                this.accountForm.patchValue(user);
                console.log('user: ', user);
                this.accountForm.disable(); // Deshabilitar campos inicialmente
            },
            error: (error) => {
                this.toastr.error('Error loading user data');
                this.router.navigate(['/login']);
            }
        });
    }

    startEditing() {
        this.isEditing = true;
        // Enable all fields except username
        this.accountForm.get('firstName')?.enable();
        this.accountForm.get('lastName')?.enable();
        this.accountForm.get('email')?.enable();
    }

    saveChanges() {
        if (this.accountForm.valid) {
            const changes = this.accountForm.value;
            
            // Solo enviar los campos que han cambiado
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