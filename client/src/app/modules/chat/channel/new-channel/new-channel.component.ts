import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TextChannel } from "../../models/text-channel.model";
import { TextChannelService } from "../../services/text-channel.service";

@Component({
  selector: "app-new-channel",
  templateUrl: "./new-channel.component.html",
  styleUrls: ["./new-channel.component.scss"],
})
export class NewChannelComponent implements OnInit {
  newDrawingForm: FormGroup;
  existingChannels: TextChannel[];

  constructor(
    private textChannelService: TextChannelService,
    private dialogRef: MatDialogRef<NewChannelComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.newDrawingForm = new FormGroup({
      name: new FormControl(""),
    });
    this.textChannelService
      .getChannels()
      .subscribe((channels) => (this.existingChannels = channels));
  }

  onAccept(): void {
    const isWhitespace =
      (this.newDrawingForm.value.name || "").trim().length === 0;
    if (isWhitespace) {
      this.snackBar.open("The name cannot be empty", "Close", {
        duration: 3000,
      });
      return;
    } else if (
      this.existingChannels.find(
        (channel) => channel.name === this.newDrawingForm.value.name
      )
    ) {
      this.snackBar.open("This channel already exists", "Close", {
        duration: 3000,
      });
      return;
    }

    this.textChannelService
      .createChannel(
        this.newDrawingForm.value.name,
        localStorage.getItem("userId")!
      )
      .subscribe((response) => {
        this.dialogRef.close(response);
        this.newDrawingForm.reset();
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
