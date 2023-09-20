import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TeamRoutingModule } from "./team-routing.module";
import { TeamMainPageComponent } from "./team-main-page/team-main-page/team-main-page.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TeamProfileComponent } from "./team-profile/team-profile/team-profile.component";
import { NewTeamComponent } from "./new-team/new-team.component";
import { MatDialogModule } from "@angular/material/dialog";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { CardsModule } from "../cards/cards.module";
import { AvatarModule } from "ngx-avatar";
import { ConfirmDeleteDialogComponent } from "./team-profile/confirm-delete-dialog/confirm-delete-dialog.component";
import { MemberListDialogComponent } from "./team-profile/member-list-dialog/member-list-dialog.component";
import { ConfirmLeaveDialogComponent } from "./team-profile/confirm-leave-dialog/confirm-leave-dialog.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ConfirmJoinDialogComponent } from "./team-profile/confirm-join-dialog/confirm-join-dialog.component";
import { MatBadgeModule } from "@angular/material/badge";

@NgModule({
  declarations: [
    TeamMainPageComponent,
    TeamProfileComponent,
    NewTeamComponent,
    ConfirmDeleteDialogComponent,
    MemberListDialogComponent,
    ConfirmLeaveDialogComponent,
    ConfirmJoinDialogComponent,
  ],
  imports: [
    CommonModule,
    TeamRoutingModule,
    MatGridListModule,
    MatButtonModule,
    MatCardModule,
    FlexLayoutModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    CardsModule,
    AvatarModule,
    MatCheckboxModule,
    MatBadgeModule,
  ],
})
export class TeamModule {}
