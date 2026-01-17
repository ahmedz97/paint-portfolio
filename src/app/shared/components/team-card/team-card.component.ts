import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TeamMember } from "@shared/models/project-data.model";

@Component({
  selector: "app-team-card",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./team-card.component.html",
  styleUrl: "./team-card.component.scss",
})
export class TeamCardComponent {
  @Input({ required: true }) member!: TeamMember;
}

