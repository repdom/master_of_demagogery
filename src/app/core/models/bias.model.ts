/** Political lean spectrum shared by the game and the backoffice. */
export const POLITICAL_BIASES = [
  'LEFT',
  'CENTER_LEFT',
  'CENTER',
  'CENTER_RIGHT',
  'RIGHT',
  'POPULIST',
] as const;

export type PoliticalBias = (typeof POLITICAL_BIASES)[number];

export const BIAS_LABEL: Readonly<Record<PoliticalBias, string>> = {
  LEFT: 'Izquierda',
  CENTER_LEFT: 'Centro-Izquierda',
  CENTER: 'Centro',
  CENTER_RIGHT: 'Centro-Derecha',
  RIGHT: 'Derecha',
  POPULIST: 'Populista',
};

export const BIAS_SHORT_LABEL: Readonly<Record<PoliticalBias, string>> = {
  LEFT: 'IZQ',
  CENTER_LEFT: 'C-IZQ',
  CENTER: 'CEN',
  CENTER_RIGHT: 'C-DER',
  RIGHT: 'DER',
  POPULIST: 'POP',
};

export const BIAS_COLOR: Readonly<Record<PoliticalBias, string>> = {
  LEFT: 'var(--mod-bias-left)',
  CENTER_LEFT: 'var(--mod-bias-center-left)',
  CENTER: 'var(--mod-bias-center)',
  CENTER_RIGHT: 'var(--mod-bias-center-right)',
  RIGHT: 'var(--mod-bias-right)',
  POPULIST: 'var(--mod-bias-populist)',
};

/** Factuality tier used for the 🟢🟡🔴 outlet dot. */
export type FactualityTier = 'HIGH' | 'MIXED' | 'LOW';

export const FACTUALITY_LABEL: Readonly<Record<FactualityTier, string>> = {
  HIGH: 'Alta',
  MIXED: 'Mixta',
  LOW: 'Baja',
};

export const FACTUALITY_COLOR: Readonly<Record<FactualityTier, string>> = {
  HIGH: 'var(--mod-green)',
  MIXED: 'var(--mod-yellow)',
  LOW: 'var(--mod-red)',
};

export function factualityTier(score: number): FactualityTier {
  if (score >= 80) {
    return 'HIGH';
  }

  return score >= 50 ? 'MIXED' : 'LOW';
}

/** 1 ⭐ · 2 ⭐⭐ · 3 ⭐⭐⭐ */
export type Difficulty = 1 | 2 | 3;

export const DIFFICULTY_LABEL: Readonly<Record<Difficulty, string>> = {
  1: 'Fácil',
  2: 'Media',
  3: 'Difícil',
};
