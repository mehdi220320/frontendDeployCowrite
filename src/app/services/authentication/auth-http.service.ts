import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
declare var google:any;

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  private apiUrl = 'http://localhost:3000/auth';
  private tokenKey = 'auth_token';
  private roleKey = 'user_role';
  private userKey='user_id';
  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string, role: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password, role }).pipe(
      tap((response: any) => {
        if (response.token && response.user.role) {
          this.setToken(response.token);
          this.setUserRole(response.user.role);
          this.setId(response.user.id)

        }
      })
    );
  }


  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {

        if (response.token && response.user.role) {
          this.setToken(response.token);
          this.setUserRole(response.user.role);
          this.setId(response.user.id)
        }
      })
    );
  }
  loginWithGoogle(credential: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/google-auth`, { credential }).pipe(
      tap((response: any) => {
        console.log(response)

        if (response.token && response.user.role) {
          this.setToken(response.token);
          this.setUserRole(response.user.role);
          this.setId(response.user.id)
        }
      })
    );
  }
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUserRole(role: string): void {
    localStorage.setItem(this.roleKey, role);
  }
  setId(id:string):void{
    localStorage.setItem(this.userKey, id);
  }
  getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }
  isGoogleAuth(): boolean {
    return localStorage.getItem('auth_source') === 'google';
  }

  googleSignOut(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof google !== 'undefined') {
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke(localStorage.getItem('email'), () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
  clearAuthData(): void {
    this.logout();
    localStorage.removeItem('auth_source');
    localStorage.removeItem('email');
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp === undefined) return true;
      return decoded.exp > (Date.now() / 1000);
    } catch {
      return false;
    }
  }
}
