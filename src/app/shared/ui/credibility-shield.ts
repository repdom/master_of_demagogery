import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Vector shield holding a credibility score in JetBrains Mono, colour-coded by tier. */
@Component({
  selector: 'app-credibility-shield',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="shield" [style.color]="color()" [attr.aria-label]="'Escudo de credibilidad ' + score()">
      <svg viewBox="0 0 24 28" aria-hidden="true">
        <path
          d="M12 1 22 5v9c0 6-4.3 11-10 13C6.3 25 2 20 2 14V5Z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        />
      </svg>
      <span class="shield__score mod-mono">{{ score() }}</span>
    </span>
  `,
  styles: `
    .shield {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 34px;
      block-size: 38px;
    }

    svg {
      position: absolute;
      inset: 0;
      inline-size: 100%;
      block-size: 100%;
    }

    .shield__score {
      position: relative;
      font-size: 11px;
      font-weight: 700;
      padding-block-start: 2px;
    }
  `,
})
export class CredibilityShield {
  readonly score = input.required<number>();

  protected readonly color = computed(() => {
    const value = this.score();

    if (value >= 80) {
      return 'var(--mod-green)';
    }

    return value >= 50 ? 'var(--mod-yellow)' : 'var(--mod-red)';
  });
}
