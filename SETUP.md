# Setup Instructions

## Prerequisites
- Node.js 18+ and npm
- Angular CLI 17+

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Copy Assets**
   - Copy all images from the root `images/` folder to `src/assets/images/`
   - Ensure `project_data.json` is in `src/assets/` (already done)
   - Translation files are in `src/assets/i18n/` (already done)

3. **Verify Configuration**
   - Check `angular.json` for correct paths
   - Verify `tsconfig.json` has strict mode enabled
   - Ensure `package.json` has all required dependencies

## Running the Application

### Development (Client-side only)
```bash
npm start
```
Opens at `http://localhost:4200`

### Development with SSR
```bash
npm run dev:ssr
```
Opens at `http://localhost:4000`

## Building for Production

### Client Build
```bash
npm run build
```

### SSR Build
```bash
npm run build:ssr
```

### Serve SSR Build
```bash
npm run serve:ssr
```

## Important Notes

1. **Images Path**: All image paths in `project_data.json` use `/images/...` which maps to `src/assets/images/` in the Angular app.

2. **Navigation**: Navigation links in `project_data.json` use Angular routes (e.g., `/about` instead of `./about.html`).

3. **SSR Compatibility**: 
   - All browser-only code is guarded with `isPlatformBrowser`
   - HTTP requests use relative paths
   - Translation files load on server

4. **Data Loading**: 
   - `ProjectDataService` loads data once and caches it
   - No duplicate HTTP requests for `project_data.json`
   - Spinner shows during initial load

## Troubleshooting

### Module Not Found Errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

### SSR Errors
- Check that all imports are correct
- Verify `main.server.ts` exports the bootstrap function
- Ensure server.ts is properly configured

### Build Errors
- Check TypeScript version (should be ~5.2.2)
- Verify all paths in `tsconfig.json` are correct
- Ensure all components are marked as `standalone: true`

### Translation Not Working
- Verify translation files exist in `src/assets/i18n/`
- Check that `HttpLoaderFactory` path is correct
- Ensure `TranslateModule` is properly configured in `core.providers.ts`

