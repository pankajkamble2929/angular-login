import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#f5f7fa] p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold text-[#00bfa6]">Dashboard</h1>
          <button
            (click)="logout()"
            class="bg-[#ff6f61] text-white px-4 py-2 rounded-lg hover:bg-[#ff8c7e] cursor-pointer transition"
          >
            Logout
          </button>
        </div>

        <!-- Welcome Card -->
        <div class="bg-white shadow-lg rounded-xl p-6 mb-6">
          <h2 class="text-2xl font-semibold text-[#1a1a1a]">Welcome, {{ user?.name }}</h2>
          <p class="text-gray-600 mt-2">
            You are logged in as <span class="font-semibold">{{ user?.user_type }}</span>
          </p>
        </div>

        <!-- Actions / Navigation -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            class="bg-[#ff6f61] text-white p-6 rounded-xl shadow-lg hover:bg-[#ff8c7e] cursor-pointer transition"
            (click)="navigateToUsers()"
          >
            <h3 class="text-xl font-bold mb-2">User Directory</h3>
            <p>View list of users (readonly for normal users)</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``],
})
export class DashboardComponent implements OnInit {
  user: any;

  constructor(private router: Router) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = JSON.parse(storedUser);
  }

  navigateToUsers() {
    this.router.navigate(['/users']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
