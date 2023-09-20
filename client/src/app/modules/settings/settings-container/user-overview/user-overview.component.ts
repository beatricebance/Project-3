import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EditableUserParameters } from "src/app/modules/users/models/editable-user-parameters";
import { UsersService } from "src/app/modules/users/services/users.service";
import { Avatar } from "src/app/shared/models/avatar.model";
import { ChangePasswordDialogComponent } from "./change-password-dialog/change-password-dialog.component";
import { EditDescriptionDialogComponent } from "./edit-description-dialog/edit-description-dialog.component";
import { EditParameterDialogComponent } from "./edit-parameter-dialog/edit-parameter-dialog.component";

@Component({
  selector: "app-user-overview",
  templateUrl: "./user-overview.component.html",
  styleUrls: ["./user-overview.component.scss"],
})
export class UserOverviewComponent implements OnInit {
  userLoaded: Promise<boolean>;
  currentUser: any;

  editParameterDialogRef: MatDialogRef<EditParameterDialogComponent>;
  changePasswordDialogRef: MatDialogRef<ChangePasswordDialogComponent>;
  editDescriptionDialogRef: MatDialogRef<EditDescriptionDialogComponent>;

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.usersService
      .getUser(localStorage.getItem("userId")!)
      .subscribe((user) => {
        this.currentUser = user;
        this.userLoaded = Promise.resolve(true);
      });
  }

  ngOnInit(): void {}

  openEditUsernameDialog() {
    this.editParameterDialogRef = this.dialog.open(
      EditParameterDialogComponent,
      {
        width: "500px",
        height: "400px",
        data: {
          username: this.currentUser.username,
        },
      }
    );
    this.editParameterDialogRef.afterClosed().subscribe((currentUser) => {
      if (!currentUser) return;
      this.currentUser = currentUser;
    });
    this.changeDetectorRef.detectChanges();
  }

  openEditDescriptionDialog() {
    this.editDescriptionDialogRef = this.dialog.open(
      EditDescriptionDialogComponent,
      {
        width: "500px",
        height: "400px",
        data: {
          description: this.currentUser.description,
        },
      }
    );

    this.editDescriptionDialogRef.afterClosed().subscribe((currentUser) => {
      if (!currentUser) return;
      this.currentUser = currentUser;
    });
    this.changeDetectorRef.detectChanges();
  }

  openChangePasswordDialog() {
    this.changePasswordDialogRef = this.dialog.open(
      ChangePasswordDialogComponent,
      {}
    );
    this.changePasswordDialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.snackBar.open("Succesfully updated password!", "Close", {
          duration: 3000,
        });
      }
    });
  }

  openSnackBar(avatar: Avatar) {
    let snackBarRef = this.snackBar.open(
      "Careful -- you have unsaved changes!",
      "Confirm"
    );
    snackBarRef.onAction().subscribe(() => {
      this.updateUserAvatar(avatar);
    });
  }

  updateUserAvatar(avatar: Avatar) {
    this.usersService
      .updateUser(
        localStorage.getItem("userId")!,
        new EditableUserParameters({ avatar: avatar })
      )
      .subscribe((currentUser) => {
        this.currentUser = currentUser;
      });
  }
}
