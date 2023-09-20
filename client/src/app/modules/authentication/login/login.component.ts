import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication/authentication.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(""),
      password: new FormControl(""),
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authenticationService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe((response) => {
        if (response.error) {
          this.snackBar.open(response.error, "Close", {
            duration: 3000,
          });
        } else {
          this.router.navigate([""]);
        }
      });
  }
}
