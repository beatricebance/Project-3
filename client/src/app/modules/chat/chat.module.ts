import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChatComponent } from "./chat.component";
import { MatIconModule } from "@angular/material/icon";
import { PopoutWindowComponent } from "./popout-window/popout-window.component";
import { ChannelComponent } from "./channel/channel.component";
import { TextChannelService } from "./services/text-channel.service";
import { MatTabsModule } from "@angular/material/tabs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { NewChannelComponent } from "./channel/new-channel/new-channel.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
  declarations: [
    ChatComponent,
    PopoutWindowComponent,
    ChannelComponent,
    NewChannelComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
  ],
  providers: [TextChannelService],
  exports: [ChatComponent, ChannelComponent],
})
export class ChatModule {}
