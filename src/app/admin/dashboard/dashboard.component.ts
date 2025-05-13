import { Component,OnInit } from '@angular/core';
import {Chart, registerables} from 'chart.js';
import {BooksService} from '../../services/books.service';
import {RoomsService} from '../../services/rooms.service';
import {UserService} from '../../services/user.service';
import {User} from '../../models/User';
import {Book} from '../../models/Book';
import {Room} from '../../models/Room';

interface Activity {
  type: string;
  icon: string;
  color: string;
  title: string;
  time: string;
  item: Book | Room | User;
}
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  rooms: Room[] = [];
  books: Book[] = [];
  users: User[] = [];
  loading = true;
  chart: any;

  constructor(
    private bookService: BooksService,
    private roomService: RoomsService,
    private userService: UserService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    // Load books
    this.bookService.getAllBook().subscribe({
      next: (resp) => {
        this.books = Array.isArray(resp) ? resp : [];
        this.renderChart();
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.books = [];
      }
    });

    // Load rooms with better error handling
    this.roomService.getAllRooms().subscribe({
      next: (resp) => {
        this.rooms = this.sanitizeRooms(resp);
        console.log("Rooms loaded:", this.rooms);
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
        this.rooms = [];
      }
    });

    // Load users
    this.userService.getAll().subscribe({
      next: (resp) => {
        this.users = Array.isArray(resp) ? resp : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.users = [];
        this.loading = false;
      }
    });
  }

  // Sanitize room data to ensure it has required properties
  private sanitizeRooms(rooms: any[]): Room[] {
    if (!Array.isArray(rooms)) return [];

    return rooms.map(room => ({
      _id: room._id || '',
      name: room.name || 'Unnamed Room',
      code: room.code || '',
      createdBy: room.createdBy || { _id: '', name: 'Unknown' },
      users: Array.isArray(room.users) ? room.users : [],
      pendingMembers: Array.isArray(room.pendingMembers) ? room.pendingMembers : [],
      description: room.description || '',
      coverImage: room.coverImage || { path: '', contentType: '' },
      visibility: room.visibility || 'private'
    }));
  }

  renderChart() {
    // Destroy previous chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = document.getElementById('monthlyChart') as HTMLCanvasElement;
    if (!ctx) return;

    const bookTypes = this.countBooksByType();

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(bookTypes),
        datasets: [{
          label: 'Books by Type',
          data: Object.values(bookTypes),
          backgroundColor: '#4e73df',
          borderColor: '#4e73df',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  countBooksByType(): {[key: string]: number} {
    const counts: {[key: string]: number} = {};
    this.books.forEach(book => {
      if (book.type) {
        counts[book.type] = (counts[book.type] || 0) + 1;
      }
    });
    return counts;
  }

  getBookCompletionPercentage(): number {
    if (!this.books.length) return 0;
    const completed = this.books.filter(book => book.completed).length;
    return Math.round((completed / this.books.length) * 100);
  }

  getActiveUserPercentage(): number {
    if (!this.users.length) return 0;
    const active = this.users.filter(user => user.isActivated).length;
    return Math.round((active / this.users.length) * 100);
  }

  getAvgRoomMembers(): number {
    if (!this.rooms.length) return 0;
    const totalMembers = this.rooms.reduce((sum, room) => sum + (room.users?.length || 0), 0);
    return Math.round(totalMembers / this.rooms.length);
  }

  getRoomVisibilityStats(): {type: string, count: number, percentage: number}[] {
 return  []
  }
  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
