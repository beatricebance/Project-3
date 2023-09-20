import { injectable } from 'inversify';
import { Namespace, Server, Socket } from 'socket.io';
import {
  ROOM_EVENT_NAME,
  CONNECTION_EVENT_NAME,
  DISCONNECTION_EVENT_NAME,
  LEAVE_ROOM_EVENT_NAME,
} from '../constants/socket-constants';
import 'reflect-metadata';
import { SocketRoomInformation } from './socket-information';

// TODO: Refactor towards service directory and change comments to english.
@injectable()
export abstract class SocketServiceInterface {
  protected namespace: Namespace;

  // Initialisation du socket namespace ainsi que toutes les
  // réponses socket.
  init(io: Server, namespaceName: string) {
    this.namespace = io.of(namespaceName);
    this.namespace.on(CONNECTION_EVENT_NAME, (socket: Socket) => {
      console.log(`${namespaceName} socket user has connected.`);
      this.listenRoom(socket);
      this.listenLeaveRoom(socket);
      this.setSocketListens(socket);
      this.listenDisconnect(socket);
    });
  }

  // Défini tous les socket.on du socket en question.
  protected abstract setSocketListens(socket: Socket): void;

  // Configuration du room en fonction du nom du room envoyé par le client
  protected listenLeaveRoom(socket: Socket) {
    socket.on(
      LEAVE_ROOM_EVENT_NAME,
      (socketInformation: SocketRoomInformation) => {
        console.log(
          `${socketInformation.userId} has left room ${socketInformation.roomName}`,
        );
        socket.leave(socketInformation.roomName);
      },
    );
  }

  protected listenRoom(socket: Socket): void {
    socket.on(ROOM_EVENT_NAME, (socketInformation: SocketRoomInformation) => {
      console.log(
        `${socketInformation.userId} has joined room ${socketInformation.roomName}`,
      );
      socket.join(socketInformation.roomName);
    });
  }

  // Méthode par défaut sur déconnexion d'un utilisateur sur le namespace.
  protected listenDisconnect(socket: Socket) {
    socket.on(DISCONNECTION_EVENT_NAME, () => {
      socket.disconnect();
      console.log(`User from namespace ${this.namespace} disconnected`);
    });
  }
}
