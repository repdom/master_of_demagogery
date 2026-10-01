import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Flat 0-100 meter used for truth %, confidence, weights and factor scores. */
@Component({
  selector: 'app-score-meter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="track"
      role="meter"
      aria-valuemin="0"
      aria-valuemax="100"
      [attr.aria-valuenow]="value()"
      [attr.aria-label]="label()"
    >
      <div class="track__fill" [style.inline-size.%]="value()" [style.background]="color()"></div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-inline-size: 3rem;
    }

    .track {
      block-size: 6px;
      background: var(--mod-surface-highest);
      border-radius: 1px;
      overflow: hidden;
    }

    .track__fill {
      block-size: 100%;
      transition: inline-size var(--tui-duration) ease-out;
    }
  `,
})
export class ScoreMeter {
  readonly value = input.required<number>();
  readonly label = input('Puntuación');
  readonly tone = input<'auto' | 'gold' | 'neutral'>('auto');

  protected readonly color = computed(() => {
    if (this.tone() === 'gold') {
      return 'var(--mod-gold)';
    }

    if (this.tone() === 'neutral') {
      return 'var(--mod-primary)';
    }

    const value = this.value();

    if (value >= 80) {
      return 'var(--mod-green)';
    }

    return value >= 50 ? 'var(--mod-yellow)' : 'var(--mod-red)';
  });
}
