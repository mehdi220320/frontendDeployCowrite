import { Component } from '@angular/core';
import {DomSanitizer, SafeUrl ,SafeHtml  } from '@angular/platform-browser';
import {RoomsService} from '../../../services/rooms.service';
import {ActivatedRoute} from '@angular/router';
import {Room} from '../../../models/Room';
import {ChapterService} from '../../../services/chapter.service';
import {Chapter} from '../../../models/Chapter';
import {ChapterVersion} from '../../../models/ChapterVersion';

@Component({
  selector: 'app-chapter',
  standalone: false,
  templateUrl: './chapter.component.html',
  styleUrl: './chapter.component.css'
})
export class ChapterComponent {
  roomId="";
  userId:any="";
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
  chapterId="";
  versions:ChapterVersion[]=[];
  votes:any[]=[];

  constructor(private roomService:RoomsService,
              private sanitizer: DomSanitizer,
              private  route:ActivatedRoute,
              private chapterService:ChapterService) {}
  ngOnInit() {

    this.userId=localStorage.getItem('user_id');
    this.route.params.subscribe(params => {
      this.roomId = params['id'];
      this.chapterId=params['chapterId']
      console.log(this.roomId);
    });
    this.roomService.getRoomById(this.roomId).subscribe({next:(response)=>{
        this.room=response;
        console.log("hello room : ",this.room);
      },error:(err)=>{
        console.error(err);
      }
    });
    this.chapterService.getChapterById(this.chapterId).subscribe({
      next:(response)=>{
        this.chapter=response;
        console.log("chapters : "+response)
      },error:(err)=>{console.error(err)}
    })
    this.chapterService.getChapterVersions(this.chapterId).subscribe({
      next:(response)=>{
        this.versions=response;
        console.log("versions:"+this.versions)
      },error:(err)=>{console.error(err)}
    })
    this.chapterService.getVotesByUser(this.userId).subscribe({
      next:(response)=>{
        this.votes=response;
      },error:(err)=>{console.error(err)}
    })
    this.startCountdown();

  }
  sanitizeImageUrl(url: { path: string } | null): SafeUrl | string {
    return url ?
      this.sanitizer.bypassSecurityTrustResourceUrl(url.path) :
      "assets/img/img.png";
  }

  currentVersionIndex = 0;
  translateValue = 0;


  get currentVersion() {
    return this.currentVersionIndex + 1;
  }

  get totalVersions() {
    return this.versions.length;
  }

  get dots() {
    return Array(this.totalVersions).fill(0);
  }

  nextVersion() {
    if (this.currentVersionIndex < this.versions.length - 1) {
      this.currentVersionIndex++;
      this.translateValue = -100 * this.currentVersionIndex;
    }
  }

  prevVersion() {
    if (this.currentVersionIndex > 0) {
      this.currentVersionIndex--;
      this.translateValue = -100 * this.currentVersionIndex;
    }
  }

  goToVersion(index: number) {
    this.currentVersionIndex = index;
    this.translateValue = -100 * index;
  }

  voteVersion(versionId: any) {
    const versionIndex = this.versions.findIndex(v => v._id === versionId);

    if (versionIndex !== -1) {
      this.versions[versionIndex].votes = (this.versions[versionIndex].votes || 0) + 1;

      this.chapterService.voteVersion({versionId: versionId, userId: this.userId}).subscribe({
        next: (response) => {
          console.log("vote response: ", response.votes);
          this.votesReload()
        },
        error: (err) => {
          console.error(err);
          this.versions[versionIndex].votes = (this.versions[versionIndex].votes || 1) - 1;
        }
      });
    }
  }
  votesReload(){
    this.votes=[];
    this.chapterService.getVotesByUser(this.userId).subscribe({
      next:(response)=>{
        this.votes=response;
      },error:(err)=>{console.error(err)}
    })
  }
  isUserLike(versionId:any){
    const voteIndex = this.votes.findIndex(v => v.chapterVersion === versionId);
    if (voteIndex !== -1) return true;
    return false  ;
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  countdown = {
    days: 0,
    hours: 0,
    minutes: 0
  };
  isDeadlineClose = false;
  private countdownInterval: any;

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      const deadline = new Date(this.chapter.chapterDeadline).getTime();
      const now = new Date().getTime();
      const distance = deadline - now;

      if (distance < 0) {
        this.countdown = { days: 0, hours: 0, minutes: 0 };
        clearInterval(this.countdownInterval);
        return;
      }

      this.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      // Check if deadline is within 48 hours
      this.isDeadlineClose = distance < (48 * 60 * 60 * 1000);
    }, 1000);
  }

}
