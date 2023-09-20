import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "src/app/modules/authentication/models/user";

@Component({
  selector: "app-user-card",
  templateUrl: "./user-card.component.html",
  styleUrls: ["./user-card.component.scss"],
})
export class UserCardComponent implements OnInit {
  @Input() user: User;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToUserProfile() {
    this.router.navigate([`/users/${this.user._id}`]);
  }
}
