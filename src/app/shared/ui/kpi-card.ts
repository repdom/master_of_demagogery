import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

/** High-density metric tile used in the KPI strip of every section. */
@Component({
  selector: 'app-kpi-card',
  imports: [TuiIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="top">
      <span class="top__label mod-label">
        @if (icon()) {
          <tui-icon [icon]="icon()" />
        }
        {{ label() }}
      </span>
      @if (badge()) {
        <span class="mod-tag" [class]="badgeTone()">{{ badge() }}</span>
      }
    </div>

    <div class="value">
      <span class="value__main mod-headline-md">{{ value() }}</span>
      @if (unit()) {
        <span class="value__unit mod-mono mod-muted">{{ unit() }}</span>
      }
      @if (delta()) {
        <span class="value__delta mod-mono" [style.color]="deltaColor()">{{ delta() }}</span>
      }
    </div>

    <div class="foot">
      @if (note()) {
        <span class="mod-mono mod-muted">{{ note() }}</span>
      }
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--mod-space-tight);
      min-inline-size: 0;
      padding: var(--mod-space-compact);
      background: var(--mod-surface-low);
      border: 1px solid var(--mod-outline-variant);
      border-radius: var(--mod-radius);
    }

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--mod-space-tight);
    }

    .top__label {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .top__label tui-icon {
      font-size: 0.875rem;
      color: var(--mod-gold);
    }

    .value {
      display: flex;
      align-items: baseline;
      gap: var(--mod-space-tight);
      flex-wrap: wrap;
    }

    .value__main {
      font-size: 26px;
      letter-spacing: -0.01em;
    }

    .value__unit,
    .value__delta {
      font-size: 11px;
    }

    .foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--mod-space-tight);
      font-size: 10.5px;
      min-block-size: 14px;
    }
  `,
})
export class KpiCard {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly unit = input('');
  readonly delta = input('');
  readonly deltaTone = input<'positive' | 'negative' | 'neutral'>('neutral');
  readonly note = input('');
  readonly icon = input('');
  readonly badge = input('');
  readonly badgeTone = input<'mod-tag' | 'mod-tag_gold' | 'mod-tag_green' | 'mod-tag_yellow' | 'mod-tag_red'>(
    'mod-tag',
  );

  protected deltaColor(): string {
    switch (this.deltaTone()) {
      case 'positive':
        return 'var(--mod-green)';
      case 'negative':
        return 'var(--mod-red)';
      default:
        return 'var(--mod-on-surface-variant)';
    }
  }
}
