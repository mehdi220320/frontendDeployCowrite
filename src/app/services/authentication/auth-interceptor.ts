import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import {AuthHttpService} from './auth-http.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthHttpService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (request.url.includes('/auth/login') || request.url.includes('/auth/register')) {
      return next.handle(request);
    }

    if (!token) {
      return next.handle(request);
    }

    if (this.isTokenExpired(token)) {
      this.handleTokenExpiration();
      return throwError(() => new Error('Token expired'));
    }

    const modifiedRequest = request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });

    return next.handle(modifiedRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.handleTokenExpiration();
        }
        return throwError(() => error);
      })
    );
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp === undefined) return false;
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token', error);
      return true;
    }
  }

  private handleTokenExpiration(): void {
    this.authService.logout();

    if (this.authService.isGoogleAuth()) {
      this.authService.googleSignOut().then(() => {
        this.redirectToLogin();
      });
    } else {
      this.redirectToLogin();
    }
  }

  private redirectToLogin(): void {
    this.router.navigate(['/login'], {
      queryParams: {
        expired: 'true',
        returnUrl: this.router.url
      }
    });
  }
}
