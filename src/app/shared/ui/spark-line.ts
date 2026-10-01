import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Minimal inline trend line (no chart library, no runtime cost). */
@Component({
  selector: 'app-spark-line',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" role="img" [attr.aria-label]="label()">
      <polyline
        [attr.points]="points()"
        fill="none"
        [attr.stroke]="color()"
        stroke-width="1.5"
        vector-effect="non-scaling-stroke"
      />
    </svg>
  `,
  styles: `
    :host {
      display: block;
      block-size: 28px;
    }

    svg {
      inline-size: 100%;
      block-size: 100%;
      overflow: visible;
    }
  `,
})
export class SparkLine {
  readonly series = input.required<readonly number[]>();
  readonly color = input('var(--mod-gold)');
  readonly label = input('Tendencia');

  protected readonly points = computed(() => {
    const series = this.series();

    if (series.length < 2) {
      return '0,14 100,14';
    }

    const min = Math.min(...series);
    const max = Math.max(...series);
    const span = max - min || 1;
    const step = 100 / (series.length - 1);

    return series
      .map((point, index) => `${(index * step).toFixed(1)},${(26 - ((point - min) / span) * 24).toFixed(1)}`)
      .join(' ');
  });
}
