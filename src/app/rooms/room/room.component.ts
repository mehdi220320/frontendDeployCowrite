import {Component, OnInit} from '@angular/core';
import {RoomsService} from '../../services/rooms.service';
import {Room} from '../../models/Room';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {BooksService} from '../../services/books.service';
import {Book} from '../../models/Book';
import {ChapterService} from '../../services/chapter.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-room',
  standalone: false,
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent implements OnInit{
  bookSelected:Book | null=null;
  userid:any="";
  constructor(private roomService:RoomsService,
              private sanitizer: DomSanitizer,
              private  route:ActivatedRoute,
              private chapterService:ChapterService,
              private bookService:BooksService,
              private location: Location) {}
  reloadCurrentRoute() {
    const currentUrl = this.location.path();
    this.location.replaceState(currentUrl);
    window.location.reload();
  }
  roomId="";
  books:Book[]=[]
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
  ngOnInit() {
    if(localStorage.getItem('user_id')){this.userid=localStorage.getItem('user_id')}

    this.route.params.subscribe(params => {
      this.roomId = params['id'];
      console.log(this.roomId);
    });
    this.roomService.getRoomById(this.roomId).subscribe({next:(response)=>{
        this.room=response;
        console.log("hello room : ",this.room);
      },error:(err)=>{
        console.error(err);
        }
    });
    this.bookService.getBooksByroom(this.roomId).subscribe({next:(response)=>{
      this.books=response;
      console.log(this.books);
      },error:(err)=>{console.error(err)}}
    )
  }
  sanitizeImageUrl(url: { path: string } | null): SafeUrl | string {
    return url ?
      this.sanitizer.bypassSecurityTrustResourceUrl(url.path) :
      "assets/img/img.png";
  }
  isCopied = false;

  async copyInviteLink() {
    try {
      await navigator.clipboard.writeText(this.room.code);
      this.isCopied = true;
      setTimeout(() => this.isCopied = false, 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = this.room.code;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        this.isCopied = true;
        setTimeout(() => this.isCopied = false, 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  }
  getBook(bookId:any){
    this.bookSelected=null;
    this.bookService.getBookById(bookId).subscribe({
      next:(response)=>{
        this.bookSelected=response;
      },error:(err)=>{console.log(err)}
    })
  }
  async checklastChapter(chapterId: any): Promise<boolean> {
    try {
      const response = await this.chapterService.getChapterById(chapterId).toPromise();
      if (response?.confirmedVersion) {
        console.log("true true");
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  acceptInvitation(id: any) {
    this.roomService.acceptInvites({ roomCode: this.room.code, userId: id }).subscribe({
      next: (response) => {
        const userIndex = this.room.pendingMembers.findIndex(member => member._id === id);

        if (userIndex !== -1) {
          // Create new arrays instead of mutating existing ones
          this.room = {
            ...this.room,
            pendingMembers: this.room.pendingMembers.filter(member => member._id !== id),
            users: [...this.room.users, this.room.pendingMembers[userIndex]]
          };
        }
      },
      error: (err) => console.log(err)
    });
  }
  follow(){
    this.roomService.join({ code: this.room.code, userId: this.userid }).subscribe({
      next: (response) => {
        this.reloadCurrentRoute();
       console.log("did follow")
      },
      error: (err) => console.log(err)
    });

  }
  isUserInRoom(): boolean {
    return this.room.users.some(user => user._id === this.userid);
  }

  isUserPending(): boolean {
    return this.room.pendingMembers.some(member => member._id === this.userid);
  }
  sanitizeImageUrl2(url: { path: string } | null): SafeUrl | string {
    return url ?
      this.sanitizer.bypassSecurityTrustResourceUrl(url.path) :
      "assets/img/img.png";
  }
}
