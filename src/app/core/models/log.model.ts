export type LogSeverity = 'INFO' | 'WARN' | 'CRITICAL';

export const SEVERITY_LABEL: Readonly<Record<LogSeverity, string>> = {
  INFO: 'Info',
  WARN: 'Warn',
  CRITICAL: 'Critical',
};

export type LogCategory =
  | 'DOM_CHALLENGE'
  | 'BIAS_CALIBRATION'
  | 'TAXONOMY'
  | 'SANCTION'
  | 'AUTH';

export const CATEGORY_LABEL: Readonly<Record<LogCategory, string>> = {
  DOM_CHALLENGE: 'Retos DOM',
  BIAS_CALIBRATION: 'Ajustes de sesgo',
  TAXONOMY: 'Cambios taxonomía',
  SANCTION: 'Sanciones / cuarentena',
  AUTH: 'Login & Auth',
};

export interface EditorialLogEntry {
  readonly id: string;
  readonly timestamp: string;
  readonly severity: LogSeverity;
  readonly category: LogCategory;
  readonly target: string;
  readonly module: string;
  readonly actor: string;
  readonly actorRole: string;
  readonly action: string;
  readonly detail: string;
  readonly hash: string;
  readonly payload: LogPayload;
}

export interface LogPayload {
  readonly transaction: string;
  readonly block: string;
  readonly actorIp: string;
  readonly environment: string;
  readonly session: string;
  readonly mfaVerified: string;
  readonly xpath: string;
  readonly diff: readonly LogDiffLine[];
  readonly json: string;
}

export interface LogDiffLine {
  readonly kind: 'context' | 'removed' | 'added';
  readonly text: string;
}
