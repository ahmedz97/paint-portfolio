import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerFacadeService {
  private loadingCount = 0;
  private readonly GLOBAL_SPINNER_NAME = 'global';
  private timeoutId?: any; // Timeout to auto-hide spinner after 3 minutes
  private readonly TIMEOUT_DURATION = 3 * 1000; // 3 seconds in milliseconds

  constructor(private spinner: NgxSpinnerService) {}

  show(name?: string): void {
    if (name) {
      this.spinner.show(name);
    } else {
      this.loadingCount++;
      if (this.loadingCount === 1) {
        // Show spinner with the global name
        this.spinner.show(this.GLOBAL_SPINNER_NAME);
        
        // Set timeout to auto-hide after 3 minutes
        this.clearTimeout();
        this.timeoutId = setTimeout(() => {
          this.forceHide();
        }, this.TIMEOUT_DURATION);
      }
    }
  }

  hide(name?: string): void {
    if (name) {
      this.spinner.hide(name);
    } else {
      if (this.loadingCount > 0) {
        this.loadingCount--;
      }
      if (this.loadingCount <= 0) {
        this.loadingCount = 0; // Ensure it doesn't go negative
        // Hide spinner with the global name
        this.spinner.hide(this.GLOBAL_SPINNER_NAME);
        // Clear timeout since spinner is hidden
        this.clearTimeout();
      }
    }
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  // Force hide all spinners
  forceHide(): void {
    this.loadingCount = 0;
    this.spinner.hide(this.GLOBAL_SPINNER_NAME);
    // Clear timeout
    this.clearTimeout();
  }

  // Get current loading count (for debugging)
  getLoadingCount(): number {
    return this.loadingCount;
  }
}

