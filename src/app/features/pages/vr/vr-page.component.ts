import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDataService } from '@core/services/project-data.service';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
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
  
  // Video Lightbox properties
  isVideoLightboxOpen = false;
  currentVideoIndex = 0;
  allVideos: { src: string; class: string; caption: string }[] = [];
  
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
    this.vrData$.pipe(take(1)).subscribe({
      next: (data) => {
        // Store all videos for lightbox navigation
        this.allVideos = data.videos || [];
        // Hide spinner after data is loaded
        setTimeout(() => {
          this.spinner.hide();
        }, 100);
      },
      error: () => {
        // Hide spinner on error
        this.spinner.hide();
      }
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

  openVideoLightbox(index: number): void {
    this.currentVideoIndex = index;
    this.isVideoLightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeVideoLightbox(): void {
    this.isVideoLightboxOpen = false;
    document.body.style.overflow = '';
  }

  nextVideo(): void {
    if (this.currentVideoIndex < this.allVideos.length - 1) {
      this.currentVideoIndex++;
    }
  }

  prevVideo(): void {
    if (this.currentVideoIndex > 0) {
      this.currentVideoIndex--;
    }
  }

  get currentVideo(): { src: string; class: string; caption: string } | undefined {
    return this.allVideos[this.currentVideoIndex];
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.isVideoLightboxOpen) return;

    switch (event.key) {
      case 'Escape':
        this.closeVideoLightbox();
        break;
      case 'ArrowRight':
        this.nextVideo();
        break;
      case 'ArrowLeft':
        this.prevVideo();
        break;
    }
  }
}
