import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { AvatarModule } from "ngx-avatar";
import { DrawingCardComponent } from "./drawing-card/drawing-card.component";
import { JoinDrawingDialogComponent } from "./drawing-card/join-drawing-dialog/join-drawing-dialog.component";
import { EditDrawingParametersDialogComponent } from "./drawing-card/edit-drawing-parameters-dialog/edit-drawing-parameters-dialog.component";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
  declarations: [
    DrawingCardComponent,
    JoinDrawingDialogComponent,
    EditDrawingParametersDialogComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    AvatarModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatOptionModule,
    MatSelectModule,
  ],
  exports: [DrawingCardComponent],
})
export class CardsModule {}
