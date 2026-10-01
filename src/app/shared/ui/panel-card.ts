import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

/** Tightly bound module: 1px bordered container with a monospace header strip. */
@Component({
  selector: 'app-panel-card',
  imports: [TuiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head">
      <span class="head__title mod-label">
        @if (icon()) {
          <tui-icon [icon]="icon()" />
        }
        {{ heading() }}
      </span>
      <span class="head__aside">
        <ng-content select="[panelAside]" />
      </span>
    </div>
    <div class="body" [class.body_flush]="flush()">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-inline-size: 0;
      background: var(--mod-surface-low);
      border: 1px solid var(--mod-outline-variant);
      border-radius: var(--mod-radius);
    }

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--mod-space-tight);
      padding: var(--mod-space-tight) var(--mod-space-compact);
      background: var(--mod-surface-container);
      border-bottom: 1px solid var(--mod-outline-variant);
    }

    .head__title {
      display: flex;
      align-items: center;
      gap: var(--mod-space-tight);
      color: var(--mod-gold);
    }

    .head__title tui-icon {
      font-size: 1rem;
    }

    .head__aside {
      display: flex;
      align-items: center;
      gap: var(--mod-space-tight);
    }

    .body {
      padding: var(--mod-space-compact);
      min-inline-size: 0;
      flex: 1;
    }

    .body_flush {
      padding: 0;
    }
  `,
})
export class PanelCard {
  readonly heading = input.required<string>();
  readonly icon = input<string>('');
  readonly flush = input(false);
}
