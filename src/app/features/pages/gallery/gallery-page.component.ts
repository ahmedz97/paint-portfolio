import { Component, HostListener, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BannerComponent } from "@shared/components/banner/banner.component";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { Gallery } from "@shared/models/project-data.model";
import { ProjectDataService } from "@core/services/project-data.service";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";

@Component({
  selector: "app-gallery-page",
  standalone: true,
  imports: [CommonModule, BannerComponent, CarouselModule],
  templateUrl: "./gallery-page.component.html",
  styleUrl: "./gallery-page.component.scss",
})
export class GalleryPageComponent implements OnInit, OnDestroy {
  galleryData$?: Observable<Gallery>;
  private langSubscription?: Subscription;

  constructor(
    private projectData: ProjectDataService,
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
    this.galleryData$ = this.projectData.getGalleryData().pipe(
      map((data) => {
        // Initialize all images and pagination
        this.allImages = data.images.map((img) => img.src);
        this.totalPages = Math.ceil(this.allImages.length / this.itemsPerPage);
        this.currentPage = 1;
        this.loadPageImages();
        return data;
      })
    );
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: false,
    smartSpeed: 500,
    dots: false,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      568: {
        items: 2,
      },
      768: {
        items: 3,
      },
      992: {
        items: 4,
      },
    },
  };

  // Pagination properties
  allImages: string[] = [];
  displayedImages: string[] = [];
  itemsPerPage = 15;
  currentPage = 1;
  totalPages = 1;

  // Lightbox properties
  isLightboxOpen = false;
  currentImageIndex = 0;
  zoomLevel = 1;
  isDragging = false;
  dragStartX = 0;
  dragStartY = 0;
  imagePositionX = 0;
  imagePositionY = 0;

  loadPageImages(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedImages = this.allImages.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPageImages();
      // Scroll to top of gallery section
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  openLightbox(index: number): void {
    // Calculate the actual index in allImages array
    const actualIndex = (this.currentPage - 1) * this.itemsPerPage + index;
    this.currentImageIndex = actualIndex;
    this.isLightboxOpen = true;
    this.zoomLevel = 1;
    this.imagePositionX = 0;
    this.imagePositionY = 0;
    document.body.style.overflow = "hidden";
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
    this.zoomLevel = 1;
    this.imagePositionX = 0;
    this.imagePositionY = 0;
    document.body.style.overflow = "";
  }

  nextImage(): void {
    if (this.currentImageIndex < this.allImages.length - 1) {
      this.currentImageIndex++;
      this.zoomLevel = 1;
      this.imagePositionX = 0;
      this.imagePositionY = 0;
    }
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.zoomLevel = 1;
      this.imagePositionX = 0;
      this.imagePositionY = 0;
    }
  }

  zoomIn(): void {
    this.zoomLevel = Math.min(this.zoomLevel + 0.25, 3);
  }

  zoomOut(): void {
    this.zoomLevel = Math.max(this.zoomLevel - 0.25, 0.5);
  }

  resetZoom(): void {
    this.zoomLevel = 1;
    this.imagePositionX = 0;
    this.imagePositionY = 0;
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.isLightboxOpen) return;

    switch (event.key) {
      case "Escape":
        this.closeLightbox();
        break;
      case "ArrowRight":
        this.nextImage();
        break;
      case "ArrowLeft":
        this.prevImage();
        break;
      case "+":
      case "=":
        event.preventDefault();
        this.zoomIn();
        break;
      case "-":
        event.preventDefault();
        this.zoomOut();
        break;
    }
  }

  onImageMouseDown(event: MouseEvent): void {
    if (this.zoomLevel > 1) {
      this.isDragging = true;
      this.dragStartX = event.clientX - this.imagePositionX;
      this.dragStartY = event.clientY - this.imagePositionY;
    }
  }

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging && this.zoomLevel > 1) {
      this.imagePositionX = event.clientX - this.dragStartX;
      this.imagePositionY = event.clientY - this.dragStartY;
    }
  }

  @HostListener("document:mouseup")
  onMouseUp(): void {
    this.isDragging = false;
  }

  get currentImage(): string {
    return this.allImages[this.currentImageIndex] || "";
  }
}
