import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as SockJS from 'sockjs-client';
import { IChatMessage } from 'src/app/interfaces/i-chat-message';
import { IChatRoomResponse } from 'src/app/interfaces/i-chat-room-response';
import { ChatService } from 'src/app/services/chat.service';
import * as Stomp from 'stompjs'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit{
  private stompClient: any;
  isConnected = false;
  nameConnected = ""
  private ENDPOINT = "http://localhost:8080/socket"
  private CHANNEL_CHAT = "/topic/chat"
  private CHANNEL_ROOM = "/topic/room"



  messages: IChatMessage[] = [];

  users: IChatRoomResponse[] = [];

  chatFormGroup: FormGroup = new FormGroup({
    message: new FormControl('',Validators.required),
    sendTo: new FormControl('',Validators.required)
  });

  constructor(
    private chatService:ChatService
  ){}

  ngOnInit(): void {
      this.connectWebSocket();
      this.getDataOfUser()

  }
  private connectWebSocket(){
    let ws = new SockJS(this.ENDPOINT);
    this.stompClient = Stomp.over(ws)

    let that = this;
    this.stompClient.connect({},function(){
      that.isConnected = true;
      that.subscribeToGlobalChat();
      that.subscribeToGlobalRoom();
    })
  }
  private subscribeToGlobalRoom(){
    let that = this;
    this.stompClient.subscribe(this.CHANNEL_ROOM,(message:any) =>{
      let newuser = JSON.parse(message.body) as IChatRoomResponse
      that.users.push(newuser)
    })
  }

  private subscribeToGlobalChat(){
    let that = this;
    this.stompClient.subscribe(this.CHANNEL_CHAT,(message:any) =>{
      let newMessage = JSON.parse(message.body) as IChatMessage
      that.messages.push(newMessage)
    })
  }
  onSubmit(){
    let message = this.chatFormGroup.controls['message'].value;
    if(!this.isConnected){
      alert("Please connect WebSocket");
      return
    }
    alert(message)
    this.chatService.postMessage(message).subscribe({
      next:(response) =>{
      },
      error:(error)=>{
      alert(error.error.error)
      }
    });
    
  }
  onSubmitToConnect(){
    let sendTo = this.chatFormGroup.controls['sendTo'].value;
    if(!this.isConnected){
      alert("Please connect WebSocket");
      return
    }
    this.chatService.connectUser(sendTo).subscribe({
      next:(response) =>{
      },
      error:(error)=>{
      alert("Not found name")
      }
    });



  }
  getDataOfUser(){
    this.chatService.getData().subscribe({
      next:(response) =>{
        this.users = response.rooms;
      },
      error:(error)=>{
      alert("Not found name")
      }
    });
  }

}
