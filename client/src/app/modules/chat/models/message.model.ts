export interface Message {
  _id?: string;
  message: string;
  timestamp: Date;
  author: string;
  roomId: string;
  roomName: string;
}
