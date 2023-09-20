import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UsersService } from "src/app/modules/users/services/users.service";

@Component({
  selector: "app-edit-parameter-dialog",
  templateUrl: "./edit-parameter-dialog.component.html",
  styleUrls: ["./edit-parameter-dialog.component.scss"],
})
export class EditParameterDialogComponent implements OnInit {
  usernameForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { username?: string; description?: string },
    private dialogRef: MatDialogRef<EditParameterDialogComponent>,
    private usersService: UsersService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.usernameForm = new FormGroup({
      username: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  onAccept(): void {
    this.usersService
      .updateUser(localStorage.getItem("userId")!, {
        username: this.usernameForm.value.username,
      })
      .subscribe(
        (updatedUser) => {
          this.dialogRef.close(updatedUser);
          this.usernameForm.reset();
        },
        (err) => {
          this.snackbar.open(
            "Username already taken, choose another one!",
            "Close",
            {
              duration: 3000,
            }
          );
        }
      );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
