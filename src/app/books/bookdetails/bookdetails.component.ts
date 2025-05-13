import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Book} from '../../models/Book';
import {BooksService} from '../../services/books.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-bookdetails',
  standalone: false,
  templateUrl: './bookdetails.component.html',
  styleUrl: './bookdetails.component.css'
})
export class BookdetailsComponent implements OnInit{
  bookId="";
  book:Book={
    _id:"",
    title:"",
    description:"",
    createdBy:{_id:"",name:""},
    chapters:[],
    completed:false,
    coverImage:{path:"",contentType:""},
    createdAt:"",
    lastChapterDeclared:"",
    room:"",
    __v:"",
    type:"",
    updatedAt:""
  }
  constructor(private route:ActivatedRoute,private bookService:BooksService,private sanitizer:DomSanitizer ) {
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.bookId = params['id'];
      console.log(this.bookId);
    });
    this.bookService.getBookById(this.bookId).subscribe({
      next:(response)=>{
        this.book=response;
      },error:(err)=>{console.error(err)}
    })

  }

  sanitizeImageUrl(url: { path: string } | null): SafeUrl | string {
    return url ?
      this.sanitizer.bypassSecurityTrustResourceUrl(url.path) :
      "assets/img/img.png";
  }
}
