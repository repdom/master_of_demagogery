import { computed, Injectable, signal } from '@angular/core';
import { DEFAULT_ENGINE_SETTINGS, DIAGNOSTIC_LINES } from '../data';
import type {
  BiasGovernanceSettings,
  EloEngineSettings,
  EngineSettings,
  NlpEngineSettings,
  QuotaSettings,
} from '../models';

/** Algorithmic engine tuning: ELO, NLP heuristics, bias governance and quotas. */
@Injectable({ providedIn: 'root' })
export class EngineSettingsStore {
  private readonly current = signal<EngineSettings>(DEFAULT_ENGINE_SETTINGS);
  private readonly saved = signal<EngineSettings>(DEFAULT_ENGINE_SETTINGS);

  readonly settings = this.current.asReadonly();
  readonly diagnostics = signal(DIAGNOSTIC_LINES);
  readonly lastSync = signal('Hace 42 segundos');

  readonly dirty = computed(
    () => JSON.stringify(this.current()) !== JSON.stringify(this.saved()),
  );

  patchElo(patch: Partial<EloEngineSettings>): void {
    this.current.update((settings) => ({ ...settings, elo: { ...settings.elo, ...patch } }));
  }

  patchNlp(patch: Partial<NlpEngineSettings>): void {
    this.current.update((settings) => ({ ...settings, nlp: { ...settings.nlp, ...patch } }));
  }

  patchGovernance(patch: Partial<BiasGovernanceSettings>): void {
    this.current.update((settings) => ({
      ...settings,
      governance: { ...settings.governance, ...patch },
    }));
  }

  patchQuotas(patch: Partial<QuotaSettings>): void {
    this.current.update((settings) => ({ ...settings, quotas: { ...settings.quotas, ...patch } }));
  }

  restoreDefaults(): void {
    this.current.set(DEFAULT_ENGINE_SETTINGS);
  }

  deploy(): void {
    this.saved.set(this.current());
    this.lastSync.set('Hace unos segundos');
  }
}
