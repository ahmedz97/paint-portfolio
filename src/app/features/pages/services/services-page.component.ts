import { Home, ProjectData } from "./../../../shared/models/project-data.model";
import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable } from "rxjs";
import { Service } from "@shared/models/project-data.model";
import { ProjectDataService } from "@core/services/project-data.service";
import { SpinnerFacadeService } from "@core/services/spinner-facade.service";
import { BannerComponent } from "@shared/components/banner/banner.component";
import { SectionTitleComponent } from "@shared/components/section-title/section-title.component";
import { FeatureCardComponent } from "@shared/components/feature-card/feature-card.component";

@Component({
  selector: "app-services-page",
  standalone: true,
  imports: [
    CommonModule,
    BannerComponent,
    SectionTitleComponent,
    FeatureCardComponent,
  ],
  templateUrl: "./services-page.component.html",
  styleUrl: "./services-page.component.scss",
})
export class ServicesPageComponent implements OnInit, AfterViewInit, OnDestroy {
  serviceData$?: Observable<Service>;
  homeData$?: Observable<Home>;
  activeTab: string = "technology";

  constructor(
    private projectData: ProjectDataService,
    private spinner: SpinnerFacadeService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.serviceData$ = this.projectData.getServicesData();
    this.homeData$ = this.projectData.getHomeData();
    this.serviceData$.subscribe({
      next: (data) => {
        // Set default active tab to first tab
        if (data.work && data.work.tabs && data.work.tabs.length > 0) {
          this.activeTab = data.work.tabs[0].id;
        }
        this.spinner.hide();
      },
      error: () => this.spinner.hide(),
    });
  }

  ngAfterViewInit(): void {
    // Component initialization complete
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  switchWorkTab(tab: string): void {
    this.activeTab = tab;
  }
}
