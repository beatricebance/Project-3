import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MomentModule } from "ngx-moment";
import { MaterialModules } from "./app-material.module";
import { NavbarModule } from "./navbar/navbar.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthenticationModule } from "./modules/authentication/authentication.module";
import { ChatModule } from "./modules/chat/chat.module";
import { WorkspaceModule } from "./modules/workspace/workspace.module";
import { ToolParameterModule } from "./modules/tool-parameters/tool-parameter.module";
import { NewDrawingModule } from "./modules/new-drawing/new-drawing.module";
import { ColorPickerModule } from "./modules/color-picker/color-picker.module";
import { SharedModule } from "./shared/shared.module";
import { ToolsColorModule } from "./modules/tools-color/tools-color.module";
import { ParameterMenuModule } from "./modules/parameter-menu/parameter-menu.module";
import { ErrorModule } from "./modules/error/error.module";
import { UsersModule } from "./modules/users/users.module";
import { GalleryModule } from "./modules/gallery/gallery.module";
import { SidenavModule } from "./modules/sidenav/sidenav.module";
import { DrawingsModule } from "./modules/drawings/drawings.module";
import { BackendCommunicationModule } from "./modules/backend-communication/backend-communication.module";
import { TeamModule } from "./modules/team/team.module";
import { MuseumModule } from "./modules/museum/museum.module";
import { SearchModule } from "./modules/search/search.module";
import { CardsModule } from "./modules/cards/cards.module";
import { SettingsModule } from "./modules/settings/settings.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    WorkspaceModule,
    ChatModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModules,
    FontAwesomeModule,
    ToolParameterModule,
    MomentModule,
    AuthenticationModule,
    AppRoutingModule,
    NavbarModule,
    GalleryModule,
    NewDrawingModule,
    ColorPickerModule,
    SharedModule,
    ToolsColorModule,
    ParameterMenuModule,
    UsersModule,
    SidenavModule,
    SearchModule,
    ErrorModule,
    DrawingsModule,
    TeamModule,
    BackendCommunicationModule,
    MuseumModule,
    CardsModule,
    SettingsModule,
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
