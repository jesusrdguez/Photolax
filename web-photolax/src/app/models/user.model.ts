export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password?: string;
    role?: 'USER' | 'ADMIN';
    registrationDate?: string | Date;
}

export interface AuthResponse {
    accessToken: string;
    tokenType?: string;
    user: User;
}

export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
} 