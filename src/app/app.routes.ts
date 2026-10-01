import { Routes } from '@angular/router';

/** Every section is lazily loaded so the workstation boots instantly. */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'desk' },
  {
    path: 'desk',
    title: 'Article Desk · Demagogia Backoffice',
    loadComponent: () => import('./features/article-desk/article-desk').then((m) => m.ArticleDesk),
  },
  {
    path: 'matrix',
    title: 'Bias Spectrum Matrix · Demagogia Backoffice',
    loadComponent: () =>
      import('./features/bias-matrix/bias-matrix').then((m) => m.BiasMatrix),
  },
  {
    path: 'queue',
    title: 'Fact-Checking Queue · Demagogia Backoffice',
    loadComponent: () =>
      import('./features/fact-check-queue/fact-check-queue').then((m) => m.FactCheckQueue),
  },
  {
    path: 'sources',
    title: 'Media Sources Ledger · Demagogia Backoffice',
    loadComponent: () =>
      import('./features/sources-ledger/sources-ledger').then((m) => m.SourcesLedger),
  },
  {
    path: 'taxonomy',
    title: 'Taxonomy & Tags · Demagogia Backoffice',
    loadComponent: () => import('./features/taxonomy/taxonomy').then((m) => m.Taxonomy),
  },
  {
    path: 'shields',
    title: 'Credibility Shields · Demagogia Backoffice',
    loadComponent: () =>
      import('./features/credibility-shields/credibility-shields').then(
        (m) => m.CredibilityShields,
      ),
  },
  {
    path: 'logs',
    title: 'Editorial Logs · Demagogia Backoffice',
    loadComponent: () =>
      import('./features/editorial-logs/editorial-logs').then((m) => m.EditorialLogs),
  },
  {
    path: 'settings',
    title: 'Engine Settings · Demagogia Backoffice',
    loadComponent: () =>
      import('./features/engine-settings/engine-settings').then((m) => m.EngineSettingsPage),
  },
  { path: '**', redirectTo: 'desk' },
];
