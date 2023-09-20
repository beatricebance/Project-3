import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TeamClientService } from "src/app/modules/backend-communication/team-client/team-client.service";
import { ChatSocketService } from "src/app/modules/chat/services/chat-socket.service";
import { TextChannelService } from "src/app/modules/chat/services/text-channel.service";
import { Team } from "src/app/shared/models/team.model";
import { NewTeamComponent } from "../../new-team/new-team.component";

@Component({
  selector: "app-team-main-page",
  templateUrl: "./team-main-page.component.html",
  styleUrls: ["./team-main-page.component.scss"],
})
export class TeamMainPageComponent implements OnInit {
  gridColumns: number = 3;
  teams: Array<Team> = new Array();

  newTeamDialogRef: MatDialogRef<NewTeamComponent>;

  constructor(
    private teamClient: TeamClientService,
    private textChannelService: TextChannelService,
    private chatSocketService: ChatSocketService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.teamClient.getTeams().subscribe((response) => {
      response.forEach((team) => {
        this.teams.push(team);
      });
    });
  }

  ngAfterViewInit(): void {}

  goToTeam(teamId: string): void {
    this.router.navigate([`/teams/${teamId}`]);
  }

  openCreateTeamDialog(): void {
    this.newTeamDialogRef = this.dialog.open(NewTeamComponent, {
      width: "400px",
      height: "350px",
    });
    this.newTeamDialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.teams.push(result);
      this.textChannelService.createChannel(result.name, result.owner, result._id).subscribe((channel) => {
        console.log("created new channel : " + channel);
        this.textChannelService.emitNewChannel(channel);
        this.chatSocketService.joinRoom({userId: localStorage.getItem("userId")!, roomName: channel.name});
      });
    });
  }
}
