import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BIAS_COLOR, BIAS_LABEL, POLITICAL_BIASES, type PoliticalBias } from '../../core/models';

/**
 * Ground-News style 6-segment political lean bar.
 * The segment matching `bias` is highlighted; the rest are dimmed.
 */
@Component({
  selector: 'app-bias-spectrum-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bar"
      role="img"
      [attr.aria-label]="'Sesgo político: ' + label()"
      [style.--bar-height.px]="height()"
    >
      @for (segment of segments(); track segment.bias) {
        <span
          class="bar__seg"
          [class.bar__seg_active]="segment.active"
          [style.background]="segment.color"
          [title]="segment.label"
        ></span>
      }
    </div>
    @if (showScale()) {
      <div class="scale mod-label">
        <span>Izquierda</span>
        <span>Centro</span>
        <span>Derecha</span>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      min-inline-size: 5rem;
    }

    .bar {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 2px;
      block-size: var(--bar-height, 8px);
    }

    .bar__seg {
      display: block;
      opacity: 0.25;
      border-radius: 1px;
    }

    .bar__seg_active {
      opacity: 1;
      box-shadow: 0 0 0 1px var(--mod-gold);
    }

    .scale {
      display: flex;
      justify-content: space-between;
      margin-block-start: var(--mod-space-base);
      font-size: 10px;
    }
  `,
})
export class BiasSpectrumBar {
  readonly bias = input.required<PoliticalBias>();
  readonly height = input(8);
  readonly showScale = input(false);

  protected readonly label = computed(() => BIAS_LABEL[this.bias()]);

  protected readonly segments = computed(() =>
    POLITICAL_BIASES.map((bias) => ({
      bias,
      color: BIAS_COLOR[bias],
      label: BIAS_LABEL[bias],
      active: bias === this.bias(),
    })),
  );
}
