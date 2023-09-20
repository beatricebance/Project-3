import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { FormsModule } from "@angular/forms";
import { AuthenticationRoutingModule } from "./authentication-routing.module";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtInterceptor } from "./jwt.interceptor";
import { AuthGuard } from "./auth.guard";
import { MatButtonModule } from "@angular/material/button";
import { RegisterComponent } from "./register/register.component";
import { AuthenticationNavbarComponent } from "./auth-nav/authentication-navbar/authentication-navbar.component";
import { MatToolbarModule } from "@angular/material/toolbar";

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AuthenticationNavbarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthenticationRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    AuthGuard,
  ],
})
export class AuthenticationModule {}
