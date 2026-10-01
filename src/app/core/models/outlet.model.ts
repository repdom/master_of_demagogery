import type { FactualityTier, PoliticalBias } from './bias.model';

export type DomStatus = 'ACTIVE' | 'DRIFT' | 'BROKEN';

export const DOM_STATUS_LABEL: Readonly<Record<DomStatus, string>> = {
  ACTIVE: 'Activo',
  DRIFT: 'Alerta DOM',
  BROKEN: 'Selectores rotos',
};

export type FundingModel = 'PAYWALL' | 'ADS' | 'PUBLIC' | 'MIXED' | 'NON_PROFIT';

export const FUNDING_LABEL: Readonly<Record<FundingModel, string>> = {
  PAYWALL: 'Muro de pago',
  ADS: 'Publicidad',
  PUBLIC: 'Financiación pública',
  MIXED: 'Mixto (paywall + ads)',
  NON_PROFIT: 'Sin ánimo de lucro',
};

export interface MediaOutlet {
  readonly id: string;
  readonly name: string;
  readonly domain: string;
  readonly initials: string;
  readonly parentGroup: string;
  readonly ownership: string;
  readonly country: string;
  readonly countryLabel: string;
  readonly language: string;
  readonly funding: FundingModel;
  readonly factualityScore: number;
  readonly factuality: FactualityTier;
  readonly bias: PoliticalBias;
  /** Continuous bias vector, -1 (far left) … +1 (far right / populist). */
  readonly biasVector: number;
  /** Continuous factuality vector, 0 … 1 — Y axis of the bias matrix. */
  readonly factualityVector: number;
  readonly challenges: number;
  readonly domStatus: DomStatus;
  readonly selectorVersion: string;
  readonly confidence: number;
  readonly verified: boolean;
  readonly lastReview: string;
  readonly reviewer: string;
  readonly biasDrift: number;
  readonly credibilityScore: number;
  readonly citationRigor: number;
  readonly errataTransparency: number;
  readonly headlineBalance: number;
  readonly communityDetection: number;
}
