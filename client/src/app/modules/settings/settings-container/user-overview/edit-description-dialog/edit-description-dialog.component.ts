import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UsersService } from "src/app/modules/users/services/users.service";

@Component({
  selector: "app-edit-description-dialog",
  templateUrl: "./edit-description-dialog.component.html",
  styleUrls: ["./edit-description-dialog.component.scss"],
})
export class EditDescriptionDialogComponent implements OnInit {
  descriptionForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { description: string },
    private dialogRef: MatDialogRef<EditDescriptionDialogComponent>,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.descriptionForm = new FormGroup({
      description: new FormControl(this.data.description, [
        Validators.required,
      ]),
    });
  }

  onAccept(): void {
    this.usersService
      .updateUser(localStorage.getItem("userId")!, {
        description: this.descriptionForm.value.description,
      })
      .subscribe((updatedUser) => {
        this.dialogRef.close(updatedUser);
        this.descriptionForm.reset();
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
