import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule
    ],
    template: `
        <div class="page-container">
            <!-- Header superior -->
            <div class="top-header">
                <a routerLink="/rules" class="header-item">RULES</a>
                <a routerLink="/rallies" class="header-item">RALLIES</a>
                <a routerLink="/login" class="header-item">LOGIN</a>
            </div>
            
            <!-- Contenedor principal -->
            <div class="login-box">
                <mat-card class="login-card">
                    <mat-card-content>
                        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                            <!-- First Name -->
                            <div class="user-box">
                                <mat-form-field appearance="fill">
                                    <mat-label>First Name</mat-label>
                                    <input matInput class="boton-input" formControlName="first_name" required>
                                </mat-form-field>
                                <div *ngIf="registerForm.get('first_name')?.invalid && registerForm.get('first_name')?.touched" class="error-message">
                                    First name is required
                                </div>
                            </div>

                            <!-- Last Name -->
                            <div class="user-box">
                                <mat-form-field appearance="fill">
                                    <mat-label>Last Name</mat-label>
                                    <input matInput class="boton-input" formControlName="last_name" required>
                                </mat-form-field>
                                <div *ngIf="registerForm.get('last_name')?.invalid && registerForm.get('last_name')?.touched" class="error-message">
                                    Last name is required
                                </div>
                            </div>

                            <!-- Username -->
                            <div class="user-box">
                                <mat-form-field appearance="fill">
                                    <mat-label>Username</mat-label>
                                    <input matInput class="boton-input" formControlName="username" required>
                                </mat-form-field>
                                <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" class="error-message">
                                    Username is required
                                </div>
                            </div>

                            <!-- Email -->
                            <div class="user-box">
                                <mat-form-field appearance="fill">
                                    <mat-label>Email</mat-label>
                                    <input matInput class="boton-input" type="email" formControlName="email" required>
                                </mat-form-field>
                                <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="error-message">
                                    <div *ngIf="registerForm.get('email')?.hasError('required')">Email is required</div>
                                    <div *ngIf="registerForm.get('email')?.hasError('email')">Please enter a valid email</div>
                                </div>
                            </div>

                            <!-- Password -->
                            <div class="user-box">
                                <mat-form-field appearance="fill">
                                    <mat-label>Password</mat-label>
                                    <input matInput class="boton-input" type="password" formControlName="password" required>
                                </mat-form-field>
                                <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="error-message">
                                    <div *ngIf="registerForm.get('password')?.hasError('required')">Password is required</div>
                                    <div *ngIf="registerForm.get('password')?.hasError('minlength')">Password must be at least 6 characters long</div>
                                </div>
                            </div>

                            <button mat-raised-button class="login-button" type="submit" [disabled]="registerForm.invalid">
                                Register
                            </button>
                        </form>
                    </mat-card-content>
                </mat-card>
            </div>
        </div>
    `,
    styles: [`
        .page-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-image: linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) ), url('/assets/loginRegisterBackground.webp');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            font-family: 'Roboto', sans-serif;
            position: relative;
        }

        /* Encabezado superior */
        .top-header {
            display: flex;
            justify-content: center;
            padding: 30px 0;
            font-size: 1.2rem;
            letter-spacing: 1px;
        }

        .header-item {
            text-decoration: none;
            margin: 10px 40px;
            cursor: pointer;
            text-transform: uppercase;
            color: black;
            transition: color 0.3s;
            position: relative;
        }

        /* Contenedor principal */
        .login-box {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 700px;
            padding: 60px;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.49);
            box-sizing: border-box;
        }

        .login-card {
            background: transparent !important;
            box-shadow: none !important;
            padding: 0;
        }

        /* Animación para las etiquetas */
        .user-box mat-label {
            top: 0;
            left: 0;
            padding: 10px 0;
            font-size: 16px;
            color: black;
            pointer-events: none;
            width: max-content;
            transition: 0.5s;
        }

        .user-box .mat-focused mat-label,
        .user-box .mat-form-field.mat-form-field-should-float mat-label {
            top: -20px;
            left: 0;
            color: rgb(0, 0, 0);
            font-size: 12px;
        }

        /* Botón de registro */
        .login-button {
            align-self: center;
            width: 20%;
            padding: 10px 20px;
            color: rgb(255, 255, 255);
            font-size: 18px;
            overflow: hidden;
            transition: .5s;
            margin-top: 20px;
            letter-spacing: 2px;
            background: black;
            border: none !important;
            border-radius: 0;
            box-shadow: none !important;
        }

        .login-button:disabled {
            background: #555 !important;
            color: #999 !important;
            box-shadow: none !important;
        }

        .error-message {
            color: #e91e63;
            font-size: 12px;
            margin-top: -20px;
            margin-bottom: 15px;
        }

        /* Responsividad */
        @media (max-width: 600px) {
            .top-header {
                padding: 20px 0;
                font-size: 1rem;
            }
            
            .header-item {
                margin: 0 15px;
            }
            
            .login-box {
                width: 90%;
                padding: 30px 20px;
            }
        }
    `]
})
export class RegisterComponent {
    registerForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.registerForm = this.fb.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    this.toastr.success('Registration successful');
                    this.router.navigate(['/login']);
                },
                error: (error) => {
                    this.toastr.error(error.error?.message || 'Registration failed');
                }
            });
        }
    }
} 