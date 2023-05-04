import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChatMessage } from '../interfaces/i-chat-message';
import { IChatResponse } from '../interfaces/i-chat-response';
import {  IChatRoomResponse } from '../interfaces/i-chat-room-response';
import { IChatRoomsResponse } from '../interfaces/i-chat-rooms-response';
import { IChatName } from '../interfaces/i-chat-name';
import { IChatMessages } from '../interfaces/i-chat-messages';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http:HttpClient
  ) {}

  postMessage(message:string,receiver:string) : Observable<IChatMessage>{
    let url = "http://localhost:8080/chat/message";
    let body = {
      message: message,
      receiver: receiver
    }
    return this.http.post<IChatMessage>(url,body)
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
  getNameOfUser():Observable<IChatName>{
    let url = "http://localhost:8080/chat/get-name";
    return this.http.get<IChatName>(url);
  }
  getMessagesOfRoom(receiver:string):Observable<IChatMessages>{
    let url = `http://localhost:8080/chat/get-messages-${receiver}`;
    return this.http.get<IChatMessages>(url);
  }
}
