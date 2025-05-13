import { Component } from '@angular/core';
import {environment} from '../models/environment';
import {ActivatedRoute, Router} from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {AuthHttpService} from '../services/authentication/auth-http.service';
declare var google:any;
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null;
  showExpiredMessage = false;
  ExpiredMessage="your token is expired login again";
  constructor(
    private router: Router,
    private authService: AuthHttpService,
    private route: ActivatedRoute,

  ) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.handleLoginResponse(response);
      },
      error: (error) => {
        this.handleLoginError(error);
      }
    });
  }

  private   handleLoginResponse(response: any) {
    this.loading = false;

    if (response.token) {
      if (this.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      try {
        const decoded: any = jwtDecode(response.token);
        const userId = decoded.userId;
        const role = decoded.role;

        this.authService.setToken(response.token);
        this.authService.setUserRole(role);

        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/acceuil']);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.errorMessage = 'Login error. Please try again.';
      }
    }
  }

  private handleLoginError(error: any) {
    this.loading = false;
    console.error('Login error:', error);

    if (error.status === 401) {
      this.errorMessage = 'Invalid email or password';
    } else if (error.status === 0) {
      this.errorMessage = 'Cannot connect to server. Please check your connection.';
    } else {
      this.errorMessage = 'Login failed. Please try again later.';
    }
  }
  ngOnInit() {
    google.accounts.id.initialize({
      client_id: environment.client_id,
      callback: (response: any) => this.handleGoogleSignIn(response)
    });

    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangle',
      width: 350
    });

    google.accounts.id.prompt();
    this.route.queryParams.subscribe(params => {
      this.showExpiredMessage = params['expired'] === 'true';
    });
  }

  private handleGoogleSignIn(response: any) {
    this.loading = true;
    this.errorMessage = null;

    this.authService.loginWithGoogle(response.credential).subscribe({
      next: (authResponse) => {
        this.handleLoginResponse(authResponse);
      },
      error: (error) => {
        this.handleLoginError(error);
      }
    });
  }
}
