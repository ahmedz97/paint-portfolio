import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TranslateService } from "@ngx-translate/core";
import { Observable, shareReplay, map, switchMap, startWith, catchError, of } from "rxjs";
import { ProjectData } from "@shared/models/project-data.model";

@Injectable({
  providedIn: "root",
})
export class ProjectDataService {
  private readonly dataUrl = "/assets/i18n/project_data";
  private dataCache: Map<string, Observable<ProjectData>> = new Map();

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  // Get current language as observable, reactive to language changes
  private getCurrentLang$(): Observable<string> {
    const initialLang = this.translate.currentLang || this.translate.defaultLang || 'it';
    return this.translate.onLangChange.pipe(
      startWith({ lang: initialLang } as any),
      map(event => {
        const lang = event.lang || initialLang;
        // Clear cache for old language when language changes
        if (this.dataCache.size > 0) {
          // Keep only the current language in cache
          const keysToDelete: string[] = [];
          this.dataCache.forEach((_, key) => {
            if (key !== lang) {
              keysToDelete.push(key);
            }
          });
          keysToDelete.forEach(key => this.dataCache.delete(key));
        }
        return lang;
      })
    );
  }

  getProjectData(): Observable<ProjectData> {
    return this.getCurrentLang$().pipe(
      switchMap(lang => this.getProjectDataByLang(lang))
    );
  }

  private getProjectDataByLang(lang: string): Observable<ProjectData> {
    // Check cache first
    if (!this.dataCache.has(lang)) {
      const langFile = `${this.dataUrl}.${lang}.json`;
      const defaultFile = "/assets/project_data.json";
      
      // Try to load language-specific file, fallback to default if not found
      const data$ = this.http
        .get<ProjectData>(langFile)
        .pipe(
          catchError(() => {
            // If language-specific file doesn't exist, load default file
            return this.http.get<ProjectData>(defaultFile);
          }),
          shareReplay(1)
        );
      
      this.dataCache.set(lang, data$);
    }
    
    return this.dataCache.get(lang)!;
  }

  getSiteData(): Observable<ProjectData["SITE"]> {
    return this.getProjectData().pipe(map((data) => data.SITE));
  }

  getHomeData(): Observable<ProjectData["HOME"]> {
    return this.getProjectData().pipe(map((data) => data.HOME));
  }

  getFooterData(): Observable<ProjectData["FOOTER"]> {
    return this.getProjectData().pipe(map((data) => data.FOOTER));
  }

  getAboutData(): Observable<ProjectData["ABOUT"]> {
    return this.getProjectData().pipe(map((data) => data.ABOUT));
  }

  getContactData(): Observable<ProjectData["CONTACT"]> {
    return this.getProjectData().pipe(map((data) => data.CONTACT));
  }

  getGalleryData(): Observable<ProjectData["GALLERY"]> {
    return this.getProjectData().pipe(map((data) => data.GALLERY));
  }

  getVrData(): Observable<ProjectData["VR"]> {
    return this.getProjectData().pipe(map((data) => data.VR));
  }

  getServicesData(): Observable<ProjectData["SERVICES"]> {
    return this.getProjectData().pipe(map((data) => data.SERVICES));
  }

  // Method to reload data when language changes
  reloadData(): void {
    const currentLang = this.translate.currentLang || this.translate.defaultLang || 'it';
    this.dataCache.delete(currentLang);
  }
}
