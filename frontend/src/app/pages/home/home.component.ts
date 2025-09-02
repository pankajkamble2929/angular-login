import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex flex-col justify-center items-center bg-[#f5f7fa] p-6">
      <!-- Logo / Brand -->
      <div class="mb-10 text-center">
        <h1 class="text-5xl font-extrabold text-[#ff6f61] mb-2">AngularAuthApp</h1>
        <p class="text-lg text-[#555555]">Secure Login & Registration with Angular + Node + MySQL</p>
      </div>

      <!-- Buttons -->
      <div class="flex flex-col sm:flex-row gap-6">
        <a routerLink="/login" 
           class="px-8 py-4 bg-[#00bfa6] text-white font-semibold rounded-lg shadow-lg hover:bg-[#00d3b5] transition">
           Login
        </a>
        <a routerLink="/register" 
           class="px-8 py-4 bg-[#ff6f61] text-white font-semibold rounded-lg shadow-lg hover:bg-[#ff8c7e] transition">
           Register
        </a>
      </div>

      <!-- Features / Cards -->
      <div class="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-6xl">
        <div class="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
          <h2 class="text-xl font-bold text-[#ff6f61] mb-2">Secure</h2>
          <p class="text-[#555555]">All passwords are encrypted and JWT authentication is used.</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
          <h2 class="text-xl font-bold text-[#00bfa6] mb-2">Role-based</h2>
          <p class="text-[#555555]">Admin and normal users have different access levels.</p>
        </div>
        <div class="bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
          <h2 class="text-xl font-bold text-[#ff6f61] mb-2">Responsive</h2>
          <p class="text-[#555555]">Mobile-friendly design with modern UI components.</p>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class HomeComponent {}
