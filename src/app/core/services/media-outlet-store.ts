import { computed, Injectable, signal } from '@angular/core';
import { MEDIA_OUTLETS } from '../data';
import type { MediaOutlet } from '../models';

/** Master registry of press sources — the single source of truth for outlets. */
@Injectable({ providedIn: 'root' })
export class MediaOutletStore {
  private readonly source = signal<readonly MediaOutlet[]>(MEDIA_OUTLETS);

  readonly outlets = this.source.asReadonly();
  readonly total = computed(() => this.source().length);
  readonly verified = computed(() => this.source().filter((outlet) => outlet.verified).length);
  readonly countries = computed(
    () => new Set(this.source().map((outlet) => outlet.country)).size,
  );
  readonly domAlerts = computed(
    () => this.source().filter((outlet) => outlet.domStatus !== 'ACTIVE').length,
  );
  readonly averageUptime = computed(() => {
    const items = this.source();
    const sum = items.reduce((total, outlet) => total + outlet.confidence, 0);

    return items.length ? Math.round((sum / items.length) * 10) / 10 : 0;
  });

  byId(id: string): MediaOutlet | undefined {
    return this.source().find((outlet) => outlet.id === id);
  }

  patch(id: string, patch: Partial<MediaOutlet>): void {
    this.source.update((outlets) =>
      outlets.map((outlet) => (outlet.id === id ? { ...outlet, ...patch } : outlet)),
    );
  }
}
