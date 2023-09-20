import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ConfirmJoinDialogComponent } from "src/app/modules/team/team-profile/confirm-join-dialog/confirm-join-dialog.component";
import { Drawing } from "src/app/shared";

@Component({
  selector: "app-join-drawing-dialog",
  templateUrl: "./join-drawing-dialog.component.html",
  styleUrls: ["./join-drawing-dialog.component.scss"],
})
export class JoinDrawingDialogComponent implements OnInit {
  collaborativeSessionForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { drawing: Drawing },
    private dialogRef: MatDialogRef<ConfirmJoinDialogComponent>,
    private router: Router
  ) {
    this.collaborativeSessionForm = new FormGroup({
      drawingPassword: new FormControl(""),
    });
  }

  ngOnInit(): void {}

  joinSession() {
    // If wrong password
    if (
      this.collaborativeSessionForm.get("drawingPassword")?.value !=
      this.data.drawing.password
    ) {
      this.collaborativeSessionForm.controls["drawingPassword"].setErrors({
        wrongPassword: true,
      });
      return;
    }

    this.router.navigate([`/drawings/${this.data.drawing._id}`]);
    this.dialogRef.close();
    this.collaborativeSessionForm.reset();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
