import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SpinnerFacadeService } from './core/services/spinner-facade.service';
import { ProjectDataService } from './core/services/project-data.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translate = inject(TranslateService);
  private readonly spinner = inject(SpinnerFacadeService);
  private readonly projectData = inject(ProjectDataService);

  ngOnInit(): void {
    // Set default language
    this.translate.setDefaultLang('en');
    
    // Load project data on init
    this.spinner.show();
    this.projectData.getProjectData().subscribe({
      next: () => {
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error loading project data:', err);
        this.spinner.hide();
      }
    });

    // Set language from localStorage, browser, or default
    if (isPlatformBrowser(this.platformId)) {
      const STORAGE_KEY = 'selectedLanguage';
      const supportedLangs = ['en', 'it'];
      
      // Try to load from localStorage first
      const savedLang = localStorage.getItem(STORAGE_KEY);
      if (savedLang && supportedLangs.includes(savedLang)) {
        this.translate.use(savedLang);
      } else {
        // Fallback to browser language
        const browserLang = navigator.language.split('-')[0];
        const lang = supportedLangs.includes(browserLang) ? browserLang : 'en';
        this.translate.use(lang);
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, lang);
      }
    }
  }
}

