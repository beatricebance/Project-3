import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TeamClientService } from "src/app/modules/backend-communication/team-client/team-client.service";
import { Team } from "src/app/shared/models/team.model";

@Component({
  selector: "app-confirm-delete-dialog",
  templateUrl: "./confirm-delete-dialog.component.html",
  styleUrls: ["./confirm-delete-dialog.component.scss"],
})
export class ConfirmDeleteDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { team: Team },
    private dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    private teamClient: TeamClientService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  deleteTeam(): void {
    this.teamClient.deleteTeam(this.data.team._id).subscribe((response) => {
      this.dialogRef.close();
      this.snackbar.open("Succesfully deleted team", "Close", {
        duration: 1000,
      });
      this.router.navigate(["/teams"]);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
