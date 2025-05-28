import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';

export const CONTEST_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./contest-list/contest-list.component').then(m => m.ContestListComponent)
    },
    {
        path: 'new',
        loadComponent: () => import('./contest-form/contest-form.component').then(m => m.ContestFormComponent),
        canActivate: [authGuard]
    },
    {
        path: ':id',
        loadComponent: () => import('./contest-detail/contest-detail.component').then(m => m.ContestDetailComponent)
    },
    {
        path: ':id/edit',
        loadComponent: () => import('./contest-form/contest-form.component').then(m => m.ContestFormComponent),
        canActivate: [authGuard]
    }
]; 