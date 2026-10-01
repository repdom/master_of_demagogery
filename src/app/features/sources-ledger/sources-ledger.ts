import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiTabs } from '@taiga-ui/kit';
import { MediaOutletStore } from '../../core/services';
import {
  BIAS_LABEL,
  DOM_STATUS_LABEL,
  FUNDING_LABEL,
  type FundingModel,
  type MediaOutlet,
} from '../../core/models';
import {
  BiasSpectrumBar,
  EmptyState,
  FactualityDot,
  FilterChips,
  KpiCard,
  PageHeader,
  PanelCard,
  ScoreMeter,
  SparkLine,
  type ActiveFilterChip,
  type Crumb,
} from '../../shared/ui';

type SortKey = 'name' | 'factualityScore' | 'bias' | 'challenges' | 'confidence';

const DRIFT_SERIES: readonly number[] = [42, 45, 41, 48, 52, 49, 55, 53, 58, 56, 61, 59];

/** Media Sources Ledger — master registry of press outlets and their DOM selectors. */
@Component({
  selector: 'app-sources-ledger',
  imports: [
    BiasSpectrumBar,
    EmptyState,
    FactualityDot,
    FilterChips,
    KpiCard,
    PageHeader,
    PanelCard,
    ScoreMeter,
    SparkLine,
    TuiButton,
    TuiIcon,
    TuiTabs,
    TuiTextfield,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sources-ledger.html',
  styleUrl: './sources-ledger.scss',
})
export class SourcesLedger {
  protected readonly store = inject(MediaOutletStore);

  protected readonly crumbs: readonly Crumb[] = [
    { label: 'Backoffice', link: '/desk' },
    { label: 'Editorial Workstation' },
    { label: 'Media Sources Ledger' },
  ];

  protected readonly biasLabel = BIAS_LABEL;
  protected readonly domStatusLabel = DOM_STATUS_LABEL;
  protected readonly fundingLabel = FUNDING_LABEL;
  protected readonly driftSeries = DRIFT_SERIES;

  protected readonly query = signal('');
  protected readonly country = signal('ALL');
  protected readonly funding = signal<'ALL' | FundingModel>('ALL');
  protected readonly onlyAlerts = signal(false);
  protected readonly sortKey = signal<SortKey>('name');
  protected readonly sortAsc = signal(true);
  protected readonly detailTab = signal(0);

  private readonly manualSelection = signal<string | null>(null);

  protected readonly countries = computed(() => {
    const seen = new Map<string, string>();

    for (const outlet of this.store.outlets()) {
      seen.set(outlet.country, outlet.countryLabel);
    }

    return [...seen].map(([code, label]) => ({ code, label }));
  });

  protected readonly fundingModels = computed(() => {
    const seen = new Set(this.store.outlets().map((outlet) => outlet.funding));

    return [...seen].map((model) => ({ model, label: FUNDING_LABEL[model] }));
  });

  /** Instant filtering: every keystroke or toggle re-derives the result set. */
  protected readonly rows = computed<readonly MediaOutlet[]>(() => {
    const needle = this.query().trim().toLowerCase();
    const country = this.country();
    const funding = this.funding();
    const alerts = this.onlyAlerts();
    const key = this.sortKey();
    const direction = this.sortAsc() ? 1 : -1;

    const filtered = this.store
      .outlets()
      .filter((outlet) => {
        if (country !== 'ALL' && outlet.country !== country) {
          return false;
        }

        if (funding !== 'ALL' && outlet.funding !== funding) {
          return false;
        }

        if (alerts && outlet.domStatus === 'ACTIVE') {
          return false;
        }

        if (!needle) {
          return true;
        }

        return (
          outlet.name.toLowerCase().includes(needle) ||
          outlet.domain.toLowerCase().includes(needle) ||
          outlet.parentGroup.toLowerCase().includes(needle) ||
          outlet.countryLabel.toLowerCase().includes(needle)
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

  protected readonly selected = computed<MediaOutlet | null>(() => {
    const rows = this.rows();
    const manual = this.manualSelection();
    const match = rows.find((outlet) => outlet.id === manual);

    return match ?? rows[0] ?? null;
  });

  protected readonly chips = computed<readonly ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = [];
    const country = this.countries().find((item) => item.code === this.country());

    if (this.query()) {
      chips.push({ id: 'query', label: `Texto: ${this.query()}` });
    }

    if (country) {
      chips.push({ id: 'country', label: `Jurisdicción: ${country.label}` });
    }

    if (this.funding() !== 'ALL') {
      chips.push({ id: 'funding', label: `Modelo: ${FUNDING_LABEL[this.funding() as FundingModel]}` });
    }

    if (this.onlyAlerts()) {
      chips.push({ id: 'alerts', label: 'Sólo alertas DOM' });
    }

    return chips;
  });

  protected select(id: string): void {
    this.manualSelection.set(id);
  }

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onCountry(event: Event): void {
    this.country.set((event.target as HTMLSelectElement).value);
  }

  protected onFunding(event: Event): void {
    this.funding.set((event.target as HTMLSelectElement).value as 'ALL' | FundingModel);
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
      case 'country':
        this.country.set('ALL');
        break;
      case 'funding':
        this.funding.set('ALL');
        break;
      case 'alerts':
        this.onlyAlerts.set(false);
        break;
    }
  }

  protected clearFilters(): void {
    this.query.set('');
    this.country.set('ALL');
    this.funding.set('ALL');
    this.onlyAlerts.set(false);
  }

  protected toggleVerified(outlet: MediaOutlet): void {
    this.store.patch(outlet.id, { verified: !outlet.verified });
  }

  protected domStatusTone(outlet: MediaOutlet): string {
    switch (outlet.domStatus) {
      case 'ACTIVE':
        return 'mod-tag_green';
      case 'DRIFT':
        return 'mod-tag_yellow';
      default:
        return 'mod-tag_red';
    }
  }
}
