import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (token) {
    return true; // ✅ Allow access to private routes
  } else {
    alert('You must login first!');
    window.location.href = '/login';
    return false;
  }
};
