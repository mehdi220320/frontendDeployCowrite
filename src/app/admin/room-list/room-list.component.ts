import { Component } from '@angular/core';
import {Room} from '../../models/Room';
import {RoomsService} from '../../services/rooms.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';


@Component({
  selector: 'app-room-list',
  standalone: false,
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  paginatedRooms: Room[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private roomService: RoomsService,
              private sanitizer: DomSanitizer) {}
  sanitizeImageUrl(url: { path: string } | null): SafeUrl | string {
    return url ?
      this.sanitizer.bypassSecurityTrustResourceUrl(url.path) :
      "assets/img/img.png";
  }
  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.roomService.getAllRooms().subscribe({
      next: (response) => {
        this.rooms = response;
        this.filteredRooms = [...this.rooms];
        this.calculateTotalPages();
        this.updatePaginatedRooms();
      }
    });
  }

  onSearch() {
    if (!this.searchTerm) {
      this.filteredRooms = [...this.rooms];
    } else {
      this.filteredRooms = this.rooms.filter(room =>
        room.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        room.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        room.createdBy.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        room._id.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.calculateTotalPages();
    this.updatePaginatedRooms();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredRooms.length / this.itemsPerPage);
  }

  updatePaginatedRooms() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRooms = this.filteredRooms.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedRooms();
    }
  }

  getVisibilityClass(visibility: string): string {
    switch (visibility.toLowerCase()) {
      case 'public':
        return 'status-active';
      case 'private':
        return 'status-inactive';
      default:
        return 'status-pending';
    }
  }

}
