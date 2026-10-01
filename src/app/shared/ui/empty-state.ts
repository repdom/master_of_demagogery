import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

/** Shown when instant filtering leaves no rows. */
@Component({
  selector: 'app-empty-state',
  imports: [TuiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tui-icon [icon]="icon()" />
    <p class="title mod-body-md">{{ title() }}</p>
    <p class="hint mod-body-sm mod-muted">{{ hint() }}</p>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--mod-space-base);
      padding: var(--mod-margin);
      text-align: center;
      color: var(--mod-on-surface-variant);
    }

    tui-icon {
      font-size: 1.75rem;
      color: var(--mod-outline-variant);
    }

    .title {
      margin: 0;
      color: var(--mod-on-surface);
    }

    .hint {
      margin: 0;
      max-inline-size: 42ch;
    }
  `,
})
export class EmptyState {
  readonly title = input('Sin resultados');
  readonly hint = input('Ajusta o limpia los filtros activos para ampliar la búsqueda.');
  readonly icon = input('@tui.search-x');
}
