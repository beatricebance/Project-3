import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Avatar } from "src/app/shared/models/avatar.model";
import { User } from "../../authentication/models/user";
import { AvatarClientService } from "../../backend-communication/avatar-client/avatar-client.service";
import { AvatarDialogComponent } from "./avatar-dialog/avatar-dialog.component";

@Component({
  selector: "app-avatar",
  templateUrl: "./avatar.component.html",
  styleUrls: ["./avatar.component.scss"],
})
export class AvatarComponent implements OnInit {
  @Input() currentUser: User;

  // TODO: remove default
  currentAvatar: Avatar = {
    imageUrl:
      "https://colorimage-111.s3.amazonaws.com/default/anime-aesthetic-pfp-boy-luxury-boy-aesthetic-profile-sad-anime-boy-pfp-for-boys-anime-of-anime-aesthetic-pfp-boy.jpeg",
    _id: "1",
  };

  @Output() currentAvatarChanged: EventEmitter<Avatar> =
    new EventEmitter<Avatar>();

  chooseAvatarDialogRef: MatDialogRef<AvatarDialogComponent>;
  constructor(
    private avatarClient: AvatarClientService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.currentUser) {
      this.currentAvatar = this.currentUser.avatar;
    }
  }

  openChooseAvatarDialog() {
    this.avatarClient.getDefaultAvatars().subscribe((response) => {
      this.chooseAvatarDialogRef = this.dialog.open(AvatarDialogComponent, {
        width: "500px",
        height: "700px",
        data: {
          avatars: response,
        },
      });
      this.chooseAvatarDialogRef.afterClosed().subscribe((chosenAvatar) => {
        if (!chosenAvatar) {
          return;
        }
        this.currentAvatar = chosenAvatar;
        this.currentAvatarChanged.emit(this.currentAvatar);
      });
    });
  }

  uploadedAvatar(uploadedAvatar: Avatar) {
    this.currentAvatar = uploadedAvatar;
    this.currentAvatarChanged.emit(uploadedAvatar);
  }
}
