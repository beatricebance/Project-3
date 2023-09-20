import { io } from "socket.io-client";
import { ROOM_EVENT_NAME, LEAVE_ROOM_EVENT_NAME } from "src/app/shared";
import { environment } from "src/environments/environment";
import { SocketRoomInformation } from "./socket-room-information";

export abstract class AbstractSocketService {
  readonly SERVER_URL: string = environment.serverRawURL;
  protected namespaceSocket: any;
  protected isConnected: boolean;

  // Initialisation du socket namespace ainsi que toutes les
  // réponses socket.
  protected init(namespaceName: string) {
    this.namespaceSocket = io(`${this.SERVER_URL}/${namespaceName}`);
    this.disconnect();
    this.isConnected = false;
    this.setSocketListens();
  }

  // Défini tous les socket.on du socket en question.
  protected abstract setSocketListens(): void;

  // Configuration du room en fonction du nom du room envoyé par le client
  joinRoom(roomName: SocketRoomInformation) {
    this.emit(ROOM_EVENT_NAME, roomName);
  }

  leaveRoom(roomName: SocketRoomInformation): void {
    this.emit(LEAVE_ROOM_EVENT_NAME, roomName);
  }

  connect(): void {
    this.namespaceSocket.connect();
  }

  disconnect(): void {
    this.namespaceSocket.disconnect();
  }

  protected emit(event: string, data: any): void {
    this.namespaceSocket.emit(event, data);
  }

  protected emitWithCallback(
    event: string,
    data: any,
    callback: (response: any) => any
  ): void {
    this.namespaceSocket.emit(event, data, callback);
  }
}
