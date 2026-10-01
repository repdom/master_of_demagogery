import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

/**
 * McMaster-Carr style collapsible filter category.
 * Filters apply instantly — there is deliberately no "Apply" button anywhere.
 */
@Component({
  selector: 'app-filter-group',
  imports: [TuiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="head"
      [attr.aria-expanded]="open()"
      (click)="open.set(!open())"
    >
      <tui-icon class="head__chevron" [icon]="open() ? '@tui.chevron-down' : '@tui.chevron-right'" />
      <span class="head__label mod-label">{{ label() }}</span>
      @if (count()) {
        <span class="head__count mod-mono">{{ count() }}</span>
      }
    </button>
    @if (open()) {
      <div class="body">
        <ng-content />
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      border-bottom: 1px solid var(--mod-outline-variant);
    }

    .head {
      display: flex;
      align-items: center;
      gap: 6px;
      inline-size: 100%;
      min-block-size: 32px;
      padding: 0 var(--mod-space-tight);
      border: 0;
      background: transparent;
      color: var(--mod-on-surface);
      cursor: pointer;
      text-align: start;
    }

    .head:hover {
      background: var(--mod-surface-container);
    }

    .head__chevron {
      font-size: 0.875rem;
      color: var(--mod-on-surface-variant);
    }

    .head__label {
      flex: 1;
      color: var(--mod-on-surface);
    }

    .head__count {
      color: var(--mod-on-surface-variant);
    }

    .body {
      padding: var(--mod-space-base) var(--mod-space-tight) var(--mod-space-tight) 26px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
  `,
})
export class FilterGroup {
  readonly label = input.required<string>();
  readonly count = input<number | string>('');
  readonly open = signal(true);
}
