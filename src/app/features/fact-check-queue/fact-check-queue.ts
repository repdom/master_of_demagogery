import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { FactCheckQueueStore } from '../../core/services';
import { FALLACY_DEFINITIONS } from '../../core/data';
import {
  BIAS_LABEL,
  PRIORITY_LABEL,
  STAGE_LABEL,
  type QueueItem,
  type QueueStage,
  type TheoremType,
} from '../../core/models';
import {
  BiasSpectrumBar,
  CredibilityShield,
  EmptyState,
  FactualityDot,
  FilterChips,
  PageHeader,
  PanelCard,
  type ActiveFilterChip,
  type Crumb,
} from '../../shared/ui';

type StageFilter = 'ALL' | 'CRITICAL' | 'PENDING_DOM' | 'SECOND_EDITOR' | 'READY';

interface StagePill {
  readonly id: StageFilter;
  readonly label: string;
  readonly count: number;
}

const THEOREM_NAME: Readonly<Record<string, string>> = Object.fromEntries(
  FALLACY_DEFINITIONS.map((definition) => [definition.type, definition.nameEs]),
);

/** Hashtag form used by the newsroom to tag a fallacy inside a table cell. */
function hashtag(theorem: TheoremType): string {
  return `#${(THEOREM_NAME[theorem] ?? theorem).replace(/[\s-]/g, '')}`;
}

/** Fact-Checking Queue — editorial triage, DOM annotation and dual review pipeline. */
@Component({
  selector: 'app-fact-check-queue',
  imports: [
    BiasSpectrumBar,
    CredibilityShield,
    EmptyState,
    FactualityDot,
    FilterChips,
    PageHeader,
    PanelCard,
    RouterLink,
    TuiButton,
    TuiIcon,
    TuiTextfield,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fact-check-queue.html',
  styleUrl: './fact-check-queue.scss',
})
export class FactCheckQueue {
  protected readonly store = inject(FactCheckQueueStore);

  protected readonly crumbs: readonly Crumb[] = [
    { label: 'Backoffice', link: '/desk' },
    { label: 'Editorial Workstation' },
    { label: 'Fact-Checking Queue' },
  ];

  protected readonly biasLabel = BIAS_LABEL;
  protected readonly priorityLabel = PRIORITY_LABEL;
  protected readonly stageLabel = STAGE_LABEL;

  protected readonly stageFilter = signal<StageFilter>('ALL');
  protected readonly query = signal('');
  protected readonly outlet = signal('ALL');
  protected readonly minFactuality = signal(0);
  protected readonly strongBias = signal(false);
  protected readonly heuristicHeavy = signal(false);
  protected readonly unassigned = signal(false);

  private readonly manualSelection = signal<string | null>(null);

  protected readonly outlets = computed(() => {
    const seen = new Set(this.store.items().map((item) => item.outletName));

    return [...seen].sort((left, right) => left.localeCompare(right, 'es'));
  });

  protected readonly counters = computed(() => this.store.countByStage());

  protected readonly stagePills = computed<readonly StagePill[]>(() => {
    const counters = this.store.countByStage();

    return [
      { id: 'ALL', label: 'Todos', count: this.store.total() },
      { id: 'CRITICAL', label: 'Prioridad crítica', count: this.store.criticalCount() },
      { id: 'PENDING_DOM', label: 'Pendientes DOM', count: counters.ANNOTATING_DOM },
      { id: 'SECOND_EDITOR', label: 'Esperando 2.º editor', count: counters.DUAL_REVIEW },
      { id: 'READY', label: 'Listos publicación', count: counters.READY },
    ];
  });

  /** Instant filtering: every keystroke, pill or chip re-derives the result set. */
  protected readonly rows = computed<readonly QueueItem[]>(() => {
    const stage = this.stageFilter();
    const needle = this.query().trim().toLowerCase();
    const outlet = this.outlet();
    const floor = this.minFactuality();
    const strongBias = this.strongBias();
    const heuristicHeavy = this.heuristicHeavy();
    const unassigned = this.unassigned();

    return this.store.items().filter((item) => {
      if (!this.matchesStage(item, stage)) {
        return false;
      }

      if (outlet !== 'ALL' && item.outletName !== outlet) {
        return false;
      }

      if (item.factualityScore < floor) {
        return false;
      }

      if (strongBias && !this.hasStrongBias(item)) {
        return false;
      }

      if (heuristicHeavy && item.detectedFallacies.length <= 3) {
        return false;
      }

      if (unassigned && item.editor) {
        return false;
      }

      if (!needle) {
        return true;
      }

      return (
        item.headline.toLowerCase().includes(needle) ||
        item.outletName.toLowerCase().includes(needle) ||
        (item.editor ?? '').toLowerCase().includes(needle) ||
        item.id.toLowerCase().includes(needle)
      );
    });
  });

  protected readonly selected = computed<QueueItem | null>(() => {
    const rows = this.rows();
    const manual = this.manualSelection();

    return rows.find((item) => item.id === manual) ?? rows[0] ?? null;
  });

  protected readonly chips = computed<readonly ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = [];
    const pill = this.stagePills().find((item) => item.id === this.stageFilter());

    if (pill && pill.id !== 'ALL') {
      chips.push({ id: 'stage', label: `Etapa: ${pill.label}` });
    }

    if (this.query()) {
      chips.push({ id: 'query', label: `Texto: ${this.query()}` });
    }

    if (this.outlet() !== 'ALL') {
      chips.push({ id: 'outlet', label: `Medio: ${this.outlet()}` });
    }

    if (this.minFactuality() > 0) {
      chips.push({ id: 'factuality', label: `Factualidad ≥ ${this.minFactuality()}` });
    }

    if (this.strongBias()) {
      chips.push({ id: 'bias', label: 'Sesgo fuerte' });
    }

    if (this.heuristicHeavy()) {
      chips.push({ id: 'heuristic', label: 'Heurística > 3 falacias' });
    }

    if (this.unassigned()) {
      chips.push({ id: 'unassigned', label: 'Sin asignar' });
    }

    return chips;
  });

  protected select(id: string): void {
    this.manualSelection.set(id);
  }

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onOutlet(event: Event): void {
    this.outlet.set((event.target as HTMLSelectElement).value);
  }

  protected onFactuality(event: Event): void {
    this.minFactuality.set(Number((event.target as HTMLInputElement).value));
  }

  protected removeChip(id: string): void {
    switch (id) {
      case 'stage':
        this.stageFilter.set('ALL');
        break;
      case 'query':
        this.query.set('');
        break;
      case 'outlet':
        this.outlet.set('ALL');
        break;
      case 'factuality':
        this.minFactuality.set(0);
        break;
      case 'bias':
        this.strongBias.set(false);
        break;
      case 'heuristic':
        this.heuristicHeavy.set(false);
        break;
      case 'unassigned':
        this.unassigned.set(false);
        break;
    }
  }

  protected clearFilters(): void {
    this.stageFilter.set('ALL');
    this.query.set('');
    this.outlet.set('ALL');
    this.minFactuality.set(0);
    this.strongBias.set(false);
    this.heuristicHeavy.set(false);
    this.unassigned.set(false);
  }

  protected theoremTag(theorem: TheoremType): string {
    return hashtag(theorem);
  }

  protected theoremName(theorem: TheoremType): string {
    return THEOREM_NAME[theorem] ?? theorem;
  }

  protected stageTone(stage: QueueStage): string {
    switch (stage) {
      case 'READY':
        return 'mod-tag_green';
      case 'REJECTED':
        return 'mod-tag_red';
      case 'DUAL_REVIEW':
      case 'TRIAGE':
        return 'mod-tag_yellow';
      default:
        return 'mod-tag_gold';
    }
  }

  protected actionLabel(item: QueueItem): string {
    if (!item.editor) {
      return 'Asignarme';
    }

    switch (item.stage) {
      case 'ANNOTATING_DOM':
        return 'Abrir DOM';
      case 'DUAL_REVIEW':
        return 'Co-auditar';
      default:
        return 'Revisar';
    }
  }

  protected toggleCheck(itemId: string, checkId: string): void {
    this.store.toggleChecklist(itemId, checkId);
  }

  protected approve(item: QueueItem): void {
    this.store.patch(item.id, { stage: 'READY' });
  }

  protected reject(item: QueueItem): void {
    this.store.patch(item.id, { stage: 'REJECTED' });
  }

  private matchesStage(item: QueueItem, stage: StageFilter): boolean {
    switch (stage) {
      case 'CRITICAL':
        return item.priority === 'URGENT';
      case 'PENDING_DOM':
        return item.stage === 'ANNOTATING_DOM';
      case 'SECOND_EDITOR':
        return item.stage === 'DUAL_REVIEW';
      case 'READY':
        return item.stage === 'READY';
      default:
        return true;
    }
  }

  private hasStrongBias(item: QueueItem): boolean {
    return item.officialBias === 'LEFT' || item.officialBias === 'RIGHT' || item.officialBias === 'POPULIST';
  }
}
