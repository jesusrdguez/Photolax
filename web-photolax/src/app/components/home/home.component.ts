import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../shared/material.module';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, MaterialModule, MatIconModule, MatButtonModule],
    template: `
        <div class="page-container">
            <!-- Header superior -->
            <div class="top-header">
                <div class="header-links">
                    <a routerLink="/rules" class="header-item">RULES</a>
                    <a routerLink="/rallies" class="header-item">RALLIES</a>
                    <a routerLink="/login" class="header-item">LOGIN</a>
                </div>
            </div>

            <!-- Botón de menú móvil -->
            <button mat-icon-button class="menu-button" (click)="toggleMenu()">
                <mat-icon>menu</mat-icon>
            </button>

            <!-- Menú móvil desplegable -->
            <div class="mobile-menu" [class.show-menu]="isMenuOpen">
                <div class="mobile-header">
                    <button mat-icon-button class="close-button" (click)="toggleMenu()">
                        <mat-icon>close</mat-icon>
                    </button>
                </div>
                <a routerLink="/rules" class="mobile-item">RULES</a>
                <a routerLink="/rallies" class="mobile-item">RALLIES</a>
                <a routerLink="/login" class="mobile-item">LOGIN</a>
            </div>

            <!-- Contenido principal -->
            <div class="main-content">
                <!-- Logo principal -->
                <div class="logo-container">
                    <h1 class="main-logo">PHOTOLAX</h1>
                </div>

                <!-- Texto descriptivo -->
                <div class="tagline-container">
                    <p class="tagline">Photography doesn't just capture a moment, it</p>
                    <p class="tagline">forever holds the emotion that made it timeless</p>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .page-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), 
                              url('/assets/homeBackgroundAlternative.webp');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            font-family: 'Helvetica Neue', Arial, sans-serif;
            position: relative;
            color: white;
        }

        /* Header superior */
        .top-header {
            display: flex;
            justify-content: center;
            padding: 40px 0;
        }

        .header-links {
            display: flex;
            gap: 60px;
        }

        .header-item {
            font-size: 18px;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #1A1D1B;
            text-decoration: none;
            position: relative;
            padding-bottom: 5px;
            transition: all 0.3s ease;
        }

        .header-item:hover {
            color:rgb(0, 0, 0);
        }

        .header-item::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 1.4px;
            background-color: black;
            transition: width 0.3s ease;
        }

        .header-item:hover::after {
            width: 100%;
        }

        /* Logo principal */
        /*.logo-container {
            margin: 80px;
            margin-left: 0px;
            text-align: left;
        }*/

        .main-logo {
            margin-left: 10px;
            font-weight: lighter;
            margin-top: 0;
            transition: 1.4s cubic-bezier(0.8, 0, 0, 1);
            position: relative;
            z-index: 6;
            pointer-events: none;
            padding-top: 12rem;
            font-family: Canopee, Helvetica, Arial, sans-serif;
            font-size: 17.2vw;
            text-indent: -1vw;
            color: #DAD7CD;
            transform: translateX(0px);
        }

        /* Texto descriptivo */
        .tagline-container {
            text-align: center;
        }

        .tagline {
            color: black;
            font-size: 22px;
            font-weight: 300;
            letter-spacing: 1.5px;
            line-height: 1.6;
        }

        /* Botones CTA */
        .cta-container {
            display: flex;
            gap: 25px;
            justify-content: center;
            margin-bottom: 80px;
        }

        .cta-button {
            padding: 15px 45px;
            font-size: 16px;
            letter-spacing: 2px;
            text-transform: uppercase;
            border-radius: 0;
            transition: all 0.3s ease;
            min-width: 220px;
        }

        .cta-button:not(.secondary) {
            background-color: white;
            color: black;
        }

        .cta-button.secondary {
            background-color: transparent;
            color: white;
            border: 1px solid white;
        }

        .cta-button:hover:not(.secondary) {
            background-color: #f0f0f0;
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .cta-button.secondary:hover {
            background-color: rgba(255, 255, 255, 0.1);
            transform: translateY(-3px);
        }

        /* Footer */
        .footer {
            text-align: center;
            padding: 30px 0;
            font-size: 14px;
            letter-spacing: 1px;
            font-weight: 300;
            margin-top: auto;
        }

        /* Botón de menú */
        .menu-button {
            display: none;
            position: fixed;
            top: 30px;
            right: 30px;
            z-index: 1000;
            background-color: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(5px);
            border-radius: 0;
        }

        .menu-button mat-icon {
            color: white;
        }

        /* Menú móvil */
        .mobile-menu {
            display: none;
            position: fixed;
            top: 0;
            right: -100%;
            width: 100%;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.95);
            z-index: 999;
            transition: right 0.5s ease;
            flex-direction: column;
            align-items: center;
            padding-top: 100px;
        }

        .mobile-menu.show-menu {
            right: 0;
        }

        .mobile-header {
            position: absolute;
            top: 30px;
            right: 30px;
        }

        .close-button {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 0;
        }

        .close-button mat-icon {
            color: white;
        }

        .mobile-item {
            color: white;
            text-decoration: none;
            padding: 20px 0;
            font-size: 24px;
            letter-spacing: 3px;
            text-transform: uppercase;
            font-weight: 300;
            transition: all 0.3s ease;
            position: relative;
        }

        .mobile-item::after {
            content: '';
            position: absolute;
            bottom: 15px;
            left: 0;
            width: 0;
            height: 1px;
            background-color: white;
            transition: width 0.3s ease;
        }

        .mobile-item:hover::after {
            width: 100%;
        }

        /* Responsividad */
        @media (max-width: 1100px) {
            .main-logo {
                transition: 1.4s cubic-bezier(0.8, 0, 0, 1);
                position: relative;
                z-index: 6;
                pointer-events: none;
                padding-top: 12rem;
                font-family: Canopee, Helvetica, Arial, sans-serif;
                font-size: 17.2vw;
                text-indent: -1vw;
                color: rgb(22, 20, 10);
                transform: translateX(0px);
            }
            
            .tagline {
                font-size: 20px;
            }
        }

        @media (max-width: 900px) {
            .main-logo {
                transition: 1.4s cubic-bezier(0.8, 0, 0, 1);
                position: relative;
                z-index: 6;
                pointer-events: none;
                padding-top: 12rem;
                font-family: Canopee, Helvetica, Arial, sans-serif;
                font-size: 17.2vw;
                text-indent: -1vw;
                color: rgb(22, 20, 10);
                transform: translateX(0px);
            }
            
            .tagline {
                font-size: 18px;
            }
            
            .cta-container {
                flex-direction: column;
                align-items: center;
                gap: 15px;
            }
            
            .header-links {
                gap: 40px;
            }
        }

        @media (max-width: 768px) {
            .top-header {
                display: none;
            }

            .menu-button {
                display: block;
            }

            .mobile-menu {
                display: flex;
            }

            .main-logo {
                transition: 1.4s cubic-bezier(0.8, 0, 0, 1);
                position: relative;
                z-index: 6;
                pointer-events: none;
                padding-top: 12rem;
                font-family: Canopee, Helvetica, Arial, sans-serif;
                font-size: 17.2vw;
                text-indent: -1vw;
                color: rgb(22, 20, 10);
                transform: translateX(0px);
            }
            
            .tagline {
                font-size: 16px;
            }
            
            .cta-button {
                min-width: 200px;
                padding: 12px 30px;
            }
        }

        @media (max-width: 480px) {
            .main-logo {
                transition: 1.4s cubic-bezier(0.8, 0, 0, 1);
                position: relative;
                z-index: 6;
                pointer-events: none;
                padding-top: 12rem;
                font-family: Canopee, Helvetica, Arial, sans-serif;
                font-size: 17.2vw;
                text-indent: -1vw;
                color: rgb(22, 20, 10);
                transform: translateX(0px);
            }
            
            .tagline {
                font-size: 14px;
                letter-spacing: 1px;
            }
            
            .cta-button {
                min-width: 180px;
                padding: 10px 25px;
                font-size: 14px;
            }
        }
    `]
})
export class HomeComponent {
    isMenuOpen = false;

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        // Deshabilitar scroll cuando el menú está abierto
        if (this.isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}