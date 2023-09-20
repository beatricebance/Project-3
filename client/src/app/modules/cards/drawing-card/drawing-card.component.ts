import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Drawing } from "src/app/shared";
import { Team } from "src/app/shared/models/team.model";
import { User } from "../../users/models/user";
import { EditDrawingParametersDialogComponent } from "./edit-drawing-parameters-dialog/edit-drawing-parameters-dialog.component";
import { JoinDrawingDialogComponent } from "./join-drawing-dialog/join-drawing-dialog.component";

@Component({
  selector: "app-drawing-card",
  templateUrl: "./drawing-card.component.html",
  styleUrls: ["./drawing-card.component.scss"],
})
export class DrawingCardComponent implements OnInit {
  @Input() drawing: Drawing;
  userId: string;

  joinDrawingDialogRef: MatDialogRef<JoinDrawingDialogComponent>;
  editDrawingParametersDialogRef: MatDialogRef<EditDrawingParametersDialogComponent>;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef
  ) {
    this.userId = localStorage.getItem("userId")!;
  }

  ngOnInit(): void {}

  getSanitizedUrl(dataUri: string) {
    return this.sanitizer.bypassSecurityTrustUrl(dataUri);
  }

  goToDrawing() {
    if (this.drawing.privacyLevel == "protected") {
      this.joinDrawingDialogRef = this.dialog.open(JoinDrawingDialogComponent, {
        data: { drawing: this.drawing },
      });
    } else {
      this.router.navigate([`/drawings/${this.drawing._id}`]);
    }
  }

  goToUserProfile() {
    this.router.navigate([`/users/${(this.drawing.owner as User)._id}`]);
  }

  goToTeamProfile() {
    this.router.navigate([`/teams/${(this.drawing.owner as Team)._id}`]);
  }

  isUser(owner: any): owner is User {
    return "username" in owner;
  }

  isTeam(owner: any): owner is Team {
    return "name" in owner;
  }

  isProtected(): boolean {
    if (this.drawing.privacyLevel == "protected") return true;
    return false;
  }

  isOwner(): boolean {
    if (this.drawing.ownerModel == "User") {
      return (this.drawing.owner as User)._id == this.userId;
    } else if (this.drawing.ownerModel == "Team") {
      return ((this.drawing.owner as Team).members as string[]).includes(
        this.userId
      );
    }
    return false;
  }

  openEditDrawingParametersDialog() {
    this.editDrawingParametersDialogRef = this.dialog.open(
      EditDrawingParametersDialogComponent,
      { data: { drawing: this.drawing } }
    );
    this.editDrawingParametersDialogRef.afterClosed().subscribe((drawing) => {
      if (drawing != undefined) {
        this.drawing.name = drawing.name;
        this.drawing.privacyLevel = drawing.privacyLevel;
        this.drawing.password = drawing.password;
        this.changeDetector.detectChanges();
      }
    });
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
