import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Drawing } from "src/app/shared";
import { STATUS } from "src/app/shared/models/status.model";
import { Team } from "src/app/shared/models/team.model";
import { UserStatistics } from "src/app/shared/models/user-statistics.model";
import { environment } from "src/environments/environment";
import { EditableUserParameters } from "../models/editable-user-parameters";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private endpointUrl: string = environment.serverURL + "/users";
  private httpHeaders: HttpHeaders = new HttpHeaders().set(
    "ContentType",
    "application/x-www-form-urlencoded"
  );

  constructor(private httpClient: HttpClient) {}

  getUser(userId: string): Observable<User> {
    return this.httpClient
      .get<User>(`${this.endpointUrl}/${userId}`)
      .pipe((response) => {
        return response;
      });
  }

  getUserStatistics(userId: string): Observable<UserStatistics> {
    return this.httpClient
      .get<UserStatistics>(`${this.endpointUrl}/${userId}/statistics`)
      .pipe((response) => {
        return response;
      });
  }

  updateUser(userId: string, user: EditableUserParameters): Observable<User> {
    return this.httpClient
      .patch<User>(`${this.endpointUrl}/${userId}`, user, {
        headers: this.httpHeaders,
      })
      .pipe((response) => {
        return response;
      });
  }

  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    return this.httpClient
      .patch(`${this.endpointUrl}/${userId}/changePassword`, {
        currentPassword: currentPassword,
        newPassword: newPassword,
      })
      .pipe((response) => {
        return response;
      });
  }

  getUserTeams(userId: string): Observable<Team[]> {
    return this.httpClient
      .get<Team[]>(`${this.endpointUrl}/${userId}/teams`)
      .pipe((response) => {
        return response;
      });
  }

  getUserDrawings(userId: string): Observable<Drawing[]> {
    return this.httpClient
      .get<Drawing[]>(`${this.endpointUrl}/${userId}/drawings`)
      .pipe((response) => {
        return response;
      });
  }

  getUserStatus(): Observable<Map<string, STATUS>> {
    return this.httpClient.get<{}>(`${this.endpointUrl}/status`).pipe(
      map((response) => {
        return new Map(Object.entries(response));
      })
    );
  }
}
