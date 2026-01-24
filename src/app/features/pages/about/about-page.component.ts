import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { finalize, take } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
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
export class AboutPageComponent implements OnInit, OnDestroy {
  aboutData$?: Observable<About>;
  homeData$?: Observable<Home>;
  private langSubscription?: Subscription;

  constructor(
    private projectData: ProjectDataService,
    private spinner: SpinnerFacadeService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadData();

    // Reload data when language changes
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadData();
    });
  }

  private loadData(): void {
    this.spinner.show();
    
    let aboutLoaded = false;
    let homeLoaded = false;
    
    const checkAndHide = () => {
      if (aboutLoaded && homeLoaded) {
        setTimeout(() => {
          this.spinner.hide();
        }, 100);
      }
    };
    
    this.aboutData$ = this.projectData.getAboutData();
    this.homeData$ = this.projectData.getHomeData();
    
    this.aboutData$.pipe(take(1)).subscribe({
      next: () => {
        aboutLoaded = true;
        checkAndHide();
      },
      error: () => {
        aboutLoaded = true;
        checkAndHide();
      }
    });
    
    this.homeData$.pipe(take(1)).subscribe({
      next: () => {
        homeLoaded = true;
        checkAndHide();
      },
      error: () => {
        homeLoaded = true;
        checkAndHide();
      }
    });
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }
}
