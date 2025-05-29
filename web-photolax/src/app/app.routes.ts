import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ContestListComponent } from './components/contest/contest-list/contest-list.component';
import { RulesComponent } from './components/rules/rules.component';
import { RalliesComponent } from './components/rallies/rallies.component';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { 
        path: 'login', 
        component: LoginComponent,
        canActivate: [NoAuthGuard]
    },
    { 
        path: 'register', 
        component: RegisterComponent,
        canActivate: [NoAuthGuard]
    },
    { path: 'rules', component: RulesComponent },
    { path: 'rallies', component: RalliesComponent },
    { 
        path: 'contests',
        component: ContestListComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'account', 
        component: AccountComponent,
        canActivate: [AuthGuard]
    },
    // Ruta wildcard para manejar rutas no encontradas
    { path: '**', redirectTo: '' }
];
