import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { TellMeAboutYourselfComponent } from "./tell-me-about-yourself/tell-me-about-yourself/tell-me-about-yourself.component";
import { UsersRoutingModule } from "./users-routing.module";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { JwtInterceptor } from "../authentication/jwt.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthGuard } from "../authentication";
import { UsersComponent } from "./users/users.component";
import { FileUploadComponent } from "./avatar/file-upload/file-upload.component";
import { MatIconModule } from "@angular/material/icon";
import { AvatarComponent } from "./avatar/avatar.component";
import { AvatarDialogComponent } from "./avatar/avatar-dialog/avatar-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { AvatarModule } from "ngx-avatar";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatTabsModule } from "@angular/material/tabs";
import { CardsModule } from "../cards/cards.module";

@NgModule({
  declarations: [
    TellMeAboutYourselfComponent,
    UserProfileComponent,
    UsersComponent,
    FileUploadComponent,
    AvatarComponent,
    AvatarDialogComponent,
  ],
  imports: [
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    UsersRoutingModule,
    AvatarModule,
    FlexLayoutModule,
    MatTabsModule,
    CardsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    AuthGuard,
  ],
  exports: [AvatarComponent],
})
export class UsersModule {}
