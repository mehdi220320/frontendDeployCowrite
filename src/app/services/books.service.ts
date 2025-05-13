import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Book} from '../models/Book';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private apiUrl = 'http://localhost:3000/books';

  constructor(private http:HttpClient) {
  }
  getBooksByroom(id:any):Observable<Book[]>{
    return this.http.get<Book[]>(this.apiUrl+"/room/"+id)
  }
  createBook(formData: FormData) {
    return this.http.post(`${this.apiUrl}/create`, formData);
  }
  getBookById(id:any):Observable<Book>{
    return this.http.get<Book>(this.apiUrl+"/"+id)
  }
  getAllBook():Observable<Book[]>{
    return this.http.get<Book[]>(this.apiUrl+"/all")
  }
}
