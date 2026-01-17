import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Stat } from "@shared/models/project-data.model";

@Component({
  selector: "app-counter",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./counter.component.html",
  styleUrl: "./counter.component.scss",
})
export class CounterComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) stats!: Stat[];
  @ViewChild("counterSection", { static: false }) counterSection?: ElementRef;

  counterValues: { [key: number]: number } = {};
  private counterObserver?: IntersectionObserver;
  private counterAnimations: { [key: number]: any } = {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Initialize counter values
    this.stats.forEach((_, index) => {
      this.counterValues[index] = 0;
    });
  }

  ngAfterViewInit(): void {
    this.initCounterAnimation();
  }

  initCounterAnimation(): void {
    if (!this.counterSection?.nativeElement) {
      return;
    }

    // Create Intersection Observer to trigger animation when section is visible
    this.counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startCounterAnimations();
            // Disconnect observer after animation starts (only animate once)
            if (this.counterObserver) {
              this.counterObserver.disconnect();
            }
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    );

    this.counterObserver.observe(this.counterSection.nativeElement);
  }

  startCounterAnimations(): void {
    this.stats.forEach((stat, index) => {
      // Initialize counter value to 0
      this.counterValues[index] = 0;
      this.cdr.markForCheck();

      // Clear any existing animation
      if (this.counterAnimations[index]) {
        cancelAnimationFrame(this.counterAnimations[index]);
      }

      // Animate counter
      this.animateCounter(index, stat.value, stat.speed);
    });
  }

  animateCounter(index: number, targetValue: number, duration: number): void {
    const startValue = 0;
    const startTime = performance.now();
    const endTime = startTime + duration;

    const animate = (currentTime: number) => {
      if (currentTime >= endTime) {
        // Animation complete
        this.counterValues[index] = targetValue;
        this.cdr.markForCheck();
        return;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      // Calculate current value
      const currentValue = Math.floor(
        startValue + (targetValue - startValue) * easeOut
      );
      this.counterValues[index] = currentValue;
      this.cdr.markForCheck();

      // Continue animation
      this.counterAnimations[index] = requestAnimationFrame(animate);
    };

    this.counterAnimations[index] = requestAnimationFrame(animate);
  }

  getCounterValue(index: number, defaultValue: number): number {
    return this.counterValues[index] !== undefined
      ? this.counterValues[index]
      : defaultValue;
  }

  ngOnDestroy(): void {
    // Clean up observer
    if (this.counterObserver) {
      this.counterObserver.disconnect();
    }

    // Cancel all animations
    Object.values(this.counterAnimations).forEach((animationId) => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });
  }
}

