import type { Difficulty } from './bias.model';

/** Mirrors the backend `TheoremType` enum. */
export const THEOREM_TYPES = [
  'CIRCULAR_REASONING',
  'FALSE_CAUSE',
  'HASTY_GENERALIZATION',
  'SLIPPERY_SLOPE',
  'AD_HOMINEM',
  'RED_HERRING',
  'APPEAL_TO_AUTHORITY',
  'APPEAL_TO_EMOTION',
  'APPEAL_TO_FEAR',
  'STRAW_MAN',
  'FALSE_DILEMMA',
  'CHERRY_PICKING',
  'LOADED_LANGUAGE',
  'BANDWAGON',
  'WHATABOUTISM',
] as const;

export type TheoremType = (typeof THEOREM_TYPES)[number];

export const FALLACY_FAMILIES = [
  'REASONING_ERRORS',
  'RELEVANCE',
  'FRAMING',
  'SOCIAL_PRESSURE',
] as const;

export type FallacyFamily = (typeof FALLACY_FAMILIES)[number];

export const FAMILY_LABEL: Readonly<Record<FallacyFamily, string>> = {
  REASONING_ERRORS: 'Errores de razonamiento',
  RELEVANCE: 'Falacias de relevancia',
  FRAMING: 'Falacias de encuadre / framing',
  SOCIAL_PRESSURE: 'Presión social',
};

export interface FallacyDefinition {
  readonly id: string;
  readonly type: TheoremType;
  readonly family: FallacyFamily;
  readonly nameEs: string;
  readonly nameEn: string;
  readonly definition: string;
  readonly level: Difficulty;
  readonly active: boolean;
  /** Editorial validation checklist shown to human editors. */
  readonly criteria: readonly string[];
  readonly basePoints: number;
  readonly credibilityBonus: number;
  readonly falsePositivePenalty: number;
  readonly linkedArticles: number;
  readonly detectionRate: number;
  readonly confusedWith: TheoremType | null;
  readonly confusionRate: number;
  readonly updatedAt: string;
  readonly updatedBy: string;
}

export interface EditorialTag {
  readonly id: string;
  readonly label: string;
  readonly usage: number;
}
