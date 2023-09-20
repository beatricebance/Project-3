import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NewDrawingComponent } from "./new-drawing.component";
import { NewDrawingAlertComponent } from "./new-drawing-alert/new-drawing-alert.component";
import { NewDrawingFormComponent } from "./new-drawing-form/new-drawing-form.component";
import { ColorPickerModule } from "src/app/modules/color-picker/color-picker.module";
import { MaterialModules } from "src/app/app-material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { NewDrawingService } from ".";
@NgModule({
  providers: [NewDrawingService],
  declarations: [
    NewDrawingAlertComponent,
    NewDrawingFormComponent,
    NewDrawingComponent,
  ],
  imports: [
    CommonModule,
    ColorPickerModule,
    MaterialModules,
    ReactiveFormsModule,
    MatDialogModule,
  ],
})
export class NewDrawingModule {}
