import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideRouter, withInMemoryScrolling } from "@angular/router";
import { provideClientHydration } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { NgxSpinnerModule } from "ngx-spinner";
import { routes } from "../app.routes";

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export const coreProviders = [
  provideRouter(
    routes,
    withInMemoryScrolling({
      scrollPositionRestoration: "top",
      anchorScrolling: "enabled",
    })
  ),
  provideHttpClient(withInterceptorsFromDi()),
  provideClientHydration(),
  provideAnimations(),
  importProvidersFrom(
    TranslateModule.forRoot({
      defaultLanguage: "en",
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgxSpinnerModule
  ),
];
