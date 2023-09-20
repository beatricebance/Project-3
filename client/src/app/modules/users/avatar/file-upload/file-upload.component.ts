import { Component, OnInit, Output } from "@angular/core";
import { Avatar } from "src/app/shared/models/avatar.model";
import { EventEmitter } from "@angular/core";
import { AvatarClientService } from "../../../backend-communication/avatar-client/avatar-client.service";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"],
})
export class FileUploadComponent implements OnInit {
  fileName = "";
  formData: FormData | null;

  @Output() uploadedAvatarEvent = new EventEmitter<Avatar>();

  constructor(private avatarClient: AvatarClientService) {}

  ngOnInit(): void {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      this.formData = new FormData();
      this.formData.append("avatar", file);

      this.avatarClient
        .uploadAvatar(this.formData)
        .subscribe((uploadedAvatar) => {
          this.uploadedAvatarEvent.emit(uploadedAvatar);
        });
    }
  }
}
