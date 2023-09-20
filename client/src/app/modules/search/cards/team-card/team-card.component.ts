import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Team } from "src/app/shared/models/team.model";

@Component({
  selector: "app-team-card",
  templateUrl: "./team-card.component.html",
  styleUrls: ["./team-card.component.scss"],
})
export class TeamCardComponent implements OnInit {
  @Input() team: Team;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToTeam() {
    this.router.navigate([`/teams/${this.team._id}`]);
  }
}
