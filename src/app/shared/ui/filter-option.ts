import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

/** Checkbox row inside a filter group: label + live result count. */
@Component({
  selector: 'app-filter-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="option">
      <input
        type="checkbox"
        class="option__box"
        [checked]="checked()"
        (change)="checked.set(!checked())"
      />
      @if (swatch()) {
        <span class="option__swatch" [style.background]="swatch()" aria-hidden="true"></span>
      }
      <span class="option__label">{{ label() }}</span>
      @if (count() !== null) {
        <span class="option__count mod-mono">{{ count() }}</span>
      }
    </label>
  `,
  styles: `
    .option {
      display: flex;
      align-items: center;
      gap: 6px;
      min-block-size: 24px;
      padding-inline-end: var(--mod-space-base);
      font-size: 12.5px;
      cursor: pointer;
      color: var(--mod-on-surface-variant);
    }

    .option:hover {
      color: var(--mod-on-surface);
    }

    .option__box {
      inline-size: 14px;
      block-size: 14px;
      margin: 0;
      accent-color: var(--mod-gold);
      cursor: pointer;
      flex: none;
    }

    .option__swatch {
      inline-size: 8px;
      block-size: 8px;
      border-radius: 1px;
      flex: none;
    }

    .option__label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .option__count {
      color: var(--mod-outline);
    }
  `,
})
export class FilterOption {
  readonly checked = model(false);
  readonly label = input.required<string>();
  readonly count = input<number | null>(null);
  readonly swatch = input('');
}
