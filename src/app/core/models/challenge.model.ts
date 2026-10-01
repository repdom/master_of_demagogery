import type { Difficulty, PoliticalBias } from './bias.model';
import type { TheoremType } from './fallacy.model';

export type QueuePriority = 'URGENT' | 'HIGH' | 'STANDARD';

export const PRIORITY_LABEL: Readonly<Record<QueuePriority, string>> = {
  URGENT: 'Urgente',
  HIGH: 'Alta',
  STANDARD: 'Estándar',
};

export type QueueStage =
  | 'TRIAGE'
  | 'ANNOTATING_DOM'
  | 'VALIDATING_METADATA'
  | 'DUAL_REVIEW'
  | 'READY'
  | 'REJECTED';

export const STAGE_LABEL: Readonly<Record<QueueStage, string>> = {
  TRIAGE: 'Pendiente triaje',
  ANNOTATING_DOM: 'Anotando DOM',
  VALIDATING_METADATA: 'Validando metadatos',
  DUAL_REVIEW: 'En revisión dual',
  READY: 'Listo publicación',
  REJECTED: 'Rechazado',
};

/** A DOM node targeted by an official fallacy annotation. */
export interface WebFallacyTarget {
  readonly id: string;
  readonly xpath: string;
  readonly cssSelector: string;
  readonly fallbackTextHash: string;
  readonly theorem: TheoremType;
  readonly severity: 'LOW' | 'MEDIUM' | 'HIGH';
  readonly excerpt: string;
  readonly validated: boolean;
}

export interface QueueItem {
  readonly id: string;
  readonly headline: string;
  readonly outletId: string;
  readonly outletName: string;
  readonly articleUrl: string;
  readonly receivedAt: string;
  readonly priority: QueuePriority;
  readonly stage: QueueStage;
  readonly editor: string | null;
  readonly editorInitials: string | null;
  readonly factualityScore: number;
  readonly officialBias: PoliticalBias;
  readonly difficulty: Difficulty;
  readonly detectedFallacies: readonly TheoremType[];
  readonly nlpDiagnosis: string;
  readonly flaggedParagraphs: readonly FlaggedParagraph[];
  readonly checklist: readonly ChecklistItem[];
  readonly trace: readonly TraceEntry[];
}

export interface FlaggedParagraph {
  readonly id: string;
  readonly ordinal: string;
  readonly domId: string;
  readonly theorem: TheoremType;
  readonly excerpt: string;
}

export interface ChecklistItem {
  readonly id: string;
  readonly label: string;
  readonly done: boolean;
}

export interface TraceEntry {
  readonly at: string;
  readonly actor: string;
  readonly detail: string;
}
