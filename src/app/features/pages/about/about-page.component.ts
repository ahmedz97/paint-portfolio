import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Observable } from "rxjs";
import { ProjectDataService } from "@core/services/project-data.service";
import { SpinnerFacadeService } from "@core/services/spinner-facade.service";
import { About, Home } from "@shared/models/project-data.model";
import { SectionTitleComponent } from "@shared/components/section-title/section-title.component";
import { BannerComponent } from "@shared/components/banner/banner.component";
import { CounterComponent } from "@shared/components/counter/counter.component";
import { TeamCardComponent } from "@shared/components/team-card/team-card.component";

@Component({
  selector: "app-about-page",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SectionTitleComponent,
    BannerComponent,
    CounterComponent,
    TeamCardComponent,
  ],
  templateUrl: "./about-page.component.html",
  styleUrl: "./about-page.component.scss",
})
export class AboutPageComponent implements OnInit {
  aboutData$?: Observable<About>;
  homeData$?: Observable<Home>;
  constructor(
    private projectData: ProjectDataService,
    private spinner: SpinnerFacadeService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.aboutData$ = this.projectData.getAboutData();
    this.homeData$ = this.projectData.getHomeData();
    this.aboutData$.subscribe({
      next: () => this.spinner.hide(),
      error: () => this.spinner.hide(),
    });
  }
}
