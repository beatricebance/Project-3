import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TeamClientService } from "src/app/modules/backend-communication/team-client/team-client.service";
import { Team } from "src/app/shared/models/team.model";

@Component({
  selector: "app-confirm-leave-dialog",
  templateUrl: "./confirm-leave-dialog.component.html",
  styleUrls: ["./confirm-leave-dialog.component.scss"],
})
export class ConfirmLeaveDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { team: Team },
    private dialogRef: MatDialogRef<ConfirmLeaveDialogComponent>,
    private teamsClient: TeamClientService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  leaveTeam(): void {
    this.teamsClient.leaveTeam(this.data.team._id).subscribe((team) => {
      if (!team) {
        return;
      }
      this.dialogRef.close(team);
      this.snackbar.open("Sucessfully left the team", "Close", {
        duration: 1000,
      });
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
