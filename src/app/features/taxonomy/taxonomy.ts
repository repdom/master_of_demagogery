import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiTabs } from '@taiga-ui/kit';
import { FallacyCatalogStore } from '../../core/services';
import {
  BIAS_COLOR,
  BIAS_LABEL,
  FAMILY_LABEL,
  POLITICAL_BIASES,
  type Difficulty,
  type FallacyDefinition,
} from '../../core/models';
import {
  EmptyState,
  KpiCard,
  PageHeader,
  PanelCard,
  ScoreMeter,
  SparkLine,
  type Crumb,
} from '../../shared/ui';

const DEFINITION_MAX = 300;
const DISTORTION_SERIES: readonly number[] = [12, 18, 15, 24, 31, 27, 38, 44, 41, 52, 49, 58];

/** Taxonomy & Tags — the rhetorical ontology powering the player-facing catalogue. */
@Component({
  selector: 'app-taxonomy',
  imports: [
    EmptyState,
    KpiCard,
    PageHeader,
    PanelCard,
    ReactiveFormsModule,
    ScoreMeter,
    SparkLine,
    TuiButton,
    TuiIcon,
    TuiTabs,
    TuiTextfield,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './taxonomy.html',
  styleUrl: './taxonomy.scss',
})
export class Taxonomy {
  protected readonly store = inject(FallacyCatalogStore);

  private readonly formBuilder = inject(FormBuilder);

  protected readonly crumbs: readonly Crumb[] = [
    { label: 'Backoffice', link: '/desk' },
    { label: 'Editorial Workstation' },
    { label: 'Taxonomy & Tags' },
  ];

  protected readonly familyLabel = FAMILY_LABEL;
  protected readonly biasLabel = BIAS_LABEL;
  protected readonly biasColor = BIAS_COLOR;
  protected readonly biases = POLITICAL_BIASES;
  protected readonly definitionMax = DEFINITION_MAX;
  protected readonly distortionSeries = DISTORTION_SERIES;

  protected readonly tab = signal(0);
  protected readonly filter = signal('');
  protected readonly selectedId = signal<string | null>(null);
  protected readonly saved = signal(false);

  /** Editorial metadata is edited through a reactive form, never template-driven. */
  protected readonly form = this.formBuilder.nonNullable.group({
    nameEs: ['', [Validators.required, Validators.minLength(3)]],
    nameEn: ['', Validators.required],
    definition: ['', [Validators.required, Validators.maxLength(DEFINITION_MAX)]],
    level: [1 as Difficulty, Validators.required],
    active: [true],
    basePoints: [20, [Validators.required, Validators.min(1), Validators.max(99)]],
    credibilityBonus: [15, [Validators.required, Validators.min(0), Validators.max(99)]],
    falsePositivePenalty: [-10, [Validators.required, Validators.min(-99), Validators.max(0)]],
  });

  protected readonly buckets = computed(() => {
    const needle = this.filter().trim().toLowerCase();

    return this.store
      .byFamily()
      .map((bucket) => ({
        ...bucket,
        items: bucket.items.filter(
          (item) =>
            !needle ||
            item.nameEs.toLowerCase().includes(needle) ||
            item.nameEn.toLowerCase().includes(needle) ||
            item.type.toLowerCase().includes(needle),
        ),
      }))
      .filter((bucket) => bucket.items.length > 0);
  });

  protected readonly visibleCount = computed(() =>
    this.buckets().reduce((total, bucket) => total + bucket.items.length, 0),
  );

  protected readonly selected = computed<FallacyDefinition | null>(() => {
    const id = this.selectedId();
    const flat = this.buckets().flatMap((bucket) => bucket.items);

    return flat.find((item) => item.id === id) ?? flat[0] ?? null;
  });

  protected readonly definitionLength = computed(() => this.selected()?.definition.length ?? 0);

  protected readonly scoringRows = computed(() =>
    this.store.fallacies().map((item) => ({
      id: item.id,
      name: item.nameEs,
      type: item.type,
      level: item.level,
      basePoints: item.basePoints,
      credibilityBonus: item.credibilityBonus,
      falsePositivePenalty: item.falsePositivePenalty,
      detectionRate: item.detectionRate,
    })),
  );

  /** Bias correlation is illustrative: heavier families skew towards populist framing. */
  protected readonly biasCorrelation = computed(() => {
    const fallacy = this.selected();

    if (!fallacy) {
      return [];
    }

    return POLITICAL_BIASES.map((bias, index) => ({
      bias,
      label: BIAS_LABEL[bias],
      color: BIAS_COLOR[bias],
      share: Math.max(4, Math.round((fallacy.detectionRate + index * 7) % 100)),
    }));
  });

  constructor() {
    effect(() => {
      const fallacy = this.selected();

      if (!fallacy) {
        return;
      }

      this.saved.set(false);
      this.form.reset({
        nameEs: fallacy.nameEs,
        nameEn: fallacy.nameEn,
        definition: fallacy.definition,
        level: fallacy.level,
        active: fallacy.active,
        basePoints: fallacy.basePoints,
        credibilityBonus: fallacy.credibilityBonus,
        falsePositivePenalty: fallacy.falsePositivePenalty,
      });
    });
  }

  protected onFilter(event: Event): void {
    this.filter.set((event.target as HTMLInputElement).value);
  }

  protected select(id: string): void {
    this.selectedId.set(id);
  }

  protected save(): void {
    const fallacy = this.selected();

    if (!fallacy || this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.store.patch(fallacy.id, {
      ...this.form.getRawValue(),
      level: Number(this.form.getRawValue().level) as Difficulty,
      updatedAt: 'Hoy',
      updatedBy: 'E. Ibarra',
    });
    this.saved.set(true);
  }

  protected discard(): void {
    const fallacy = this.selected();

    if (fallacy) {
      this.form.reset({
        nameEs: fallacy.nameEs,
        nameEn: fallacy.nameEn,
        definition: fallacy.definition,
        level: fallacy.level,
        active: fallacy.active,
        basePoints: fallacy.basePoints,
        credibilityBonus: fallacy.credibilityBonus,
        falsePositivePenalty: fallacy.falsePositivePenalty,
      });
    }
  }

  protected toggleActive(fallacy: FallacyDefinition): void {
    this.store.patch(fallacy.id, { active: !fallacy.active });
  }

  protected fallacyName(type: string): string {
    return this.store.fallacies().find((item) => item.type === type)?.nameEs ?? type;
  }

  protected countForBias(index: number): number {
    return this.store.fallacies().filter((_, position) => position % 6 === index).length;
  }
}
