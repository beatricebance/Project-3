import { Component } from "@angular/core";
import { BACKGROUND_SIZE } from "../tools-color.constant";
import { DrawingService } from "src/app/modules/workspace";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { ToolsColorPickerComponent } from "../tools-color-picker/tools-color-picker.component";
import {
  TOOLS_COLOR_PICKER_LEFT,
  TOOLS_COLOR_PICKER_TOP,
  TOOLS_COLOR_PICKER_WIDTH,
} from "../tools-color-picker/tools-color-picker.constant";
import { RGB, RGBA } from "src/app/shared";

@Component({
  selector: "app-background-color-picker",
  templateUrl: "./background-color-picker.component.html",
  styleUrls: ["./background-color-picker.component.scss"],
})
export class BackgroundColorPickerComponent {
  dialogSub: Subscription;
  dialogRef: MatDialogRef<ToolsColorPickerComponent>;

  readonly backgroundSize: {
    x: number;
    y: number;
    width: number;
    height: number;
  } = BACKGROUND_SIZE;

  constructor(
    private drawingService: DrawingService,
    public dialog: MatDialog
  ) {}

  get backgroundAlpha(): number {
    return this.drawingService.alpha;
  }

  get backgroundColor(): string {
    return this.drawingService.rgbColorString;
  }

  /// click de souris ouvre le dialog pour la couleur de l'arriere plan
  clickBackground(event: MouseEvent): void {
    this.dialogRef = this.colorPickerOpen(
      this.drawingService.color,
      this.drawingService.alpha
    );
    this.dialogSub = this.dialogRef.afterClosed().subscribe((result: RGBA) => {
      if (result) {
        this.drawingService.setDrawingColor(result);
      }
    });
  }

  private colorPickerOpen(
    rgb: RGB,
    a: number
  ): MatDialogRef<ToolsColorPickerComponent> {
    let dialogRef: MatDialogRef<ToolsColorPickerComponent>;
    dialogRef = this.dialog.open(ToolsColorPickerComponent, {
      width: TOOLS_COLOR_PICKER_WIDTH,
      data: { rgb, a },
    });
    dialogRef.updatePosition({
      top: TOOLS_COLOR_PICKER_TOP,
      left: TOOLS_COLOR_PICKER_LEFT,
    });
    return dialogRef;
  }
}
