import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { UsersModule } from "../users/users.module";
import { SettingsContainerComponent } from "./settings-container/settings-container.component";
import { EditParameterDialogComponent } from "./settings-container/user-overview/edit-parameter-dialog/edit-parameter-dialog.component";
import { UserOverviewComponent } from "./settings-container/user-overview/user-overview.component";
import { SettingsRoutingModule } from "./settings-routing.module";
import { ChangePasswordDialogComponent } from "./settings-container/user-overview/change-password-dialog/change-password-dialog.component";
import { UserHistoryComponent } from './settings-container/user-history/user-history.component';
import { EditDescriptionDialogComponent } from './settings-container/user-overview/edit-description-dialog/edit-description-dialog.component';
import { UserStatisticsComponent } from './settings-container/user-statistics/user-statistics.component';

@NgModule({
  declarations: [
    SettingsContainerComponent,
    UserOverviewComponent,
    EditParameterDialogComponent,
    ChangePasswordDialogComponent,
    UserHistoryComponent,
    EditDescriptionDialogComponent,
    UserStatisticsComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    UsersModule,
    MatSidenavModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
})
export class SettingsModule {}
