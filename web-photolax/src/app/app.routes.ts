import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ContestListComponent } from './components/contest/contest-list/contest-list.component';
import { RulesComponent } from './components/rules/rules.component';
import { RalliesComponent } from './components/rallies/rallies.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'rules', component: RulesComponent },
    { path: 'rallies', component: RalliesComponent },
    { 
        path: 'contests',
        component: ContestListComponent,
        canActivate: [authGuard]
    },
    // Ruta wildcard para manejar rutas no encontradas
    { path: '**', redirectTo: '' }
];
