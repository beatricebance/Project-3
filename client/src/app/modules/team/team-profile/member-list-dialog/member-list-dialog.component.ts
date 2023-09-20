import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { User } from "src/app/modules/users/models/user";
import { UsersService } from "src/app/modules/users/services/users.service";
import { STATUS } from "src/app/shared/models/status.model";

@Component({
  selector: "app-member-list-dialog",
  templateUrl: "./member-list-dialog.component.html",
  styleUrls: ["./member-list-dialog.component.scss"],
})
export class MemberListDialogComponent implements OnInit {
  userStatus: Map<string, STATUS>;
  statusLoaded: Promise<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { members: User[] },
    private dialogRef: MatDialogRef<MemberListDialogComponent>,
    private router: Router,
    private usersService: UsersService
  ) {
    this.usersService.getUserStatus().subscribe((statuses) => {
      this.userStatus = statuses;
      this.statusLoaded = Promise.resolve(true);
    });
  }

  ngOnInit(): void {}

  goToProfile(userId: string): void {
    this.dialogRef.close();
    this.router.navigate([`/users/${userId}`]);
  }
  onCancel(): void {
    this.dialogRef.close();
  }

  getOnlineStatus(userId: string) {
    return this.userStatus.get(userId);
  }

  getStatusColor(userId: string) {
    const status = this.getOnlineStatus(userId);
    switch (status) {
      case STATUS.Online:
        return "primary";
      case STATUS.Collaborating:
        return "basic";
      case STATUS.Offline:
        return "warn";
      default:
        return "primary";
    }
  }
}
