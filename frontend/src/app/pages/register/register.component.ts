import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#f5f7fa] p-4">
      <div
        class="bg-white shadow-lg rounded-xl w-full max-w-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <!-- Left side form -->
        <div>
          <h1 class="text-3xl font-bold text-[#ff6f61] mb-6 text-center">Register</h1>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <!-- Name -->
            <div class="mb-4">
              <label class="block mb-1 font-semibold text-[#1a1a1a]">Name</label>
              <input
                type="text"
                formControlName="name"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bfa6]"
              />
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label class="block mb-1 font-semibold text-[#1a1a1a]">Email</label>
              <input
                type="email"
                formControlName="email"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bfa6]"
              />
            </div>

            <!-- Password -->
            <div class="mb-4 relative">
              <label class="block mb-1 font-semibold text-[#1a1a1a]">Password</label>
              <input
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bfa6]"
              />
              <span
                class="absolute right-3 top-9 cursor-pointer text-gray-600"
                (click)="togglePassword()"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </span>
            </div>

            <!-- User Type -->
            <div class="mb-6">
              <label class="block mb-1 font-semibold text-[#1a1a1a]">User Type</label>
              <select
                formControlName="user_type"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bfa6]"
              >
                <option value="" disabled>Select type</option>
                <option value="admin">Admin</option>
                <option value="normal">Normal User</option>
              </select>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="registerForm.invalid || loading"
              class="w-full flex items-center justify-center bg-[#ff6f61] text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-[#ff8c7e] cursor-pointer transition disabled:opacity-50"
            >
              <ng-container *ngIf="loading; else normalBtn">
                <svg
                  class="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Registering...
              </ng-container>
              <ng-template #normalBtn>Register</ng-template>
            </button>
          </form>

          <p class="mt-4 text-center text-[#555555]">
            Already have an account?
            <a routerLink="/login" class="text-[#00bfa6] font-semibold hover:underline"
              >Login here</a
            >
          </p>

          <!-- Back to Home link -->
          <p class="mt-2 text-center">
            <a routerLink="/home" class="text-[#ff6f61] font-semibold hover:underline"
              >← Back to Home</a
            >
          </p>
        </div>

        <!-- Right side validation + errors -->
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col space-y-4">
          <!-- Row 1: Validation rules -->
          <div>
            <h2 class="text-lg font-bold text-gray-700 mb-2">✅ Validation Requirements:</h2>
            <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Name should only contain alphabets.</li>
              <li>Email must be valid (e.g., name@example.com).</li>
              <li>Password must be 8–12 characters long.</li>
              <li>
                Password must contain:
                <ul class="list-disc list-inside ml-5">
                  <li>1 uppercase letter (A–Z)</li>
                  <li>1 lowercase letter (a–z)</li>
                  <li>1 number (0–9)</li>
                  <li>1 special character (@$!%*?&)</li>
                </ul>
              </li>
              <li>User Type is required (Admin or Normal).</li>
            </ul>
          </div>

          <!-- Row 2: Active form errors -->
          <div *ngIf="formErrors.length > 0" class="border-t pt-4">
            <h2 class="text-lg font-bold text-red-600 mb-2">⚠️ Please fix the following:</h2>
            <ul class="list-disc list-inside text-sm text-red-700 space-y-1">
              <li *ngFor="let err of formErrors">{{ err }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  formErrors: string[] = [];
  showPassword: boolean = false;
  loading: boolean = false; // NEW
  private backendUrl = environment.backendUrl;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/dashboard']);
    }

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(12),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/
          ),
        ],
      ],
      user_type: ['', Validators.required],
    });

    this.registerForm.statusChanges.subscribe(() => {
      this.updateErrors();
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  updateErrors() {
    this.formErrors = [];
    const controls = this.registerForm.controls;

    if (controls['name'].errors) {
      if (controls['name'].errors['required']) this.formErrors.push('Please enter Name.');
      if (controls['name'].errors['pattern'])
        this.formErrors.push('Name should contain only alphabets.');
    }

    if (controls['email'].errors) {
      if (controls['email'].errors['required']) this.formErrors.push('Please add Email.');
      if (controls['email'].errors['email']) this.formErrors.push('Please enter a valid Email.');
    }

    if (controls['password'].errors) {
      if (controls['password'].errors['required']) this.formErrors.push('Please enter Password.');
      if (controls['password'].errors['minlength'])
        this.formErrors.push('Password must be at least 8 characters.');
      if (controls['password'].errors['maxlength'])
        this.formErrors.push('Password must be less than 12 characters.');
      if (controls['password'].errors['pattern'])
        this.formErrors.push(
          'Password must contain 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.'
        );
    }

    if (controls['user_type'].errors) {
      if (controls['user_type'].errors['required'])
        this.formErrors.push('Please select User Type.');
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.updateErrors();
      return;
    }

    this.loading = true;

    this.http.post(`${this.backendUrl}/auth/register`, this.registerForm.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        window.alert(res.message || 'Registration successful! Please check your email.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.loading = false;
        window.alert(err.error?.message || 'Something went wrong.');
      },
    });
  }
}
