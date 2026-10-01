import { computed, Injectable, signal } from '@angular/core';
import { CREDIBILITY_SHIELDS } from '../data';
import type { CredibilityShield } from '../models';

/** Reputation algorithm oversight: shields, weights and anti-brigading rules. */
@Injectable({ providedIn: 'root' })
export class CredibilityShieldStore {
  private readonly source = signal<readonly CredibilityShield[]>(CREDIBILITY_SHIELDS);

  readonly shields = this.source.asReadonly();
  readonly total = computed(() => this.source().length);

  readonly globalTrust = computed(() => {
    const items = this.source();
    const sum = items.reduce((total, shield) => total + shield.trustScore, 0);

    return items.length ? Math.round((sum / items.length) * 10) / 10 : 0;
  });

  readonly discrepancyAlerts = computed(
    () => this.source().filter((shield) => Math.abs(shield.divergence) > 25).length,
  );

  readonly quarantined = computed(
    () => this.source().filter((shield) => shield.level === 0).length,
  );

  byId(outletId: string): CredibilityShield | undefined {
    return this.source().find((shield) => shield.outletId === outletId);
  }

  patch(outletId: string, patch: Partial<CredibilityShield>): void {
    this.source.update((shields) =>
      shields.map((shield) => (shield.outletId === outletId ? { ...shield, ...patch } : shield)),
    );
  }
}
