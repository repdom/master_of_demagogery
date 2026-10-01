export interface EloEngineSettings {
  readonly kFactor: number;
  readonly streakMultiplier: number;
  readonly falsePositivePenalty: number;
  readonly exactHitBonus: number;
  readonly adaptiveDifficulty: boolean;
}

export interface NlpEngineSettings {
  readonly model: string;
  readonly minConfidence: number;
  readonly mediaContextWeight: number;
  readonly samplingTemperature: number;
  readonly autoTagQueue: boolean;
}

export interface BiasGovernanceSettings {
  readonly consensusTolerance: number;
  readonly minimumEvaluations: number;
  /** 0 … 100 — share of the final score owned by the editorial staff. */
  readonly editorialWeight: number;
  readonly antiPolarization: boolean;
}

export interface QuotaSettings {
  readonly dailyAttempts: number;
  readonly energyRechargeMinutes: number;
  readonly maxPvpConcurrency: number;
  readonly crawlerIntervalMinutes: number;
  readonly feedMaintenance: boolean;
}

export interface EngineSettings {
  readonly elo: EloEngineSettings;
  readonly nlp: NlpEngineSettings;
  readonly governance: BiasGovernanceSettings;
  readonly quotas: QuotaSettings;
}

export interface DiagnosticLine {
  readonly at: string;
  readonly channel: 'INFO' | 'BAYES' | 'CRON';
  readonly message: string;
}

export const NLP_MODELS = [
  'bert-multilingual-editorial-v4.2 (99.8% precision / 120ms)',
  'bert-multilingual-editorial-v4.1 (99.1% precision / 96ms)',
  'distil-editorial-es-v2.8 (97.4% precision / 41ms)',
] as const;

export const CRAWLER_INTERVALS = [
  { value: 5, label: 'Cada 5 minutos (agresivo)' },
  { value: 15, label: 'Cada 15 minutos (normal)' },
  { value: 60, label: 'Cada hora (conservador)' },
] as const;
