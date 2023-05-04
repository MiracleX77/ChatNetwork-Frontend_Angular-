import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as SockJS from 'sockjs-client';
import { IChatMessage } from 'src/app/interfaces/i-chat-message';
import { IChatRoomResponse } from 'src/app/interfaces/i-chat-room-response';
import { ChatService } from 'src/app/services/chat.service';
import * as Stomp from 'stompjs'

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit{
  private stompClient: any;
  isConnected = false;
  nameUser:string = ""
  private ENDPOINT = "http://localhost:8080/socket"
  private CHANNEL_CHAT = "/topic/chat"



  messages: IChatMessage[] = [];

  receiver:string = "";

  chatFormGroup: FormGroup = new FormGroup({
    message: new FormControl('',Validators.required),
    sendTo: new FormControl('',Validators.required)
  });

  constructor(
    private chatService:ChatService,
    private route : ActivatedRoute,
    private router: Router

  ){
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      this.receiver = params['receiver'];
    })
      this.connectWebSocket();
      this.getNameOfUser();
      this.getMessageOfRoom()
  }

  private connectWebSocket(){
    let ws = new SockJS(this.ENDPOINT);
    this.stompClient = Stomp.over(ws)

    let that = this;
    this.stompClient.connect({},function(){
      that.isConnected = true;
      that.subscribeToGlobalChat();
    })
  }

  private subscribeToGlobalChat(){
    let that = this;
    this.stompClient.subscribe(this.CHANNEL_CHAT,(message:any) =>{
      let newMessage = JSON.parse(message.body) as IChatMessage
      console.log(newMessage)
      that.messages.push(newMessage)
    })
  }
  onSubmit(){
    let message = this.chatFormGroup.controls['message'].value;
    if(!this.isConnected){
      alert("Please connect WebSocket");
      return
    }
    this.chatService.postMessage(message,this.receiver).subscribe({
      next:(response) =>{
      },
      error:(error)=>{
      alert(error.error.error)
      }
    });
  }

  getNameOfUser(){
    this.chatService.getNameOfUser().subscribe({
      next:(response) =>{
        this.nameUser = response.name;
      },
      error:(error)=>{
        alert("ERR: Name Not found")
      }
    })
  }
  getMessageOfRoom(){
    this.chatService.getMessagesOfRoom(this.receiver).subscribe({
      next:(response) =>{
        this.messages = response.messages;
      },
      error:(error)=>{
        alert("ERR: Name Not found")
      }
    })
  }
  doBack(){
    this.router.navigate(['/chat'])
  }

}






