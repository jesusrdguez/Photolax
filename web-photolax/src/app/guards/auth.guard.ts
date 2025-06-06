import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    canActivate(): boolean {
        if (this.authService.isLoggedIn()) {
            return true;
        }

        this.toastr.error('Please login to access this page');
        this.router.navigate(['/login']);
        return false;
    }
} 