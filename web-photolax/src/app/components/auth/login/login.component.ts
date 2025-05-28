import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material.module';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
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
                <a routerLink="/register" class="header-item">REGISTER</a>
            </div>
            
            <!-- Contenedor principal con la nueva clase login-box -->
            <div class="login-box">
                <mat-card class="login-card">
                    <mat-card-content>
                        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                            <!-- Campo de email con nuevo estilo -->
                            <div class="user-box">
                                <mat-form-field appearance="fill">
                                    <mat-label>Email</mat-label>
                                    <input matInput class="boton-input" type="email" formControlName="usernameOrEmail" required>
                                </mat-form-field>
                                <div *ngIf="loginForm.get('usernameOrEmail')?.invalid && loginForm.get('usernameOrEmail')?.touched" class="error-message">
                                    <div *ngIf="loginForm.get('usernameOrEmail')?.hasError('required')">Email is required</div>
                                    <div *ngIf="loginForm.get('usernameOrEmail')?.hasError('email')">Please enter a valid email</div>
                                </div>
                            </div>

                            <!-- Campo de contraseña con nuevo estilo -->
                            <div class="user-box">
                                <mat-form-field appearance="fill">
                                    <mat-label>Password</mat-label>
                                    <input matInput type="password" formControlName="password" required>
                                </mat-form-field>
                                <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error-message">
                                    Password is required
                                </div>
                            </div>

                            <!-- Botón de login -->
                            <button mat-raised-button class="login-button" type="submit" [disabled]="loginForm.invalid">
                                Login
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

        /* Nuevo estilo para el login-box */
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

        .user-box .mat-form-field-underline {
            display: none;
        }

        .user-box .mat-form-field-infix {
            border-top: none;
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
            color:rgb(0, 0, 0);
            font-size: 12px;
        }

        /* Botón de login con nuevo estilo */
        .login-button {
            align-self: center;
            width: 20%;
            padding: 10px 20px;
            color:rgb(255, 255, 255);
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

        button {
            margin-top: 16px;
            align-self: center;
        }
    `]
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.loginForm = this.fb.group({
            usernameOrEmail: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    this.toastr.success('Login successful');
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    this.toastr.error(error.error?.message || 'Login failed');
                }
            });
        }
    }
}