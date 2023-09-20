import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EditableChannelParameters } from '../models/editable-channel-parameters';
import { Message } from '../models/message.model';
import { TextChannel } from '../models/text-channel.model';

@Injectable({
  providedIn: 'root'
})
export class TextChannelService {
  newChannel: Subject<TextChannel>;

  private endpointUrl: string = environment.serverURL + "/channels";
  private httpHeaders: HttpHeaders = new HttpHeaders().set(
    "ContentType",
    "application/x-www-form-urlencoded",
  );

  constructor(private httpClient: HttpClient) {
    this.newChannel = new Subject<TextChannel>();
   }

  getChannels(): Observable<TextChannel[]> {
    return this.httpClient
      .get<TextChannel[]>(this.endpointUrl)
      .pipe((response) => {
        return response;
      });
  }

  getChannel(channelId: string): Observable<TextChannel> {
    return this.httpClient
      .get<TextChannel>(`${this.endpointUrl}/${channelId}`)
      .pipe((response) => {
        return response;
      });
  }

  createChannel(newName: string, newOwner: string, teamId?: string, drawingId?: string): Observable<TextChannel> {
    return this.httpClient
      .post<TextChannel>(this.endpointUrl, {
        name: newName,
        ownerId: newOwner,
        team: teamId,
        drawing: drawingId,
      }, {
        headers: this.httpHeaders,
      })
      .pipe((response) => {
        return response;
      });
  }

  updateChannel(channelId: string, channel: EditableChannelParameters): Observable<TextChannel> {
    return this.httpClient
      .patch<TextChannel>(`${this.endpointUrl}/${channelId}`, channel, {
        headers: this.httpHeaders,
      })
      .pipe((response) => {
        return response;
      });
  }

  deleteChannel(channelId: string): Observable<TextChannel> {
    return this.httpClient
      .delete<TextChannel>(`${this.endpointUrl}/${channelId}`)
      .pipe((response) => {
        return response;
      });
  }

  deleteMessages(channelId: string): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.endpointUrl}/${channelId}/messages`)
      .pipe((response) => {
        return response;
      });
  }

  getMessages(channelId: string): Observable<Message[]> {
    return this.httpClient
      .get<Message[]>(`${this.endpointUrl}/${channelId}/messages`)
      .pipe((response) => {
        return response;
      });
  }

  searchChannels(query: string): Observable<TextChannel[]> {
    return this.httpClient.get<TextChannel[]>(`${this.endpointUrl}/all/search`, {
      params: new HttpParams().set("q", query),
    });
  }

  emitNewChannel(channel: TextChannel): void {
    this.newChannel.next(channel);
  }

}
