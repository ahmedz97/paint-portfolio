import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProjectDataService } from '@core/services/project-data.service';
import { Observable, Subscription } from 'rxjs';
import { Site, Footer } from '@shared/models/project-data.model';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, HeaderComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  siteData$?: Observable<Site>;
  footerData$?: Observable<Footer>;
  private langSubscription?: Subscription;

  constructor(
    private projectData: ProjectDataService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadData();
    
    // Reload data when language changes
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.projectData.reloadData();
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.langSubscription?.unsubscribe();
  }

  private loadData(): void {
    this.siteData$ = this.projectData.getSiteData();
    this.footerData$ = this.projectData.getFooterData();
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
  }
}

