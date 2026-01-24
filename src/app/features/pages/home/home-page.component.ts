import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Observable, Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { ProjectDataService } from "@core/services/project-data.service";
import { SpinnerFacadeService } from "@core/services/spinner-facade.service";
import { Home } from "@shared/models/project-data.model";
import { SectionTitleComponent } from "@shared/components/section-title/section-title.component";
import { FeatureCardComponent } from "@shared/components/feature-card/feature-card.component";
import { CounterComponent } from "@shared/components/counter/counter.component";
import { TeamCardComponent } from "@shared/components/team-card/team-card.component";
import { Nl2brPipe } from "@shared/pipes/nl2br.pipe";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";
import mixitup from "mixitup";

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SectionTitleComponent,
    FeatureCardComponent,
    CounterComponent,
    Nl2brPipe,
    CarouselModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.scss",
})
export class HomePageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("portfolioContainer", { static: false })
  portfolioContainer?: ElementRef;
  homeData$?: Observable<Home>;
  showVideo = false;
  activeFilter: string = 'all';
  private mixitupInstance: any;
  private viewInitialized = false;
  private langSubscription?: Subscription;
  customOptions: OwlOptions = {
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    loop: true,
    autoplay: true,
    smartSpeed: 1000,
    dots: false,
    nav: false,
    items: 1,
    animateIn: "fadeIn",
    animateOut: "fadeOut",
  };

  constructor(
    private projectData: ProjectDataService,
    private spinner: SpinnerFacadeService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.homeData$ = this.projectData.getHomeData();
    this.homeData$.subscribe({
      next: () => {
        this.spinner.hide();
        // Ensure activeFilter is set to 'all' on initial load
        this.activeFilter = 'all';
        this.cdr.markForCheck();
        // Initialize mixitup if view is already initialized
        if (this.viewInitialized) {
          setTimeout(() => {
            this.initMixitup();
          }, 300);
        }
      },
      error: () => this.spinner.hide(),
    });

    // Reload data when language changes
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.spinner.show();
      this.homeData$ = this.projectData.getHomeData();
      this.homeData$.subscribe({
        next: () => {
          this.spinner.hide();
          this.activeFilter = 'all';
          this.cdr.markForCheck();
          if (this.viewInitialized) {
            setTimeout(() => {
              this.initMixitup();
            }, 300);
          }
        },
        error: () => this.spinner.hide(),
      });
    });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    // Initialize mixitup after data loads
    if (this.homeData$) {
      this.homeData$.pipe(take(1)).subscribe(() => {
        setTimeout(() => {
          this.initMixitup();
        }, 300);
      });
    }
  }

  // filter plugin for portfolio section
  initMixitup(): void {
    if (this.portfolioContainer?.nativeElement) {
      const container = this.portfolioContainer.nativeElement;
      const mixItems = container.querySelectorAll(".mix");

      if (mixItems.length > 0) {
        // Destroy existing instance if any
        if (this.mixitupInstance) {
          this.mixitupInstance.destroy();
        }

        // Initialize mixitup
        this.mixitupInstance = mixitup(container, {
          selectors: {
            target: ".mix",
          },
          animation: {
            enable: true,
            duration: 300,
            effects: "fade translateZ(-100px)",
          },
        });
      }
    }
  }

  openVideo(): void {
    this.showVideo = true;
  }

  closeVideo(): void {
    this.showVideo = false;
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    // Ensure URL has proper YouTube embed parameters with autoplay and mute
    let embedUrl = url;
    if (url.includes("youtube.com/embed/")) {
      // Add parameters to reduce tracking and improve compatibility
      const separator = url.includes("?") ? "&" : "?";
      // Check if autoplay and mute are already in URL
      const hasAutoplay = url.includes("autoplay=");
      const hasMute = url.includes("mute=");
      let params = "rel=0&modestbranding=1&playsinline=1";
      if (!hasAutoplay) {
        params += "&autoplay=1";
      }
      if (!hasMute) {
        params += "&mute=1";
      }
      embedUrl = `${url}${separator}${params}`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  ngOnDestroy(): void {
    // Clean up mixitup instance
    this.destroyMixitup();
    this.langSubscription?.unsubscribe();
  }

  // destroy mixitup instance
  destroyMixitup(): void {
    if (this.mixitupInstance) {
      this.mixitupInstance.destroy();
    }
    this.mixitupInstance = null;
  }

  // Get filtered portfolio items
  getFilteredItems(items: any[]): any[] {
    if (this.activeFilter === 'all') {
      // Show only first 6 items when 'all' filter is active
      return items.slice(0, 6);
    }
    // For other filters, return all items (mixitup will handle filtering)
    return items;
  }

  // Handle filter change
  onFilterClick(filter: string): void {
    this.activeFilter = filter;
    this.cdr.markForCheck();
    // Reinitialize mixitup after filter change to ensure all items are available
    setTimeout(() => {
      this.initMixitup();
      // Trigger mixitup filter if not 'all'
      if (filter !== 'all' && this.mixitupInstance) {
        this.mixitupInstance.filter(filter);
      }
    }, 150);
  }
}
