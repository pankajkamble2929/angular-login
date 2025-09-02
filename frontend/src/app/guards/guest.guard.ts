import { CanActivateFn } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  if (token) {
    // ✅ Already logged in → redirect to dashboard
    window.location.href = '/dashboard';
    return false;
  }
  return true; // ✅ Allow access to home/login/register
};
