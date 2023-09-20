import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { UsersService } from "src/app/modules/users/services/users.service";
import { FormErrorStateMatcher } from "../error-state-matcher/ErrorStateMatcher";

@Component({
  selector: "app-change-password-dialog",
  templateUrl: "./change-password-dialog.component.html",
  styleUrls: ["./change-password-dialog.component.scss"],
})
export class ChangePasswordDialogComponent implements OnInit {
  changePasswordForm: FormGroup;
  matcher = new FormErrorStateMatcher();

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup(
      {
        currentPassword: new FormControl("", [Validators.required]),
        newPassword: new FormControl("", [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl(""),
      },
      { validators: this.checkPasswords }
    );
  }

  onAccept() {
    this.usersService
      .changePassword(
        localStorage.getItem("userId")!,
        this.changePasswordForm.value.currentPassword,
        this.changePasswordForm.value.newPassword
      )
      .subscribe((response) => {
        if (response.err) {
          this.changePasswordForm.controls["currentPassword"].setErrors({
            wrongPassword: true,
          });
          return;
        }
        this.dialogRef.close(true);
        this.changePasswordForm.reset();
      });
  }

  onCancel() {
    this.dialogRef.close();
  }

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let newPassword = group.get("newPassword")?.value;
    let confirmPassword = group.get("confirmPassword")?.value;
    return newPassword === confirmPassword ? null : { notSame: true };
  };
}
