import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http:HttpClient) {
  }
  getAll():Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl+'/');
  }
}
