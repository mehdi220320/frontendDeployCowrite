import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextService {
  private apiUrl = 'https://backenddeploycowriter.onrender.com/api';

  constructor(private http:HttpClient) {
  }
  ref(data:any):Observable<{ result: string }>{
    return  this.http.post<{ result: string }>(this.apiUrl+"/reformulate",data)
  }
}
