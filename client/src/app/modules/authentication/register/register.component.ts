import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication/authentication.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit {
  userRegistration: FormGroup;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userRegistration = new FormGroup({
      username: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(12),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl("", Validators.required),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ]),
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.userRegistration.invalid) {
      this.openSnackBar("Something's wrong...");
      return;
    }
    this.authenticationService
      .register(
        this.userRegistration.value.username,
        this.userRegistration.value.password,
        this.userRegistration.value.email,
        this.userRegistration.value.firstName,
        this.userRegistration.value.lastName
      )
      .subscribe((response) => {
        if (response.error) {
          this.openSnackBar(response.error);
        } else {
          this.router.navigate(["/users/customize"]);
        }
      });
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 3000,
    });
  }
}
