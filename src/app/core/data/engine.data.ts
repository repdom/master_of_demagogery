import type { DiagnosticLine, EngineSettings } from '../models';
import { NLP_MODELS } from '../models';

/** Factory defaults for the scoring, NLP, governance and quota engines. */
export const DEFAULT_ENGINE_SETTINGS: EngineSettings = {
  elo: {
    kFactor: 32,
    streakMultiplier: 1.5,
    falsePositivePenalty: 10,
    exactHitBonus: 15,
    adaptiveDifficulty: true,
  },
  nlp: {
    model: NLP_MODELS[0],
    minConfidence: 75,
    mediaContextWeight: 40,
    samplingTemperature: 0.2,
    autoTagQueue: true,
  },
  governance: {
    consensusTolerance: 0.05,
    minimumEvaluations: 50,
    editorialWeight: 60,
    antiPolarization: true,
  },
  quotas: {
    dailyAttempts: 5,
    energyRechargeMinutes: 180,
    maxPvpConcurrency: 500,
    crawlerIntervalMinutes: 15,
    feedMaintenance: false,
  },
};

/** Console output rendered under the engine settings panel. */
export const DIAGNOSTIC_LINES: readonly DiagnosticLine[] = [
  {
    at: '10:48:12',
    channel: 'INFO',
    message: 'Motor Elo cargado · kFactor=32 · dificultad adaptativa activa.',
  },
  {
    at: '10:48:13',
    channel: 'INFO',
    message: 'NLP bert-multilingual-editorial-v4.2 en caliente · latencia media 118 ms.',
  },
  {
    at: '10:48:15',
    channel: 'BAYES',
    message: 'Recalibración bayesiana completada sobre 12 medios · divergencia media 6,4 pp.',
  },
  {
    at: '10:48:16',
    channel: 'BAYES',
    message: 'Aviso: deriva de sesgo en OUT-DAILYWIRE (+0,18) por encima de la tolerancia 0,05.',
  },
  {
    at: '10:48:18',
    channel: 'CRON',
    message: 'Crawler programado cada 15 min · próxima pasada 11:03:00 UTC+2.',
  },
  {
    at: '10:48:20',
    channel: 'CRON',
    message: 'Cola editorial: 14 piezas pendientes · 3 urgentes · mantenimiento del feed desactivado.',
  },
];
