export type ShieldLevel = 0 | 1 | 2 | 3 | 4;

export const SHIELD_LEVEL_LABEL: Readonly<Record<ShieldLevel, string>> = {
  0: 'En cuarentena',
  1: 'Nivel 1 · Básico',
  2: 'Nivel 2 · Verificado',
  3: 'Nivel 3 · Alta fact.',
  4: 'Nivel 4 · Máximo',
};

export type ShieldFrequency = 'CONTINUOUS' | 'DAILY' | 'WEEKLY' | 'WATCHDOG';

export const FREQUENCY_LABEL: Readonly<Record<ShieldFrequency, string>> = {
  CONTINUOUS: 'Continua / Diaria',
  DAILY: 'Diaria',
  WEEKLY: 'Semanal',
  WATCHDOG: 'Continua (watchdog)',
};

export interface CredibilityShield {
  readonly outletId: string;
  readonly outletName: string;
  readonly domain: string;
  readonly region: string;
  readonly level: ShieldLevel;
  readonly trustScore: number;
  /** AI heuristics vs civic consensus divergence, in percentage points. */
  readonly divergence: number;
  readonly divergenceNote: string;
  readonly frequency: ShieldFrequency;
  readonly certification: string;
  readonly weights: ShieldWeights;
  readonly antiBrigading: boolean;
  readonly instantTriggerSigma: number;
}

export interface ShieldWeights {
  readonly citationRigor: WeightedFactor;
  readonly errataTransparency: WeightedFactor;
  readonly headlineBalance: WeightedFactor;
  readonly communityDetection: WeightedFactor;
}

export interface WeightedFactor {
  readonly score: number;
  readonly weight: number;
}
