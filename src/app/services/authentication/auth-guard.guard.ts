import {CanActivateFn, Router} from '@angular/router';
import {AuthHttpService} from './auth-http.service';
import {inject} from '@angular/core';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthHttpService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data?.['role'];

  if (!requiredRole) {
    return true;
  }

  const userRole = authService.getUserRole();

  if (userRole === requiredRole) {
    return true;
  } else {
    if (userRole === 'Admin') {
      router.navigate(['/admin']);
    } else {
      router.navigate(['/acceuil']);
    }
    return false;
  }
};
