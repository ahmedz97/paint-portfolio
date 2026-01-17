import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, shareReplay, map } from "rxjs";
import { ProjectData } from "@shared/models/project-data.model";

@Injectable({
  providedIn: "root",
})
export class ProjectDataService {
  private readonly dataUrl = "/assets/project_data.json";
  private dataCache$?: Observable<ProjectData>;

  constructor(private http: HttpClient) {}

  getProjectData(): Observable<ProjectData> {
    if (!this.dataCache$) {
      this.dataCache$ = this.http
        .get<ProjectData>(this.dataUrl)
        .pipe(shareReplay(1));
    }
    return this.dataCache$;
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
}
