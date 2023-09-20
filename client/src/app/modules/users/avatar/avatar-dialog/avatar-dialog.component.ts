import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Avatar } from "src/app/shared/models/avatar.model";

interface NgxAvatarInformation {
  sourceId: string;
  sourceType: string;
}

@Component({
  selector: "app-avatar-dialog",
  templateUrl: "./avatar-dialog.component.html",
  styleUrls: ["./avatar-dialog.component.scss"],
})
export class AvatarDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { avatars: Avatar[] },
    private dialogRef: MatDialogRef<AvatarDialogComponent>
  ) {}

  ngOnInit(): void {}

  onAvatarClicked(avatarInformation: NgxAvatarInformation) {
    // Event is the information about the avatar
    this.dialogRef.close(this.getCorrespondingAvatar(avatarInformation));
  }

  getCorrespondingAvatar(avatarInformation: NgxAvatarInformation) {
    for (let i = 0; i < this.data.avatars.length; ++i) {
      if (this.data.avatars[i].imageUrl === avatarInformation.sourceId) {
        return this.data.avatars[i];
      }
    }
    return this.data.avatars[0];
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
