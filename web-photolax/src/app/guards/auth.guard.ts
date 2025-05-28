import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toastr = inject(ToastrService);

    if (authService.isAuthenticated()) {
        return true;
    }

    toastr.error('Please login to access this page');
    router.navigate(['/login']);
    return false;
}; 