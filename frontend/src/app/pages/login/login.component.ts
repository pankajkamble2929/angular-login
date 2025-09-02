import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#f5f7fa] p-4">
      <div class="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
        <h1 class="text-3xl font-bold text-[#00bfa6] mb-6 text-center">Login</h1>

        <!-- Success / Error Messages -->
        <div *ngIf="successMsg" class="bg-green-100 text-green-800 p-3 mb-4 rounded transition">
          {{ successMsg }}
        </div>
        <div *ngIf="errorMsg" class="bg-red-100 text-red-800 p-3 mb-4 rounded transition">
          {{ errorMsg }}
        </div>

        <!-- Login Form -->
        <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
          <!-- Email -->
          <div class="mb-4">
            <label class="block mb-1 font-semibold text-[#1a1a1a]">Email</label>
            <input
              type="email"
              name="email"
              ngModel
              required
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6f61]"
            />
          </div>

          <!-- Password -->
          <div class="mb-6">
            <label class="block mb-1 font-semibold text-[#1a1a1a]">Password</label>
            <input
              type="password"
              name="password"
              ngModel
              required
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6f61]"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-[#00bfa6] text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-[#00d4b8] cursor-pointer transition"
          >
            Login
          </button>
        </form>

        <p class="mt-4 text-center text-[#555555]">
          Don't have an account?
          <a routerLink="/register" class="text-[#ff6f61] font-semibold hover:underline"
            >Register here</a
          >
        </p>

        <!-- Back to Home link -->
        <p class="mt-2 text-center">
          <a routerLink="/home" class="text-[#00bfa6] font-semibold hover:underline"
            >← Back to Home</a
          >
        </p>
      </div>
    </div>
  `,
  styles: [``],
})
export class LoginComponent implements OnInit {
  successMsg: string = '';
  errorMsg: string = '';
  private backendUrl = environment.backendUrl;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Redirect if already logged in
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      window.alert('Please fill all fields correctly!');
      return;
    }

    const formData = form.value;

    this.http.post(`${this.backendUrl}/auth/login`, formData).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.successMsg = 'Login successful!';
        this.errorMsg = '';
        window.alert(this.successMsg);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || 'Invalid email or password.';
        this.successMsg = '';
        window.alert(this.errorMsg);
      },
    });
  }
}
