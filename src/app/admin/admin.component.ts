import { Component } from '@angular/core';
import {AuthHttpService} from '../services/authentication/auth-http.service';
import {Router} from '@angular/router';
declare var google:any;

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(private authService:AuthHttpService,private router:Router) {
  }

  logout(): void {
    this.authService.logout();

    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      try {
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke(localStorage.getItem('email'), (done: {success: boolean})  => {
          console.log('Google session revoked');
        });
      } catch (e) {
        console.warn('Google Sign-Out error:', e);
      }
    }

    localStorage.clear();

    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });

  }

}
