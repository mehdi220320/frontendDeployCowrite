import {Component, OnInit} from '@angular/core';
import {BooksService} from '../services/books.service';
import {Book} from '../models/Book';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-books',
  standalone: false,
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit{
  constructor(private bookService:BooksService,private sanitizer:DomSanitizer) {}
  books:Book[]=[]

  ngOnInit(): void {
    this.bookService.getAllBook().subscribe({
      next:(response)=>{this.books=response; console.log('ktouba'+response)},error:(err)=>console.log(err)})
  }
  sanitizeImageUrl(url: { path: string } | null): SafeUrl | string {
    return url ?
      this.sanitizer.bypassSecurityTrustResourceUrl(url.path) :
      "assets/img/img.png";
  }
}
