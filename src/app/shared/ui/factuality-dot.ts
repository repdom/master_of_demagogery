import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  FACTUALITY_COLOR,
  FACTUALITY_LABEL,
  factualityTier,
  type FactualityTier,
} from '../../core/models';

/** 🟢🟡🔴 factuality indicator with optional score readout. */
@Component({
  selector: 'app-factuality-dot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="dot" [style.background]="color()" aria-hidden="true"></span>
    <span class="text mod-mono" [style.color]="color()">{{ text() }}</span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .dot {
      inline-size: 7px;
      block-size: 7px;
      border-radius: 50%;
      flex: none;
    }

    .text {
      white-space: nowrap;
    }
  `,
})
export class FactualityDot {
  readonly score = input.required<number>();
  readonly withScore = input(true);

  protected readonly tier = computed<FactualityTier>(() => factualityTier(this.score()));
  protected readonly color = computed(() => FACTUALITY_COLOR[this.tier()]);
  protected readonly text = computed(() =>
    this.withScore()
      ? `${FACTUALITY_LABEL[this.tier()]} (${this.score()}/100)`
      : FACTUALITY_LABEL[this.tier()],
  );
}
