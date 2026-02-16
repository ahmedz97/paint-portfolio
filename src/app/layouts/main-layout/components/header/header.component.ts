import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Site } from '@shared/models/project-data.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() siteData?: Site;

  @Output() languageChange = new EventEmitter<string>();

  private translate = inject(TranslateService);
  private langSubscription?: Subscription;
  currentLang: string = 'it';

  ngOnInit(): void {
    // Set current language from localStorage or translate service
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedLang = localStorage.getItem('selectedLanguage');
      if (savedLang) {
        this.currentLang = savedLang;
      } else {
        this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'it';
      }
    } else {
      this.currentLang = this.translate.currentLang || this.translate.defaultLang || 'it';
    }
    
    // Subscribe to language changes to update the select
    this.langSubscription = this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }

  onLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedLang = select.value;
    if (selectedLang) {
      this.translate.use(selectedLang);
      this.currentLang = selectedLang;
      this.languageChange.emit(selectedLang);
      
      // Save to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('selectedLanguage', selectedLang);
      }
    }
  }
}

