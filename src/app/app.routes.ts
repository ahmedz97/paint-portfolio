import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./layouts/main-layout/main-layout.component").then(
        (m) => m.MainLayoutComponent
      ),
    title: "Home",
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./features/pages/home/home-page.component").then(
            (m) => m.HomePageComponent
          ),
        title: "Home",
      },
      {
        path: "about",
        loadComponent: () =>
          import("./features/pages/about/about-page.component").then(
            (m) => m.AboutPageComponent
          ),
        title: "About Us",
      },
      {
        path: "contact",
        loadComponent: () =>
          import("./features/pages/contact/contact-page.component").then(
            (m) => m.ContactPageComponent
          ),
        title: "Contact Us",
      },
      {
        path: "services",
        loadComponent: () =>
          import("./features/pages/services/services-page.component").then(
            (m) => m.ServicesPageComponent
          ),
        title: "Services",
      },
      {
        path: "vr",
        loadComponent: () =>
          import("./features/pages/vr/vr-page.component").then(
            (m) => m.VrPageComponent
          ),
        title: "VR",
      },
      {
        path: "gallery",
        loadComponent: () =>
          import("./features/pages/gallery/gallery-page.component").then(
            (m) => m.GalleryPageComponent
          ),
        title: "Gallery",
      },
    ],
  },
];
