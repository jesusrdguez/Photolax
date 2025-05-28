import { Injectable, inject } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpInterceptorFn,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private toastr: ToastrService
    ) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An error occurred';

                if (error.error instanceof ErrorEvent) {
                    errorMessage = error.error.message;
                } else {
                    if (error.status === 401) {
                        this.authService.logout();
                        errorMessage = 'Session expired. Please login again.';
                    } else if (error.error?.message) {
                        errorMessage = error.error.message;
                    } else {
                        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                    }
                }

                this.toastr.error(errorMessage);
                return throwError(() => error);
            })
        );
    }
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const toastr = inject(ToastrService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An error occurred';

            if (error.error instanceof ErrorEvent) {
                errorMessage = error.error.message;
            } else {
                if (error.status === 401) {
                    authService.logout();
                    errorMessage = 'Session expired. Please login again.';
                } else if (error.error?.message) {
                    errorMessage = error.error.message;
                } else {
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
            }

            toastr.error(errorMessage);
            return throwError(() => error);
        })
    );
}; 