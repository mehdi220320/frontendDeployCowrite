import { Component } from '@angular/core';
import {Book} from '../models/Book';
import {Room} from '../models/Room';
import {BooksService} from '../services/books.service';
import {RoomsService} from '../services/rooms.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  books: Book[] = [];
  rooms: Room[] = [];
  allItems: (Book | Room)[] = [];
  filteredItems: (Book | Room)[] = [];
  displayedItems: (Book | Room)[] = [];

  searchTerm: string = '';
  activeFilter: string = 'all';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(
    private bookService: BooksService,
    private roomService: RoomsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.bookService.getAllBook().subscribe({
      next: (response) => {
        this.books = response;
        this.combineItems();
      }
    });

    this.roomService.getAllRooms().subscribe({
      next: (response) => {
        this.rooms = response;
        this.combineItems();
      }
    });
  }

  combineItems() {
    this.allItems = [...this.books, ...this.rooms];
    this.filterItems();
  }

  filterItems() {
    const term = this.searchTerm.toLowerCase();

    let items: (Book | Room)[] = [];
    if (this.activeFilter === 'all') {
      items = [...this.allItems];
    } else if (this.activeFilter === 'books') {
      items = [...this.books];
    } else if (this.activeFilter === 'rooms') {
      items = [...this.rooms];
    }

    this.filteredItems = items.filter(item =>
      ('title' in item ? item.title : item.name).toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );

    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filtering
    this.generatePageNumbers();
    this.updateDisplayedItems();
  }

  generatePageNumbers() {
    this.pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
  }

  updateDisplayedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedItems = this.filteredItems.slice(startIndex, endIndex);
  }

  onSearchChange() {
    this.filterItems();
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.filterItems();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.generatePageNumbers();
    this.updateDisplayedItems();
    window.scrollTo(0, 0);
  }

  navigateToItem(item: Book | Room) {
    if ('title' in item) {
      this.router.navigate(['/book', item._id]);
    } else {
      this.router.navigate(['/room', item._id]);
    }
  }

  getItemTitle(item: Book | Room): string {
    return 'title' in item ? item.title : item.name;
  }

  getItemCoverImage(item: Book | Room): string {
    return item.coverImage?.path || "assets/img/img.png";
  }

  getItemType(item: Book | Room): string {
    return 'title' in item ? 'book' : 'room';
  }
}
