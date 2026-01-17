# Linoor Portfolio - Angular 17 SSR Application

This is a production-grade Angular 17 application with Server-Side Rendering (SSR), built using Standalone APIs and clean architecture principles.

## Features

- ✅ Angular 17 with Standalone Components
- ✅ Server-Side Rendering (SSR) with @angular/ssr
- ✅ TypeScript Strict Mode
- ✅ SCSS for styling
- ✅ Clean Architecture (Core, Shared, Features, Layouts)
- ✅ ngx-translate for i18n (English & Italian)
- ✅ ngx-spinner for loading states
- ✅ Centralized data management via `project_data.json`
- ✅ Typed models and services
- ✅ OnPush change detection for performance

## Project Structure

```
src/app/
├── core/                    # Singleton services, guards, interceptors
│   ├── services/
│   │   ├── project-data.service.ts
│   │   └── spinner-facade.service.ts
│   └── core.providers.ts
├── shared/                  # Reusable components, pipes, models
│   ├── components/
│   ├── pipes/
│   └── models/
├── features/                # Feature modules
│   ├── home/
│   ├── about/
│   ├── contact/
│   ├── services/
│   ├── portfolio/
│   └── blog/
├── layouts/                 # Layout components
│   └── main-layout/
│       ├── components/
│       │   ├── header/
│       │   └── footer/
│       └── main-layout.component.ts
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy images from the original project to `src/assets/images/`:
```bash
# Copy all images from the root images/ folder to src/assets/images/
```

## Development

### Development Server (Client-side only)
```bash
npm start
# or
ng serve
```

### Development Server with SSR
```bash
npm run dev:ssr
```

The application will be available at `http://localhost:4200` (client) or `http://localhost:4000` (SSR).

## Build

### Production Build (Client)
```bash
npm run build
```

### Production Build with SSR
```bash
npm run build:ssr
```

### Serve SSR Build
```bash
npm run serve:ssr
```

## Data Management

All static content is managed through `/src/assets/project_data.json`. The `ProjectDataService` loads this file once and caches it using `shareReplay(1)` to prevent duplicate HTTP requests.

### Adding New Content

1. Update `src/assets/project_data.json` with your content
2. Update the TypeScript models in `src/app/shared/models/project-data.model.ts` if needed
3. Components automatically receive updated data through the service

## Internationalization

Translation files are located in `src/assets/i18n/`:
- `en.json` - English translations
- `it.json` - Italian translations

To add a new language:
1. Create a new JSON file in `src/assets/i18n/`
2. Update the language selector in the header component
3. Add the language to `project_data.json` SITE.languages array

## Architecture Principles

### Standalone Components
All components are standalone (`standalone: true`). No NgModules except for server-side rendering compatibility.

### Change Detection
Reusable components use `OnPush` change detection strategy for better performance.

### SSR Compatibility
- No direct `window` or `document` usage without `isPlatformBrowser` guard
- All HTTP calls work on both server and client
- Translation files load correctly on server

### Type Safety
- Strict TypeScript configuration
- Typed models for all data structures
- No `any` types (unless absolutely necessary)

## Key Services

### ProjectDataService
- Loads `project_data.json` once
- Caches data using `shareReplay(1)`
- Provides typed getters for different sections

### SpinnerFacadeService
- Wraps ngx-spinner functionality
- Provides simple show/hide methods
- Integrated with data loading

## Troubleshooting

### SSR Errors
- Ensure all browser-only code is guarded with `isPlatformBrowser`
- Check that all HTTP requests use relative URLs
- Verify translation files are accessible

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript version compatibility
- Verify all imports use correct paths

## Next Steps

1. Copy images from original project to `src/assets/images/`
2. Implement remaining feature pages (services, portfolio, blog)
3. Add more reusable shared components as needed
4. Enhance styling to match original design
5. Add unit tests
6. Configure CI/CD pipeline

## License

Copyright 2024 by perfect solution 4u

