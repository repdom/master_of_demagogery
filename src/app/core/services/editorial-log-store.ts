import { computed, Injectable, signal } from '@angular/core';
import { EDITORIAL_LOGS } from '../data';
import type { EditorialLogEntry, LogCategory } from '../models';

/** Immutable audit trail of every editorial intervention. */
@Injectable({ providedIn: 'root' })
export class EditorialLogStore {
  private readonly source = signal<readonly EditorialLogEntry[]>(EDITORIAL_LOGS);

  readonly entries = this.source.asReadonly();
  readonly total = computed(() => this.source().length);
  readonly liveStream = signal(true);

  readonly countByCategory = computed<Readonly<Record<LogCategory, number>>>(() => {
    const counters: Record<LogCategory, number> = {
      DOM_CHALLENGE: 0,
      BIAS_CALIBRATION: 0,
      TAXONOMY: 0,
      SANCTION: 0,
      AUTH: 0,
    };

    for (const entry of this.source()) {
      counters[entry.category] += 1;
    }

    return counters;
  });

  readonly criticalCount = computed(
    () => this.source().filter((entry) => entry.severity === 'CRITICAL').length,
  );

  byId(id: string): EditorialLogEntry | undefined {
    return this.source().find((entry) => entry.id === id);
  }

  toggleStream(): void {
    this.liveStream.update((value) => !value);
  }
}
