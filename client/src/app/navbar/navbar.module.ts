import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "./navbar.component";
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { ChatModule } from "../modules/chat/chat.module";
import { FormsModule } from "@angular/forms";
import { AvatarModule } from "ngx-avatar";
import { MatMenuModule } from "@angular/material/menu";

@NgModule({
  exports: [NavbarComponent],
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ChatModule,
    FormsModule,
    AvatarModule,
    MatMenuModule,
  ],
})
export class NavbarModule {}
