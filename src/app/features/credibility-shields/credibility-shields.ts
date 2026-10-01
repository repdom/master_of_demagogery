import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { CredibilityShieldStore } from '../../core/services';
import {
  FREQUENCY_LABEL,
  SHIELD_LEVEL_LABEL,
  type CredibilityShield,
  type ShieldLevel,
  type ShieldWeights,
  type WeightedFactor,
} from '../../core/models';
import {
  EmptyState,
  FilterChips,
  KpiCard,
  PageHeader,
  PanelCard,
  ScoreMeter,
  SparkLine,
  type ActiveFilterChip,
  type Crumb,
} from '../../shared/ui';

type SortKey = 'outletName' | 'level' | 'trustScore' | 'divergence';
type ShieldStatus = 'ACTIVE' | 'MODULATING' | 'QUARANTINED';
type FactorKey = keyof ShieldWeights;

interface WeightRow {
  readonly key: FactorKey;
  readonly label: string;
  readonly score: number;
  readonly weight: number;
}

const FACTOR_LABEL: Readonly<Record<FactorKey, string>> = {
  citationRigor: 'Rigor en citas primarias',
  errataTransparency: 'Transparencia y fe de errores',
  headlineBalance: 'Equilibrio titular / contenido (clickbait)',
  communityDetection: 'Detección de falacias por comunidad',
};

const FACTOR_ORDER: readonly FactorKey[] = [
  'citationRigor',
  'errataTransparency',
  'headlineBalance',
  'communityDetection',
];

const STATUS_LABEL: Readonly<Record<ShieldStatus, string>> = {
  ACTIVE: 'Activo',
  MODULATING: 'Modulando',
  QUARANTINED: 'En cuarentena',
};

const ACTION_LABEL: Readonly<Record<ShieldStatus, string>> = {
  ACTIVE: 'Ajustar',
  MODULATING: 'Modulando',
  QUARANTINED: 'Auditoría',
};

const GRADE_NUMERAL: readonly string[] = ['0', 'I', 'II', 'III', 'IV'];

const REGION_CODE: Readonly<Record<string, string>> = {
  España: 'ES',
  Global: 'GL',
  'Estados Unidos': 'US',
  'Reino Unido': 'UK',
};

const TRUST_SERIES: readonly number[] = [84, 85, 84, 86, 88, 87, 89, 88, 90, 89, 91, 92];

const SIGMA_MIN = 1;
const SIGMA_MAX = 5;
const SIGMA_STEP = 0.5;

/** Credibility Shields — reputation thresholds, weighted factors and anti-manipulation rules. */
@Component({
  selector: 'app-credibility-shields',
  imports: [
    EmptyState,
    FilterChips,
    KpiCard,
    PageHeader,
    PanelCard,
    ScoreMeter,
    SparkLine,
    TuiButton,
    TuiIcon,
    TuiTextfield,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './credibility-shields.html',
  styleUrl: './credibility-shields.scss',
})
export class CredibilityShields {
  protected readonly store = inject(CredibilityShieldStore);

  protected readonly crumbs: readonly Crumb[] = [
    { label: 'Backoffice', link: '/desk' },
    { label: 'Quality & Intelligence' },
    { label: 'Credibility Shields' },
  ];

  protected readonly shieldLevelLabel = SHIELD_LEVEL_LABEL;
  protected readonly frequencyLabel = FREQUENCY_LABEL;
  protected readonly statusLabel = STATUS_LABEL;
  protected readonly trustSeries = TRUST_SERIES;
  protected readonly sigmaMin = SIGMA_MIN;
  protected readonly sigmaMax = SIGMA_MAX;

  protected readonly query = signal('');
  protected readonly level = signal<'ALL' | `${ShieldLevel}`>('ALL');
  protected readonly status = signal<'ALL' | ShieldStatus>('ALL');
  protected readonly sortKey = signal<SortKey>('trustScore');
  protected readonly sortAsc = signal(false);

  private readonly manualSelection = signal<string | null>(null);

  protected readonly levelOptions = computed(() =>
    (Object.keys(SHIELD_LEVEL_LABEL) as readonly `${ShieldLevel}`[])
      .map((key) => ({ key, label: SHIELD_LEVEL_LABEL[Number(key) as ShieldLevel] }))
      .reverse(),
  );

  /** Instant filtering: every keystroke or toggle re-derives the visible shields. */
  protected readonly rows = computed<readonly CredibilityShield[]>(() => {
    const needle = this.query().trim().toLowerCase();
    const level = this.level();
    const status = this.status();
    const key = this.sortKey();
    const direction = this.sortAsc() ? 1 : -1;

    const filtered = this.store.shields().filter((shield) => {
      if (level !== 'ALL' && shield.level !== Number(level)) {
        return false;
      }

      if (status !== 'ALL' && this.shieldStatus(shield) !== status) {
        return false;
      }

      if (!needle) {
        return true;
      }

      return (
        shield.outletName.toLowerCase().includes(needle) ||
        shield.domain.toLowerCase().includes(needle) ||
        shield.region.toLowerCase().includes(needle) ||
        shield.divergenceNote.toLowerCase().includes(needle)
      );
    });

    return [...filtered].sort((left, right) => {
      const a = left[key];
      const b = right[key];

      if (typeof a === 'number' && typeof b === 'number') {
        return (a - b) * direction;
      }

      return String(a).localeCompare(String(b), 'es') * direction;
    });
  });

  protected readonly selected = computed<CredibilityShield | null>(() => {
    const rows = this.rows();
    const match = rows.find((shield) => shield.outletId === this.manualSelection());

    return match ?? rows[0] ?? null;
  });

  protected readonly certificationLine = computed(() => {
    const shield = this.selected();

    if (!shield) {
      return '';
    }

    const index = this.store.shields().findIndex((item) => item.outletId === shield.outletId);
    const code = REGION_CODE[shield.region] ?? shield.region.slice(0, 2).toUpperCase();
    const serial = String((index + 1) * 42).padStart(4, '0');

    return `Certificación Grado ${GRADE_NUMERAL[shield.level]} · ID: SHIELD-${code}-${serial}`;
  });

  protected readonly weightRows = computed<readonly WeightRow[]>(() => {
    const shield = this.selected();

    if (!shield) {
      return [];
    }

    return FACTOR_ORDER.map((key) => ({
      key,
      label: FACTOR_LABEL[key],
      score: shield.weights[key].score,
      weight: shield.weights[key].weight,
    }));
  });

  protected readonly weightSum = computed(() =>
    this.weightRows().reduce((total, row) => total + row.weight, 0),
  );

  protected readonly chips = computed<readonly ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = [];

    if (this.query()) {
      chips.push({ id: 'query', label: `Texto: ${this.query()}` });
    }

    if (this.level() !== 'ALL') {
      chips.push({
        id: 'level',
        label: `Nivel: ${SHIELD_LEVEL_LABEL[Number(this.level()) as ShieldLevel]}`,
      });
    }

    if (this.status() !== 'ALL') {
      chips.push({ id: 'status', label: `Estado: ${STATUS_LABEL[this.status() as ShieldStatus]}` });
    }

    return chips;
  });

  /** Quarantine wins; wide AI-vs-civic gaps mean the shield is still being modulated. */
  protected shieldStatus(shield: CredibilityShield): ShieldStatus {
    if (shield.level === 0) {
      return 'QUARANTINED';
    }

    return Math.abs(shield.divergence) >= 10 ? 'MODULATING' : 'ACTIVE';
  }

  protected actionLabel(shield: CredibilityShield): string {
    return ACTION_LABEL[this.shieldStatus(shield)];
  }

  protected levelTone(level: ShieldLevel): string {
    switch (level) {
      case 4:
        return 'mod-tag_green';
      case 3:
        return 'mod-tag_gold';
      case 2:
        return '';
      case 1:
        return 'mod-tag_yellow';
      default:
        return 'mod-tag_red';
    }
  }

  protected divergenceTone(shield: CredibilityShield): string {
    const gap = Math.abs(shield.divergence);

    if (gap >= 20) {
      return 'divergence_critical';
    }

    if (gap >= 10) {
      return 'divergence_warn';
    }

    return gap >= 5 ? 'divergence_watch' : 'divergence_ok';
  }

  protected divergenceGlyph(shield: CredibilityShield): string {
    if (shield.divergence > 0) {
      return '▲';
    }

    return shield.divergence < 0 ? '▼' : '=';
  }

  protected signed(value: number): string {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  }

  protected select(outletId: string): void {
    this.manualSelection.set(outletId);
  }

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onLevel(event: Event): void {
    this.level.set((event.target as HTMLSelectElement).value as 'ALL' | `${ShieldLevel}`);
  }

  protected onStatus(event: Event): void {
    this.status.set((event.target as HTMLSelectElement).value as 'ALL' | ShieldStatus);
  }

  protected sortBy(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortAsc.update((value) => !value);

      return;
    }

    this.sortKey.set(key);
    this.sortAsc.set(true);
  }

  protected ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
    if (this.sortKey() !== key) {
      return 'none';
    }

    return this.sortAsc() ? 'ascending' : 'descending';
  }

  protected removeChip(id: string): void {
    switch (id) {
      case 'query':
        this.query.set('');
        break;
      case 'level':
        this.level.set('ALL');
        break;
      case 'status':
        this.status.set('ALL');
        break;
    }
  }

  protected clearFilters(): void {
    this.query.set('');
    this.level.set('ALL');
    this.status.set('ALL');
  }

  protected onWeight(shield: CredibilityShield, key: FactorKey, event: Event): void {
    const weight = Number((event.target as HTMLInputElement).value);
    const next: Record<FactorKey, WeightedFactor> = { ...shield.weights };

    next[key] = { score: shield.weights[key].score, weight };

    this.store.patch(shield.outletId, { weights: next });
  }

  protected toggleAntiBrigading(shield: CredibilityShield): void {
    this.store.patch(shield.outletId, { antiBrigading: !shield.antiBrigading });
  }

  protected stepSigma(shield: CredibilityShield, delta: number): void {
    const raw = shield.instantTriggerSigma + delta * SIGMA_STEP;
    const clamped = Math.min(SIGMA_MAX, Math.max(SIGMA_MIN, Math.round(raw * 2) / 2));

    this.store.patch(shield.outletId, { instantTriggerSigma: clamped });
  }
}
