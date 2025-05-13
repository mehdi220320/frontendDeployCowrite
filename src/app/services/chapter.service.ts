import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chapter} from '../models/Chapter';
import {Observable} from 'rxjs';
import {ChapterVersion} from '../models/ChapterVersion';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  private apiUrl = 'http://localhost:3000/chapters';

  constructor(private http:HttpClient) {}
  getChapterById(id:any):Observable<Chapter>{
    return this.http.get<Chapter>(this.apiUrl+"/"+id);
  }
  getChaptersByBook(id:any):Observable<Chapter[]>{
    return this.http.get<Chapter[]>(this.apiUrl+"/book/"+id);
  }
  getChapterVersions(id:any):Observable<ChapterVersion[]>{
    return this.http.get<ChapterVersion[]>(this.apiUrl+"/"+id+"/versions");
  }
  AddChapterVersion(formData:any):Observable<any>{
    return this.http.post<any>(this.apiUrl+"/submit-version",formData)
  }
  addChapter(formData:any):Observable<Chapter>{
    return this.http.post<any>(this.apiUrl+"/addChapter",formData)
  }
  voteVersion(form:any):Observable<any>{
    return this.http.post<any>(this.apiUrl+"/vote",form)
  }
  getVotesByUser(userId:any):Observable<any>{
    return this.http.get<any>(this.apiUrl+"/voteByUser/"+userId);
  }
}
