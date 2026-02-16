import { Component, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerFacadeService } from './core/services/spinner-facade.service';
import { ProjectDataService } from './core/services/project-data.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { filter, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translate = inject(TranslateService);
  private readonly spinner = inject(SpinnerFacadeService);
  private readonly projectData = inject(ProjectDataService);
  private readonly router = inject(Router);
  private routerSubscription?: Subscription;

  ngOnInit(): void {
    // Set default language to italian
    this.translate.setDefaultLang('it');
    
    // Show spinner initially - first page will take over
    this.spinner.show();
    
    // Preload project data
    this.projectData.getProjectData().pipe(
      take(1)
    ).subscribe({
      next: () => {
        // Data preloaded - pages will handle their own spinners
      },
      error: (err) => {
        console.error('Error loading project data:', err);
        // Hide spinner on error
        setTimeout(() => this.spinner.hide(), 100);
      }
    });

    // Set language from localStorage, browser, or default
    if (isPlatformBrowser(this.platformId)) {
      const STORAGE_KEY = 'selectedLanguage';
      const supportedLangs = ['it', 'en'];
      
      // Try to load from localStorage first
      const savedLang = localStorage.getItem(STORAGE_KEY);
      if (savedLang && supportedLangs.includes(savedLang)) {
        this.translate.use(savedLang);
      } else {
        // Fallback to browser language
        const browserLang = navigator.language.split('-')[0];
        const lang = supportedLangs.includes(browserLang) ? browserLang : 'it';
        this.translate.use(lang);
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, lang);
      }
    }

    // Track router navigation - show spinner on navigation start
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart)
      )
      .subscribe(() => {
        // Show spinner when navigation starts
        this.spinner.show();
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}

