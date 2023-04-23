import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChatMessage } from '../interfaces/i-chat-message';
import { IChatResponse } from '../interfaces/i-chat-response';
import { IChatNameResponse } from '../interfaces/i-chat-name-response';

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

  connectUser(sendTo:string) : Observable<IChatNameResponse>{
    let url = "http://localhost:8080/chat/name";
    return this.http.get<IChatNameResponse>(url);
  }
}
