import { Component } from '@angular/core';
import {Room} from '../../../../models/Room';
import {RoomsService} from '../../../../services/rooms.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {ChapterService} from '../../../../services/chapter.service';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {Book} from '../../../../models/Book';
import {BooksService} from '../../../../services/books.service';
import { Location } from '@angular/common';
import {TextService} from '../../../../services/text.service';

@Component({
  selector: 'app-create-chapter',
  standalone: false,
  templateUrl: './create-chapter.component.html',
  styleUrl: './create-chapter.component.css'
})
export class CreateChapterComponent {
  title="";
  roomId="";
  chapterId="";
  lastUserContent = '';
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
  room: Room = {
    _id: "",
    name: "",
    code: "",
    createdBy: {
      _id: "",
      name: ""
    },
    users:[ {    _id: "", name: ""}],
    pendingMembers: [ {    _id: "", name: ""}],
    description: "",
    coverImage: {
      path: "",
      contentType: ""
    },
    visibility: ""
  };
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '30rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'yes',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    fonts: [
      { name: 'Arial', class: 'arial' },
      { name: 'Times New Roman', class: 'times-new-roman' },
      { name: 'Georgia', class: 'georgia' },
      { name: 'Verdana', class: 'verdana' },
      { name: 'Courier New', class: 'courier-new' },
      { name: 'Trebuchet MS', class: 'trebuchet-ms' },
      { name: 'Tahoma', class: 'tahoma' },
      { name: 'Comic Sans MS', class: 'comic-sans-ms' },
      { name: 'Impact', class: 'impact' },
      { name: 'Garamond', class: 'garamond' },
      { name: 'Palatino Linotype', class: 'palatino-linotype' },
      { name: 'Helvetica', class: 'helvetica' },
      { name: 'Franklin Gothic Medium', class: 'franklin-gothic-medium' },
      { name: 'Baskerville', class: 'baskerville' },
      { name: 'Roboto', class: 'roboto' },
      { name: 'Open Sans', class: 'open-sans' },
      { name: 'Lato', class: 'lato' },
      { name: 'Montserrat', class: 'montserrat' },
      { name: 'Poppins', class: 'poppins' },
      { name: 'Raleway', class: 'raleway' },
      { name: 'Source Sans Pro', class: 'source-sans-pro' },
      { name: 'Nunito', class: 'nunito' },
      { name: 'Merriweather', class: 'merriweather' },
      { name: 'Quicksand', class: 'quicksand' },
      { name: 'Ubuntu', class: 'ubuntu' },
      { name: 'Playfair Display', class: 'playfair-display' },
      { name: 'Oswald', class: 'oswald' },
      { name: 'PT Sans', class: 'pt-sans' }
    ]


  };
  HtmlContent='';
  chapterDeadline='';
  constructor(private roomService:RoomsService,
              private sanitizer: DomSanitizer,
              private  route:ActivatedRoute,
              private router:Router,
              private chapterService:ChapterService,
              private bookService:BooksService,
              private location: Location,
              private textservice:TextService) {}
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.roomId = params['id'];
      this.bookId=params['bookId']
    });
    this.roomService.getRoomById(this.roomId).subscribe({next:(response)=>{
        this.room=response;
        console.log("hello room : ",this.room);
      },error:(err)=>{
        console.error(err);
      }
    });
    this.bookService.getBookById(this.bookId).subscribe({next:(response)=>{
      this.book=response;
      },
      error:(err)=>{console.error(err)}
    })
  }
  sanitizeImageUrl(url: { path: string } | null): SafeUrl | string {
    return url ?
      this.sanitizer.bypassSecurityTrustResourceUrl(url.path) :
      "assets/img/img.png";
  }
  onRegister() {
    this.chapterService.addChapter({bookId:this.bookId,title:this.title,createdBy:localStorage.getItem('user_id'),chapterDeadline:this.chapterDeadline}).subscribe({
      next:(response)=>{
        this.chapterId=response._id
        const data={chapterId:this.chapterId,content:this.HtmlContent,createdBy:localStorage.getItem('user_id')};
        this.chapterService.AddChapterVersion(data).subscribe({
          next:(response)=>{
            this.router.navigate(['/room/'+this.roomId+'/chapter/'+this.chapterId]);
            console.log(response);
          },error:(err)=>{console.log(err)}
        })
      }
    })


  }

  cancel(){
    this.location.back();
  }

  backContent='';
  isReformulating = false;

  refCom() {
    const plainText = this.getPlainText(this.HtmlContent);
    this.backContent = this.lastUserContent = this.HtmlContent;
    this.isReformulating = true;

    this.textservice.ref({ text: plainText }).subscribe({
      next: (response) => {
        this.HtmlContent = response.result;

        // Start fade out after 2 seconds
        setTimeout(() => {
          this.isReformulating = false;
        }, 4000);
      },
      error: (error) => {
        console.error(error);
        setTimeout(() => {
          this.isReformulating = false;
        }, 5000);
      }
    });
  }
  getPlainText(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

  back() {
    this.HtmlContent = this.lastUserContent || this.backContent;
  }
  onUserChange() {
    if (!this.isReformulating) {
      this.lastUserContent = this.HtmlContent;
    }
  }




}
