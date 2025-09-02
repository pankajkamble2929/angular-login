import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FormsModule, NgForm } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
  is_active: number;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#f5f7fa] p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-[#ff6f61]">Users List</h1>
        <button
          (click)="goDashboard()"
          class="bg-[#00bfa6] text-white px-4 py-2 rounded-lg hover:bg-[#00d4b8] cursor-pointer transition"
        >
          Dashboard
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg shadow-lg">
          <thead class="bg-[#ff6f61] text-white">
            <tr>
              <th class="px-4 py-2">Name</th>
              <th class="px-4 py-2">Email</th>
              <th class="px-4 py-2">Type</th>
              <th class="px-4 py-2">Active</th>
              <th *ngIf="isAdmin" class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users" class="border-b hover:bg-gray-100">
              <td class="px-4 py-2">{{ user.name }}</td>
              <td class="px-4 py-2">{{ user.email }}</td>
              <td class="px-4 py-2">{{ user.user_type }}</td>
              <td class="px-4 py-2">{{ user.is_active ? 'Yes' : 'No' }}</td>
              <td *ngIf="isAdmin" class="px-4 py-2 space-x-2">
                <button
                  (click)="confirmToggleActive(user)"
                  class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 cursor-pointer"
                >
                  {{ user.is_active ? 'Deactivate User' : 'Activate User' }}
                </button>
                <button
                  (click)="editUser(user)"
                  class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  (click)="deleteUser(user)"
                  class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Edit Modal -->
      <div
        *ngIf="editingUser"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 class="text-2xl font-bold mb-4">Edit User</h2>
          <form #editForm="ngForm" (ngSubmit)="submitEdit(editForm)">
            <div class="mb-4">
              <label class="block mb-1">Name</label>
              <input
                type="text"
                name="name"
                [(ngModel)]="editingUser.name"
                class="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                [(ngModel)]="editingUser.email"
                class="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block mb-1">User Type</label>
              <select
                name="user_type"
                [(ngModel)]="editingUser.user_type"
                class="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="admin">Admin</option>
                <option value="normal">Normal</option>
              </select>
            </div>
            <div class="flex justify-end space-x-2">
              <button
                type="button"
                (click)="editingUser = null"
                class="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-[#00bfa6] text-white px-4 py-2 rounded hover:bg-[#00d4b8] cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  editingUser: User | null = null;
  isAdmin = false;
  private backendUrl = environment.backendUrl;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    this.isAdmin = userData.user_type === 'admin';
    this.fetchUsers();
  }

  fetchUsers() {
    const token = localStorage.getItem('token') || '';
    this.http
      .get<User[]>(`${this.backendUrl}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .subscribe(
        (res) => (this.users = res),
        (err) => console.error(err)
      );
  }

  toggleActive(user: User) {
    const token = localStorage.getItem('token') || '';
    this.http
      .put(
        `${this.backendUrl}/users/${user.id}`,
        { is_active: user.is_active ? 0 : 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .subscribe(
        () => this.fetchUsers(),
        (err) => console.error(err)
      );
  }

  confirmToggleActive(user: User) {
    const action = user.is_active ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    this.toggleActive(user);
  }

  editUser(user: User) {
    this.editingUser = { ...user }; // shallow copy
  }

  submitEdit(form: NgForm) {
    if (!this.editingUser) return;
    const token = localStorage.getItem('token') || '';
    this.http
      .put(`${this.backendUrl}/users/${this.editingUser.id}`, this.editingUser, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe(
        () => {
          this.fetchUsers();
          this.editingUser = null;
        },
        (err) => console.error(err)
      );
  }

  deleteUser(user: User) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const token = localStorage.getItem('token') || '';
    this.http
      .delete(`${this.backendUrl}/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe(
        () => this.fetchUsers(),
        (err) => console.error(err)
      );
  }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
