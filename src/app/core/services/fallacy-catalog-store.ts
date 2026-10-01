import { computed, Injectable, signal } from '@angular/core';
import { EDITORIAL_TAGS, FALLACY_DEFINITIONS } from '../data';
import { FALLACY_FAMILIES, type FallacyDefinition, type FallacyFamily } from '../models';

export interface FamilyBucket {
  readonly family: FallacyFamily;
  readonly items: readonly FallacyDefinition[];
}

/** Rhetorical ontology: the deep taxonomy behind the fallacy catalogue. */
@Injectable({ providedIn: 'root' })
export class FallacyCatalogStore {
  private readonly source = signal<readonly FallacyDefinition[]>(FALLACY_DEFINITIONS);

  readonly fallacies = this.source.asReadonly();
  readonly tags = signal(EDITORIAL_TAGS);
  readonly total = computed(() => this.source().length);
  readonly activeCount = computed(() => this.source().filter((item) => item.active).length);

  readonly byFamily = computed<readonly FamilyBucket[]>(() =>
    FALLACY_FAMILIES.map((family) => ({
      family,
      items: this.source().filter((item) => item.family === family),
    })),
  );

  byId(id: string): FallacyDefinition | undefined {
    return this.source().find((item) => item.id === id);
  }

  patch(id: string, patch: Partial<FallacyDefinition>): void {
    this.source.update((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }
}
