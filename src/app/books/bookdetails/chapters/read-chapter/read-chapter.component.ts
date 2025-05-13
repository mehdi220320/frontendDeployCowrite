import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BooksService} from '../../../../services/books.service';
import {ChapterService} from '../../../../services/chapter.service';
import {Book} from '../../../../models/Book';
import {Chapter} from '../../../../models/Chapter';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-read-chapter',
  standalone: false,
  templateUrl: './read-chapter.component.html',
  styleUrl: './read-chapter.component.css'
})
export class ReadChapterComponent implements OnInit{
  bookId="";
  chapterId="";
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
  chapter: Chapter = {
    _id: '',
    title:'',
    chapterNumber: 0,
    book: {title:''},
    confirmedVersion: {_id:'',content:''},
    createdAt: '',
    updatedAt: '',
    chapterDeadline:'',
    createdBy: {_id: '', name: ''}
  };

  constructor(private route:ActivatedRoute,
              private bookService:BooksService,
              private chapterService:ChapterService,
              private sanitizer: DomSanitizer,
              private router:Router){};
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bookId = params['id'];
      this.chapterId=params['chapterId'];
      console.log(this.bookId);
    });
    this.bookService.getBookById(this.bookId).subscribe({
      next:(response)=>{
        this.book=response
      },error:(err)=>{console.error(err)}
    });
    this.chapterService.getChapterById(this.chapterId).subscribe({
      next:(response)=>{
        this.chapter=response
      },error:(err)=>{console.error(err)}
    })
  }
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  previous() {
    if (!this.book?.chapters?.length) {
      console.log("No chapters available");
      return;
    }

    const currentIndex = this.book.chapters.findIndex(
      (chap: any) => chap._id === this.chapterId
    );

    if (currentIndex > 0) {
      const prevChapterId = this.book.chapters[currentIndex - 1]._id;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([`/book/${this.bookId}/chapter/${prevChapterId}`]);
      });
    }
  }

  next() {
    if (!this.book?.chapters?.length) {
      console.log("No chapters available");
      return;
    }

    const currentIndex = this.book.chapters.findIndex(
      (chap: any) => chap._id === this.chapterId
    );

    if (currentIndex < this.book.chapters.length - 1) {
      const nextChapterId = this.book.chapters[currentIndex + 1]._id;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([`/book/${this.bookId}/chapter/${nextChapterId}`]);
      });
    }
  }
}
