import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChatMessage } from '../interfaces/i-chat-message';
import { IChatResponse } from '../interfaces/i-chat-response';
import {  IChatRoomResponse } from '../interfaces/i-chat-room-response';
import { IChatRoomsResponse } from '../interfaces/i-chat-rooms-response';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http:HttpClient
  ) {}

  postMessage(message:string) : Observable<IChatResponse>{
    let url = "http://localhost:8080/chat/message";
    let body = {
      message: message
    }
    return this.http.post<IChatResponse>(url,body)
  }

  connectUser(sendTo:string) : Observable<IChatRoomResponse>{
    let url = "http://localhost:8080/chat/create-room";
    let body ={
      name:sendTo
    }
    return this.http.post<IChatRoomResponse>(url,body);
  }
  getData() : Observable<IChatRoomsResponse>{
    let url = "http://localhost:8080/chat/get-rooms";
    return this.http.get<IChatRoomsResponse>(url);
  }
}
