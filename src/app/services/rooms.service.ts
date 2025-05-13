import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Room} from '../models/Room';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private apiUrl = 'http://localhost:3000/rooms';

  constructor(private http:HttpClient) {
  }
  createRoom(data:FormData):Observable<Room>{
    return this.http.post<Room>(this.apiUrl+"/create",data);
  }
  getAllRooms():Observable<Room[]>{
    return this.http.get<Room[]>(this.apiUrl+"/all")
  }
  getMyRooms(id:string):Observable<Room[]>{
    return this.http.get<Room[]>(this.apiUrl+"/myrooms/"+id)
  }
  getRoomById(id:string):Observable<any>{
    return this.http.get<Room[]>(this.apiUrl+"/"+id)
  }
  acceptInvites(data:any):Observable<any>{
    return this.http.post<any>(this.apiUrl+"/accept-join-request",data)
  }
  join(data:any):Observable<any>{
    return this.http.post<any>(this.apiUrl+"/join",data)
  }

}
