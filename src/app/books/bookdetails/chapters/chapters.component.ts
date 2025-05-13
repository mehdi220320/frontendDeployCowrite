import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Chapter} from '../../../models/Chapter';
import {ChapterService} from '../../../services/chapter.service';

@Component({
  selector: 'app-chapters',
  standalone: false,
  templateUrl: './chapters.component.html',
  styleUrl: './chapters.component.css'
})
export class ChaptersComponent {
  bookId:any;
  chapters:Chapter[]=[]
  constructor(private route:ActivatedRoute,private chapterService:ChapterService) {
  }

  ngOnInit(){
    this.bookId=this.route.parent?.snapshot.paramMap.get('id');
    this.chapterService.getChaptersByBook(this.bookId).subscribe({
      next:(response)=>{
        this.chapters=response
        console.log(response)
      },error:(err)=>{console.error(err)}
    })
  }
}
