import {Component, OnInit} from '@angular/core';
import {Book} from '../models/Book';
import {Room} from '../models/Room';
import {BooksService} from '../services/books.service';
import {RoomsService} from '../services/rooms.service';

@Component({
  selector: 'app-accueil',
  standalone: false,
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit{
  books: Book[] = [];
  rooms: Room[] = [];
  suggestedBook: Book | null = null;
  displayedBooks: Book[] = [];
  displayedRooms: Room[] = [];
  booksToShow = 3;
  roomsToShow = 3;
  bookGenres = ['All', 'Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Thriller', 'Horror', 'Non-Fiction'];
  activeGenre = 'All';

  constructor(
    private bookService: BooksService,
    private roomService: RoomsService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.bookService.getAllBook().subscribe({
      next: (response) => {
        this.books = response;
        this.displayedBooks = this.books.slice(this.books.length-this.booksToShow, this.books.length);
        this.setSuggestedBook();
      },
      error: (err) => console.error('Error loading books:', err)
    });

    this.roomService.getAllRooms().subscribe({
      next: (response) => {
        this.rooms = response;
        this.displayedRooms = this.rooms.slice(this.rooms.length-this.roomsToShow, this.rooms.length);
      },
      error: (err) => console.error('Error loading rooms:', err)
    });
  }

  setSuggestedBook() {
    if (this.books.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.books.length);
      this.suggestedBook = this.books[randomIndex];
    }
  }

  getRoomUsers(roomId: string): any[] {
    const room = this.rooms.find(r => r._id === roomId);
    return room ? room.users : [];
  }

  getRandomRating(): string {
    return (Math.random() * 2.5 + 7).toFixed(1);
  }

  getItemCoverImage(item: Book | Room): string {
    return item.coverImage?.path || "assets/img/img.png";
  }

  filterBooksByGenre(genre: string) {
    this.activeGenre = genre;
    this.booksToShow = 4; // Reset to initial count when filtering
    if (genre === 'All') {
      this.displayedBooks = this.books.slice(0, this.booksToShow);
    } else {
      const filtered = this.books.filter(book =>
        book.type.toLowerCase() === genre.toLowerCase()
      );
      this.displayedBooks = filtered.slice(0, this.booksToShow);
    }
  }

  showMoreBooks() {
    this.booksToShow += 3;
    if (this.activeGenre === 'All') {
      this.displayedBooks = this.books.slice(0, this.booksToShow);
    } else {
      const filtered = this.books.filter(book =>
        book.type.toLowerCase() === this.activeGenre.toLowerCase()
      );
      this.displayedBooks = filtered.slice(0, this.booksToShow);
    }
  }

  showMoreRooms() {
    this.roomsToShow += 3;
    this.displayedRooms = this.rooms.slice(0, this.roomsToShow);
  }

  trackById(index: number, item: any): string {
    return item._id;
  }
}
