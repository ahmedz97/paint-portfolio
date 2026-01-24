import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDataService } from '@core/services/project-data.service';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Vr } from '@shared/models/project-data.model';
import { SpinnerFacadeService } from '@core/services/spinner-facade.service';
import { BannerComponent } from "@shared/components/banner/banner.component";
@Component({
  selector: 'app-vr-page',
  standalone: true,
  imports: [CommonModule, BannerComponent],
  templateUrl: './vr-page.component.html',
  styleUrl: './vr-page.component.scss'
})
export class VrPageComponent implements OnInit, OnDestroy {
  vrData$?: Observable<Vr>;
  hoveredVideoIndex: number | null = null;
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
    this.vrData$ = this.projectData.getVrData();
    this.vrData$.subscribe({
      next: () => this.spinner.hide(),
      error: () => this.spinner.hide(),
    });
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }

  onVideoHover(index: number, videoElement: HTMLVideoElement): void {
    this.hoveredVideoIndex = index;
    videoElement.play().catch(() => {
      // Handle autoplay restrictions
    });
  }

  onVideoLeave(videoElement: HTMLVideoElement): void {
    this.hoveredVideoIndex = null;
    videoElement.pause();
  }
}
