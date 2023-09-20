import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TeamClientService } from "src/app/modules/backend-communication/team-client/team-client.service";
import { Team } from "src/app/shared/models/team.model";

@Component({
  selector: "app-confirm-join-dialog",
  templateUrl: "./confirm-join-dialog.component.html",
  styleUrls: ["./confirm-join-dialog.component.scss"],
})
export class ConfirmJoinDialogComponent implements OnInit {
  teamPasswordForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { team: Team },
    private dialogRef: MatDialogRef<ConfirmJoinDialogComponent>,
    private teamClient: TeamClientService,
    private snackbar: MatSnackBar
  ) {
    this.teamPasswordForm = new FormGroup({
      teamPassword: new FormControl(""),
    });
  }

  ngOnInit(): void {}

  joinTeam(): void {
    // Is not private
    if (!this.data.team.isPrivate) {
      this.teamClient.joinTeam(this.data.team._id).subscribe((team) => {
        this.dialogRef.close(team);
        this.snackbar.open("Succesfully joined the team", "Close", {
          duration: 1000,
        });
      });
    }
    // Is private
    if (this.teamPasswordForm.value.teamPassword == this.data.team.password) {
      this.teamClient.joinTeam(this.data.team._id).subscribe((team) => {
        this.dialogRef.close(team);
        this.snackbar.open("Succesfully joined the team", "Close", {
          duration: 1000,
        });
      });
    } else {
      this.snackbar.open("Wrong password, try again!", "Close", {
        duration: 1000,
      });
      return;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
