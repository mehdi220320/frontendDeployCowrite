import {Component, OnInit} from '@angular/core';
import {RoomsService} from '../services/rooms.service';
import {Room} from '../models/Room';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';

@Component({
  selector: 'app-rooms',
  standalone: false,
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent implements OnInit{
  rooms: Room[] = [];
  myrooms: Room[] = [];
  visibleRooms: Room[] = [];
  currentIndex: number = 0;
  itemsToShow: number = 4;
  userId: string | null = null;
  code:string='';

  constructor(
    private roomService: RoomsService,
    private sanitizer: DomSanitizer,
    private router:Router
  ) {}

  sanitizeImageUrl(url: { path: string } | null): SafeUrl | string {
    return url ?
      this.sanitizer.bypassSecurityTrustResourceUrl(url.path) :
      "assets/img/img.png";
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('user_id');

    this.loadAllRooms();
    this.loadMyRooms();
  }

  loadAllRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: (response) => {
        this.rooms = response;
      },
      error: (err) => {
        console.error('Error fetching all rooms:', err);
      }
    });
  }

  loadMyRooms(): void {
    if (!this.userId) return;

    this.roomService.getMyRooms(this.userId).subscribe({
      next: (response) => {
        this.myrooms = response;
        this.updateVisibleRooms();
      },
      error: (err) => {
        console.error('Error fetching my rooms:', err);
      }
    });
  }

  updateVisibleRooms(): void {
    this.visibleRooms = this.myrooms.slice(
      this.currentIndex,
      this.currentIndex + this.itemsToShow
    );
  }

  moveRight(): void {
    if (this.canMoveRight()) {
      this.currentIndex++;
      this.updateVisibleRooms();
    }
  }

  moveLeft(): void {
    if (this.canMoveLeft()) {
      this.currentIndex--;
      this.updateVisibleRooms();
    }
  }

  canMoveRight(): boolean {
    return this.currentIndex + this.itemsToShow < this.myrooms.length;
  }

  canMoveLeft(): boolean {
    return this.currentIndex > 0;
  }
  joinRoom() {
    console.log('Code before join:', this.code); // Check the value
    this.roomService.join({code: this.code, userId: this.userId}).subscribe({
      next: (response) => {
        this.router.navigate(['/room/'+response.room._id]);
      },
      error: (err) => {
        console.error('Error joining room:', err);
      }
    });
  }
}
