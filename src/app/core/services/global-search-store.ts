import { computed, inject, Injectable, signal } from '@angular/core';
import { EditorialLogStore } from './editorial-log-store';
import { FactCheckQueueStore } from './fact-check-queue-store';
import { FallacyCatalogStore } from './fallacy-catalog-store';
import { MediaOutletStore } from './media-outlet-store';

export interface SearchHit {
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  readonly link: string;
  readonly queryParams?: Readonly<Record<string, string>>;
}

export interface SearchGroup {
  readonly title: string;
  readonly hits: readonly SearchHit[];
}

const MAX_PER_GROUP = 4;

/** Omni-search over the whole corpus — results appear from the first character. */
@Injectable({ providedIn: 'root' })
export class GlobalSearchStore {
  private readonly outlets = inject(MediaOutletStore);
  private readonly fallacies = inject(FallacyCatalogStore);
  private readonly queue = inject(FactCheckQueueStore);
  private readonly logs = inject(EditorialLogStore);

  readonly query = signal('');
  readonly recent = signal<readonly string[]>(['straw man', 'el país', 'ART-2026-8891']);

  readonly groups = computed<readonly SearchGroup[]>(() => {
    const needle = this.query().trim().toLowerCase();

    if (!needle) {
      return [];
    }

    return [
      {
        title: 'Falacias',
        hits: this.fallacies
          .fallacies()
          .filter(
            (item) =>
              item.nameEs.toLowerCase().includes(needle) ||
              item.nameEn.toLowerCase().includes(needle) ||
              item.type.toLowerCase().includes(needle),
          )
          .slice(0, MAX_PER_GROUP)
          .map((item) => ({
            id: item.id,
            label: `${item.nameEs} (${item.nameEn})`,
            hint: `TheoremType.${item.type}`,
            link: '/taxonomy',
            queryParams: { fallacy: item.id },
          })),
      },
      {
        title: 'Medios',
        hits: this.outlets
          .outlets()
          .filter(
            (outlet) =>
              outlet.name.toLowerCase().includes(needle) ||
              outlet.domain.toLowerCase().includes(needle) ||
              outlet.parentGroup.toLowerCase().includes(needle),
          )
          .slice(0, MAX_PER_GROUP)
          .map((outlet) => ({
            id: outlet.id,
            label: outlet.name,
            hint: `${outlet.domain} · ${outlet.countryLabel}`,
            link: '/sources',
            queryParams: { outlet: outlet.id },
          })),
      },
      {
        title: 'Retos en cola',
        hits: this.queue
          .items()
          .filter(
            (item) =>
              item.headline.toLowerCase().includes(needle) ||
              item.id.toLowerCase().includes(needle) ||
              item.outletName.toLowerCase().includes(needle),
          )
          .slice(0, MAX_PER_GROUP)
          .map((item) => ({
            id: item.id,
            label: item.headline,
            hint: `${item.id} · ${item.outletName}`,
            link: '/queue',
            queryParams: { item: item.id },
          })),
      },
      {
        title: 'Trazas de auditoría',
        hits: this.logs
          .entries()
          .filter(
            (entry) =>
              entry.detail.toLowerCase().includes(needle) ||
              entry.actor.toLowerCase().includes(needle) ||
              entry.target.toLowerCase().includes(needle),
          )
          .slice(0, MAX_PER_GROUP)
          .map((entry) => ({
            id: entry.id,
            label: entry.action,
            hint: `${entry.timestamp} · ${entry.actor}`,
            link: '/logs',
            queryParams: { entry: entry.id },
          })),
      },
    ];
  });

  readonly totalHits = computed(() =>
    this.groups().reduce((total, group) => total + group.hits.length, 0),
  );

  remember(term: string): void {
    const value = term.trim();

    if (!value) {
      return;
    }

    this.recent.update((items) => [value, ...items.filter((item) => item !== value)].slice(0, 5));
  }

  reset(): void {
    this.query.set('');
  }
}
