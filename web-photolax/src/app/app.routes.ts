import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { RulesComponent } from './components/rules/rules.component';
import { RalliesComponent } from './components/rallies/rallies.component';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { PhotoUploadComponent } from './components/photo-upload/photo-upload.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminComponent } from './components/admin/admin.component';
import { RallyPhotosComponent } from './components/rally-photos/rally-photos.component';

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
        path: 'account', 
        component: AccountComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'contests/:title/participate',
        component: PhotoUploadComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'contests/:title/photos',
        component: RallyPhotosComponent
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AdminGuard]
    },
    { path: '**', redirectTo: '' }
];
