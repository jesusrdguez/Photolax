import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}`;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    private tokenSubject = new BehaviorSubject<string | null>(null);

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && this.isTokenValid(token)) {
            this.tokenSubject.next(token);
            if (user) this.currentUserSubject.next(JSON.parse(user));
        } else {
            this.logout();
        }
    }

    get currentUser$(): Observable<User | null> {
        return this.currentUserSubject.asObservable();
    }

    get token$(): Observable<string | null> {
        return this.tokenSubject.asObservable();
    }

    get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    get tokenValue(): string | null {
        const token = this.tokenSubject.value;
        if (token && !this.isTokenValid(token)) {
            this.logout();
            return null;
        }
        return token;
    }

    login(credentials: { usernameOrEmail: string; password: string }): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                this.tokenSubject.next(response.token);
                this.currentUserSubject.next(response.user);
            })
        );
    }

    register(userData: any): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, userData).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                this.tokenSubject.next(response.token);
                this.currentUserSubject.next(response.user);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.tokenSubject.next(null);
        this.currentUserSubject.next(null);
        this.router.navigate(['/']);
    }

    getCurrentUser(): Observable<User> {
        const userId = this.currentUserValue?.id;
        if (!userId) {
            throw new Error('No user ID available');
        }
        return this.http.get<User>(`${this.apiUrl}/users/${userId}`).pipe(
            tap(user => {
                this.currentUserSubject.next(user);
                localStorage.setItem('user', JSON.stringify(user));
            })
        );
    }

    updateUser(updates: Partial<User>): Observable<User> {
        const userId = this.currentUserValue?.id;
        if (!userId) {
            throw new Error('No user ID available');
        }
        return this.http.put<User>(`${this.apiUrl}/users/${userId}`, updates).pipe(
            tap(updatedUser => {
                const currentUser = this.currentUserValue;
                const newUser = { ...currentUser, ...updatedUser };
                localStorage.setItem('user', JSON.stringify(newUser));
                this.currentUserSubject.next(newUser);
            })
        );
    }

    deleteAccount(): Observable<void> {
        const userId = this.currentUserValue?.id;
        if (!userId) {
            throw new Error('No user ID available');
        }
        return this.http.delete<void>(`${this.apiUrl}/users/${userId}`).pipe(
            tap(() => {
                this.logout();
            })
        );
    }

    isLoggedIn(): boolean {
        const token = this.tokenValue;
        return !!token && this.isTokenValid(token);
    }

    getToken(): string | null {
        return this.tokenValue;
    }

    private isTokenValid(token: string): boolean {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decodedToken = JSON.parse(jsonPayload);
            const currentTime = Date.now() / 1000;

            return decodedToken.exp > currentTime;
        } catch (error) {
            return false;
        }
    }
} 