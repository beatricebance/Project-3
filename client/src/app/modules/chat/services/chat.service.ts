import { Injectable } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { TextChannel } from '../models/text-channel.model';

@Injectable({
  providedIn: "root",
})

export class ChatService{

  constructor() {}

  toggleChatOverlay = new EventEmitter<TextChannel>();

  leaveRoomEventEmitter = new EventEmitter<TextChannel>();
}
