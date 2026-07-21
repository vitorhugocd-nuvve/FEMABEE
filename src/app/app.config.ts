import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ScreenProviders } from '../services/tela/screen-service.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    ...ScreenProviders,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
