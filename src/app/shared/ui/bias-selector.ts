import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { BIAS_COLOR, BIAS_LABEL, POLITICAL_BIASES, type PoliticalBias } from '../../core/models';

/** Horizontal pill row used to assign the official political lean. */
@Component({
  selector: 'app-bias-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pills" role="radiogroup" [attr.aria-label]="label()">
      @for (option of options(); track option.bias) {
        <button
          type="button"
          role="radio"
          class="pill"
          [class.pill_active]="option.active"
          [attr.aria-checked]="option.active"
          [style.--pill-color]="option.color"
          (click)="value.set(option.bias)"
        >
          <span class="pill__dot" aria-hidden="true"></span>
          {{ option.label }}
        </button>
      }
    </div>
  `,
  styles: `
    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mod-space-base);
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-block-size: 28px;
      padding: 0 10px;
      border: 1px solid var(--mod-outline-variant);
      border-radius: var(--mod-radius);
      background: var(--mod-surface-container);
      color: var(--mod-on-surface-variant);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      transition: background var(--tui-duration), color var(--tui-duration);
    }

    .pill:hover {
      background: var(--mod-surface-high);
      color: var(--mod-on-surface);
    }

    .pill_active {
      border-color: var(--mod-gold);
      background: var(--mod-gold-container);
      color: var(--mod-on-surface);
      font-weight: 600;
    }

    .pill__dot {
      inline-size: 8px;
      block-size: 8px;
      border-radius: 50%;
      background: var(--pill-color);
    }
  `,
})
export class BiasSelector {
  readonly value = model.required<PoliticalBias>();
  readonly label = input('Sesgo político oficial');

  protected readonly options = computed(() =>
    POLITICAL_BIASES.map((bias) => ({
      bias,
      label: BIAS_LABEL[bias],
      color: BIAS_COLOR[bias],
      active: bias === this.value(),
    })),
  );
}
