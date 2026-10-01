import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface ActiveFilterChip {
  readonly id: string;
  readonly label: string;
}

/** Removable chips summarising the active instant filters. */
@Component({
  selector: 'app-filter-chips',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="mod-label">Filtros activos:</span>
    @if (chips().length) {
      @for (chip of chips(); track chip.id) {
        <button type="button" class="chip" (click)="removed.emit(chip.id)">
          <span>{{ chip.label }}</span>
          <span class="chip__x" aria-hidden="true">✕</span>
          <span class="mod-visually-hidden">Quitar filtro</span>
        </button>
      }
      <button type="button" class="clear" (click)="cleared.emit()">Limpiar todo</button>
    } @else {
      <span class="mod-mono mod-muted">Ninguno</span>
    }
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      min-block-size: 24px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-block-size: 22px;
      padding: 0 6px;
      border: 1px solid var(--mod-gold);
      border-radius: var(--mod-radius);
      background: var(--mod-gold-container);
      color: var(--mod-on-surface);
      font-family: var(--mod-font-mono);
      font-size: 10.5px;
      cursor: pointer;
    }

    .chip:hover .chip__x {
      color: var(--mod-error);
    }

    .chip__x {
      color: var(--mod-on-surface-variant);
    }

    .clear {
      border: 0;
      background: transparent;
      color: var(--mod-gold);
      font-size: 11px;
      text-decoration: underline;
      cursor: pointer;
      padding: 0 4px;
    }
  `,
})
export class FilterChips {
  readonly chips = input.required<readonly ActiveFilterChip[]>();
  readonly removed = output<string>();
  readonly cleared = output<void>();
}
