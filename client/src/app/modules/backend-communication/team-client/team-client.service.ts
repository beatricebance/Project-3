import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Drawing } from "src/app/shared";
import { Team } from "src/app/shared/models/team.model";
import { environment } from "src/environments/environment";
import { EditableTeamParameters } from "../../team/EditableTeam";

@Injectable({
  providedIn: "root",
})
export class TeamClientService {
  private TEAM_ENDPOINT: string = environment.serverURL + "/teams/";

  constructor(private httpClient: HttpClient) {}

  getTeams(): Observable<Team[]> {
    return this.httpClient.get<Team[]>(this.TEAM_ENDPOINT);
  }

  getTeam(teamId: string): Observable<Team> {
    return this.httpClient.get<Team>(`${this.TEAM_ENDPOINT}${teamId}`);
  }

  createTeam(team: EditableTeamParameters): Observable<Team> {
    return this.httpClient.post<Team>(`${this.TEAM_ENDPOINT}`, team).pipe(
      map((team) => {
        return team;
      })
    );
  }

  deleteTeam(teamId: string): Observable<Team> {
    return this.httpClient
      .delete<Team>(`${this.TEAM_ENDPOINT}${teamId}`, {})
      .pipe(
        map((team) => {
          return team;
        })
      );
  }

  joinTeam(teamId: string): Observable<Team> {
    return this.httpClient
      .post<Team>(`${this.TEAM_ENDPOINT}${teamId}/join`, {})
      .pipe(
        map((team) => {
          return team;
        })
      );
  }

  leaveTeam(teamId: string): Observable<Team> {
    return this.httpClient
      .post<Team>(`${this.TEAM_ENDPOINT}${teamId}/leave`, {})
      .pipe(
        map((team) => {
          return team;
        })
      );
  }

  getTeamDrawings(teamId: string): Observable<Drawing[]> {
    return this.httpClient
      .get<Drawing[]>(`${this.TEAM_ENDPOINT}${teamId}/drawings`)
      .pipe((drawings) => {
        return drawings;
      });
  }
}
