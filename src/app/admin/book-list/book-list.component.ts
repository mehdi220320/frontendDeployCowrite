import { Component } from '@angular/core';
import {BooksService} from '../../services/books.service';
import {Book} from '../../models/Book';

@Component({
  selector: 'app-book-list',
  standalone: false,
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  paginatedBooks: Book[] = [];
  searchTerm: string = '';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  totalItems: number = 0;

  constructor(private bookService: BooksService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getAllBook().subscribe({
      next: (response) => {
        this.books = response;
        this.totalItems = this.books.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.filterBooks();
      },
      error: (err) => console.error('Error loading books:', err)
    });
  }

  filterBooks() {
    if (!this.searchTerm) {
      this.filteredBooks = [...this.books];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.type.toLowerCase().includes(term) ||
        book.room.toLowerCase().includes(term))
    }

    this.totalItems = this.filteredBooks.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filtering
    this.updatePaginatedBooks();
  }

  updatePaginatedBooks() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBooks = this.filteredBooks.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedBooks();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  deleteBook(bookId: string) {
    if (confirm('Are you sure you want to delete this book?')) {
      // this.bookService.deleteBook(bookId).subscribe({
      //   next: () => {
      //     this.books = this.books.filter(book => book._id !== bookId);
      //     this.filteredBooks = this.filteredBooks.filter(book => book._id !== bookId);
      //     this.totalItems = this.filteredBooks.length;
      //     this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      //
      //     // Adjust current page if needed
      //     if (this.currentPage > this.totalPages && this.totalPages > 0) {
      //       this.currentPage = this.totalPages;
      //     }
      //
      //     this.updatePaginatedBooks();
      //   },
      //   error: (err) => console.error('Error deleting book:', err)
      // });
    }
  }
}
