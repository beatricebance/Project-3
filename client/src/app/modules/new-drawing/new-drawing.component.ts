import { Component, HostListener, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ColorPickerService } from "src/app/modules/color-picker";
import { DrawingService } from "src/app/modules/workspace";
import { DEFAULT_ALPHA, DEFAULT_RGB_COLOR } from "src/app/shared";
import { DrawingHttpClientService } from "../backend-communication";
import { NewDrawingService } from "./new-drawing.service";
import { UsersService } from "../users/services/users.service";
import { Team } from "src/app/shared/models/team.model";
import { OptionalDrawingParameters } from "./optional-drawing-parameters";

const ONE_SECOND = 1000;
const DEFAULT_DRAWING_WIDTH = 1440;
const DEFAULT_DRAWING_HEIGHT = 900;
@Component({
  selector: "app-new-drawing",
  templateUrl: "./new-drawing.component.html",
  styleUrls: ["./new-drawing.component.scss"],
})
export class NewDrawingComponent implements OnInit {
  form: FormGroup;
  teams: Team[] = [];

  ownerModel: string = "User";
  privacyLevel = "public";

  constructor(
    public dialogRef: MatDialogRef<NewDrawingComponent>,
    private snackBar: MatSnackBar,
    private newDrawingService: NewDrawingService,
    private drawingService: DrawingService,
    private colorPickerService: ColorPickerService,
    private drawingHttpClient: DrawingHttpClientService,
    private usersService: UsersService,
    private router: Router
  ) {}

  /// Créer un nouveau form avec les dimensions et la couleur
  ngOnInit(): void {
    this.form = new FormGroup(
      {
        name: new FormControl("", Validators.required),
        ownerModel: new FormControl(""),
        owner: new FormControl({ value: "", disabled: true }, [
          this.NonEmptyTeam,
        ]),
        privacyLevel: new FormControl("public"),
        password: new FormControl({ value: "", disabled: true }),
        color: this.colorPickerService.colorForm,
      },
      { validators: [this.NonEmptyPassword, this.NonEmptyTeam] }
    );
    this.dialogRef.afterOpened().subscribe(() => this.onResize());
    this.colorPickerService.setFormColor(DEFAULT_RGB_COLOR, DEFAULT_ALPHA);
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    this.usersService.getUserTeams(userId).subscribe((teams) => {
      this.teams = teams;
    });
  }

  /// Ouvre le dialog pour l'alerte lorsque le service est creer
  onAccept(): void {
    this.drawingService.isCreated = true;
    let drawingDataUri = this.drawingService.newDrawing(
      DEFAULT_DRAWING_WIDTH,
      DEFAULT_DRAWING_HEIGHT,
      {
        rgb: this.colorPickerService.rgb.value,
        a: this.colorPickerService.a.value,
      }
    );

    this.form.value.ownerModel = this.ownerModel;

    this.form.value.dataUri = drawingDataUri;

    const drawingParameters = new OptionalDrawingParameters(this.form.value);

    if (drawingParameters.ownerModel == "User") {
      drawingParameters.owner = localStorage.getItem("userId")!;
    }

    if (drawingParameters.privacyLevel != "protected") {
      drawingParameters.password = "";
    }

    this.drawingHttpClient
      .createNewDrawing(drawingParameters)
      .subscribe((response) => {
        if (response._id) {
          this.router.navigate([`/drawings/${response._id}`]);
          this.snackBar.open("Nouveau dessin créé", "", {
            duration: ONE_SECOND,
          });
        }
      });
    this.newDrawingService.form.reset();
    this.dialogRef.close();
  }

  toggleOwnerModel(): void {
    this.ownerModel = this.ownerModel == "User" ? "Team" : "User";
    if (this.ownerModel == "User") {
      this.form.get("owner")?.disable();
    } else {
      this.form.get("owner")?.enable();
    }
  }

  changePrivacyLevel() {
    if (this.privacyLevel == "protected") {
      this.form.get("password")?.enable();
    } else {
      this.form.get("password")?.disable();
    }
  }

  /// Ferme le dialogue
  onCancel(): void {
    this.dialogRef.close();
  }

  /// Ecoute pour un changement de la grandeur du window
  @HostListener("window:resize", ["$event"])
  onResize() {
    this.newDrawingService.onResize();
  }

  NonEmptyTeam: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let ownerModel = this.ownerModel;
    let ownerId = group.get("ownerId")?.value;
    if (ownerModel == "Team" && ownerId == "") {
      return { emptyTeam: true };
    } else {
      return null;
    }
  };

  NonEmptyPassword: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const privacyLevel = group.get("privacyLevel")?.value;
    const password = group.get("password")?.value;
    if (privacyLevel == "protected" && password == "") {
      return { required: true };
    }
    return null;
  };
}
