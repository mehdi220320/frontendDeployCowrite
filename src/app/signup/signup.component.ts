import { Component } from '@angular/core';
import {AuthHttpService} from '../services/authentication/auth-http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor(private authservice:AuthHttpService,private router:Router) {}
  firstName: any;
  lastName: any;
  role: any;
  confirmPassword:any;
  email:any;
  password:any;
  errorMessage: string | null = null;
  onRegister() {
    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const fullName = `${this.firstName} ${this.lastName}`;

    this.authservice.register(fullName, this.email, this.password, this.role).subscribe({
        next:(response)=>{
          alert("Registration successful!");
          this.router.navigate(['/acceuil']);
        },
        error:(error)=>{
          console.error(error)
          this.errorMessage=error.message
        }
      }
    );
  }

}
