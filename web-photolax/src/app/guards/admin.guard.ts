import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    canActivate(): boolean {
        if (this.authService.isLoggedIn() && this.authService.currentUserValue?.role === 'ADMIN') {
            return true;
        }

        this.toastr.error('You need admin privileges to access this page');
        this.router.navigate(['']);
        return false;
    }
} 