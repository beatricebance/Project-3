import { MatDialog } from "@angular/material/dialog";
import { NewDrawingComponent } from "../../new-drawing";
import { Component, AfterViewInit } from "@angular/core";
import { DrawingHttpClientService } from "../../backend-communication";
import { Drawing } from "src/app/shared";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Team } from "src/app/shared/models/team.model";
import { User } from "../../users/models/user";

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"],
})
export class GalleryComponent implements AfterViewInit {
  drawings: Array<Drawing> = [];
  userId: string;
  constructor(
    private dialog: MatDialog,
    private drawingHttpClient: DrawingHttpClientService,
    private sanitizer: DomSanitizer
  ) {
    this.userId = localStorage.getItem("userId")!;
  }

  ngAfterViewInit(): void {
    this.drawingHttpClient.getDrawings().subscribe((response) => {
      for (let drawing of response) {
        if (this.hasPermission(drawing)) {
          this.drawings.push(drawing);
        }
      }
    });
  }

  getSanitizedUrl(dataUri: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(dataUri);
  }

  createNewDrawing() {
    this.dialog.open(NewDrawingComponent, {});
  }

  hasPermission(drawing: Drawing): boolean {
    if (drawing.privacyLevel != "private") return true;

    if (
      drawing.ownerModel == "User" &&
      (drawing.owner as User)._id == this.userId
    ) {
      return true;
    }

    if (drawing.ownerModel == "Team") {
      if (((drawing.owner as Team).members as string[]).includes(this.userId)) {
        return true;
      }
    }

    return false;
  }
}
